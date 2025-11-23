import { useQuery } from "@tanstack/react-query";
import type { SuiClient } from "@mysten/sui/client";
import { decryptData, deriveWorksID } from "@/lib/utils";
import { Work } from "./useGetStudioWorks";
import { useAppContext } from "@/app/context/appContext";
import { blobIdFromInt } from "@mysten/walrus";
import { useSignPersonalMessage } from "@mysten/dapp-kit";
import { bcs } from "@mysten/sui/bcs";
import { toBase64 } from "@mysten/sui/utils";

export function arrayBufferToImageUrl(buf: ArrayBuffer) {
  const blob = new Blob([buf], { type: "image/png" });
  return URL.createObjectURL(blob);
}

const ZING_NAUTILUS_BASE_URL = "https://enclave.staging.zing.you";

// BCS struct definitions for signing
const RequestIntentStruct = bcs.struct("RequestIntent", {
  wallet: bcs.Address,
  wallet_type: bcs.string(),
  content_id: bcs.string(),
  timestamp_ms: bcs.u64(),
  nonce: bcs.string(),
});

const PersonalMessage = bcs.struct("PersonalMessage", {
  message: bcs.vector(bcs.u8()),
});

interface DecryptFilesRequest {
  encrypted_content: string; // base64
  personal_message: string; // base64 encoded Personal Message content
  signature: string;
}

async function decryptInNautilus(
  encryptedContent: ArrayBuffer,
  contentId: string,
  walletAddress: string,
  signPersonalMessage: (bytes: Uint8Array) => Promise<{ signature: string }>,
): Promise<ArrayBuffer> {
  // Generate nonce (random hex string)
  const nonce = Math.random().toString(16).substring(2, 12);

  const intent = {
    wallet: walletAddress,
    wallet_type: "native",
    content_id: contentId,
    timestamp_ms: BigInt(Date.now()),
    nonce: nonce,
  };

  console.log({ intent });

  // BCS serialize for signing
  const messageBytes = RequestIntentStruct.serialize(intent).toBytes();
  console.log({ messageBytes: toBase64(messageBytes) });

  const personalMessage = PersonalMessage.serialize({
    message: messageBytes,
  });
  console.log({ personalMessage: toBase64(personalMessage.toBytes()) });

  // Wallet signMessage (Sui supports raw bytes)
  const sig = await signPersonalMessage(messageBytes);
  console.log({ sig });

  // Prepare request body
  const requestBody: DecryptFilesRequest = {
    encrypted_content: toBase64(new Uint8Array(encryptedContent)),
    personal_message: toBase64(personalMessage.toBytes()),
    signature: sig.signature,
  };

  // Send request to Nautilus
  const response = await fetch(`${ZING_NAUTILUS_BASE_URL}/files/decrypt`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`Nautilus decryption failed: ${response.statusText}`);
  }

  return await response.arrayBuffer();
}

const WALRUS_AGGREGATOR_TESTNET =
  "https://aggregator.walrus-testnet.walrus.space";

async function decodeArticle(
  suiClient: SuiClient,
  owner: string,
  article: Work,
  fileKey: CryptoKey | null,
  signPersonalMessage: (bytes: Uint8Array) => Promise<{ signature: string }>,
) {
  const studioWorksId = deriveWorksID(owner);

  const objectRes = await suiClient.getDynamicFieldObject({
    parentId: studioWorksId,
    name: {
      type: "0x2::object::ID",
      value: article.id.id,
    },
  });

  const isOwner = objectRes.error?.code !== "dynamicFieldNotFound";
  console.log({ foo: isOwner, bar: owner, baz: article.id.id, objectRes });
  if (objectRes.error?.code === "notExists") {
    console.error("Not owner");
    return {
      works: [],
      isOwner,
    };
  }

  if (isOwner) {
    // use local decrypted fileKey to decrypt to retrieve raw content
    // file key not setup
    if (!fileKey) {
      console.error("fileKey not setup");
      return {
        works: [],
        isOwner,
      };
    }

    const tasks = article.files.contents.map(async (file) => {
      const blobIndex = Number(file.value.blob_index);
      const blob = article.blobs[blobIndex];
      if (!blob) return null;

      const quiltId = blobIdFromInt(blob.blob_id);
      const url = `${WALRUS_AGGREGATOR_TESTNET}/v1/blobs/by-quilt-id/${quiltId}/${file.key}`;

      const res = await fetch(url);
      console.log({ res });
      if (!res.ok) return null;

      const arrayBuffer = await res.arrayBuffer();
      const bytes = await decryptData(fileKey, arrayBuffer);
      const headers: any = {};
      res.headers.forEach((value, key) => {
        headers[key.toLowerCase()] = value;
      });

      return {
        fileKey: file.key,
        bytes,
        headers,
      };
    });

    // Filter out null (failed) results
    const works = (await Promise.all(tasks)).filter(Boolean);

    return {
      works,
      isOwner,
    };
  } else {
    // fetch nautilus
    const tasks = article.files.contents.map(async (file) => {
      const blobIndex = Number(file.value.blob_index);
      const blob = article.blobs[blobIndex];
      if (!blob) return null;

      const quiltId = blobIdFromInt(blob.blob_id);
      const url = `${WALRUS_AGGREGATOR_TESTNET}/v1/blobs/by-quilt-id/${quiltId}/${file.key}`;

      const res = await fetch(url);
      console.log({ res });
      if (!res.ok) return null;

      const encryptedContent = await res.arrayBuffer();
      const bytes = await decryptInNautilus(
        encryptedContent,
        url,
        owner,
        signPersonalMessage,
      );

      const headers: any = {};
      res.headers.forEach((value, key) => {
        headers[key.toLowerCase()] = value;
      });

      return {
        fileKey: file.key,
        bytes,
        headers,
      };
    });

    // Filter out null (failed) results
    const works = (await Promise.all(tasks)).filter(Boolean);

    return {
      works,
      isOwner,
    };
  }
}

export const getDecodedArticleQueryKey = (
  owner?: string | null,
  articleId?: string,
) => ["article", owner, articleId];

export function useGetDecodedArticle(
  suiClient?: SuiClient,
  owner?: string,
  article?: Work,
) {
  const { fileKey } = useAppContext();
  const articleId = article?.id.id;
  const { mutateAsync: signPersonalMessage } = useSignPersonalMessage();

  const wrappedSignPersonalMessage = async (bytes: Uint8Array) => {
    const result = await signPersonalMessage({
      message: bytes,
    });

    return { signature: result.signature };
  };
  return useQuery({
    queryKey: getDecodedArticleQueryKey(owner, articleId),
    queryFn: async () => {
      if (!suiClient || !owner || !articleId) {
        throw new Error("SuiClient, owner and articleId are required");
      }
      return decodeArticle(
        suiClient,
        owner,
        article,
        fileKey,
        wrappedSignPersonalMessage,
      );
    },
    enabled: Boolean(suiClient && owner && article),
    retry: (failureCount, error) => {
      console.log({ error });
      // Don't retry if the studio doesn't exist
      if (error instanceof Error && error.message.includes("notExists")) {
        return false;
      }
      return false;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    refetchOnMount: false, // Only fetch if data is stale
  });
}
