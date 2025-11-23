import { useQuery } from "@tanstack/react-query";
import type { SuiClient } from "@mysten/sui/client";
import { decryptData, deriveWorksID } from "@/lib/utils";
import { Work } from "./useGetStudioWorks";
import { useAppContext } from "@/app/context/appContext";
import { blobIdFromInt } from "@mysten/walrus";

export function arrayBufferToImageUrl(buf: ArrayBuffer) {
  const blob = new Blob([buf], { type: "image/png" });
  return URL.createObjectURL(blob);
}

const WALRUS_AGGREGATOR_TESTNET =
  "https://aggregator.walrus-testnet.walrus.space";
// curl "$AGGREGATOR/v1/blobs/by-quilt-id/TePeJnvUymp65x0z0G4y0QA5Rn3K_hcUr8ySSkmMSas/zing-watermark-test.png"

async function decodeArticle(
  suiClient: SuiClient,
  owner: string,
  article: Work,
  fileKey: CryptoKey | null,
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
  return useQuery({
    queryKey: getDecodedArticleQueryKey(owner, articleId),
    queryFn: async () => {
      if (!suiClient || !owner || !articleId) {
        throw new Error("SuiClient, owner and articleId are required");
      }
      return decodeArticle(suiClient, owner, article, fileKey);
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
