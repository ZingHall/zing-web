import {
  certifyArticleBlob,
  finalizePublishArticle,
  startPublishArticle,
} from "@/_generated/zing_studio/app";
import {
  articleBlobAddMetadata,
  articleBlobRemoveMetadata,
  articleBlobInsertOrUpdateMetadataPair,
} from "@/_generated/zing_studio/article";
import { _new as newMetadata } from "@/_generated/zing_studio/deps/walrus/metadta";
import {
  deriveStorageID,
  deriveStudioID,
  WALRUS_SYSTEM_SHARED_OBJECT_REF,
  ZING_STORAGE_TREASURY_SHARED_OBJECT_REF,
  ZING_STUDIO_CONFIG_SHARED_OBJECT_REF,
  ZING_STUDIO_PACKAGE_ADDRESS,
  WAL_TESTNET_PACKAGE_ADDRESS,
} from "@/lib/utils";
import { bcs } from "@mysten/sui/bcs";
import { Transaction } from "@mysten/sui/transactions";
import { toBase64 } from "@mysten/sui/utils";
import { blobIdToInt } from "@mysten/walrus";
import type { SealClient } from "@mysten/seal";
import type {
  CertifyBlobOptions,
  EncodingType,
  WalrusClient,
  WalrusFile,
  WriteFilesFlowOptions,
  WriteFilesFlowRegisterOptions,
  WriteFilesFlowUploadOptions,
} from "@mysten/walrus";
import { QuiltPatchId } from "@/lib/bcs";
import { useMutation } from "@tanstack/react-query";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { useAppContext } from "@/app/context/appContext";
import { SuiJsonRpcClient } from "@mysten/sui/jsonRpc";

const DIGEST_LEN = 32;
const BLOB_ID_LEN = 32;
const REDSTUFF_CODING_TYPE = 1;

/**
 * Decrypt a WalrusBlob and return a new WalrusBlob wrapping the decrypted bytes.
 *
 * @param blob - original WalrusBlob
 * @param decryptFn - async function (Uint8Array) => Promise<Uint8Array>
 * @param client - optional WalrusClient to attach to the new WalrusBlob (can be used if you need network ops)
 */

export type WalrusUploadFlowStage =
  | "encode"
  | "register_blob"
  | "upload"
  | "certify_blob"
  | "fetching_files"
  | "publish";

async function getObjectId(
  suiClient: SuiJsonRpcClient,
  walrusClient: WalrusClient,
  digest: string,
) {
  const {
    transaction: { effects },
  } = await suiClient.core.waitForTransaction({
    digest,
  });

  if (!effects.digest) throw new Error("fail to get transaction hash");

  const events = await suiClient.getTransactionBlock({
    digest: effects.digest,
    options: {
      showEvents: true,
    },
  });

  const createdBlobEvent = events.events?.find(
    (e) =>
      e.type ===
      "0xfdc88f7d7cf30afab2f82e8380d11ee8f70efb90e863d1de8616fae1bb09ea77::events::BlobRegistered",
  );
  const blobObjectId = (createdBlobEvent?.parsedJson as any)
    .object_id as string;

  const publishArticleEvent = events.events?.find(
    (e) =>
      e.type ===
      "0xf245105e9896942a02614e4dbbb6c6636452879d58b1e12db1e0364c0d1532a7::article::PublishArticle",
  );
  const articleId = (publishArticleEvent?.parsedJson as any)
    .article_id as string;

  return { articleId, blobObjectId };
}
function encodeQuiltPatchId(id: typeof QuiltPatchId.$inferInput) {
  return urlSafeBase64(QuiltPatchId.serialize(id).toBytes());
}
function urlSafeBase64(bytes: Uint8Array): string {
  return toBase64(bytes)
    .replace(/=*$/, "")
    .replaceAll("+", "-")
    .replaceAll("/", "_");
}
function getMaxFaultyNodes(nShards: number): number {
  return Math.floor((nShards - 1) / 3);
}
function decodingSafetyLimit(
  nShards: number,
  encodingType: EncodingType,
): number {
  switch (encodingType) {
    case "RedStuff":
      return Math.min(5, Math.floor(getMaxFaultyNodes(nShards) / 5));
    case "RS2":
      return 0;
    default:
      throw new Error(`Encountered unknown encoding type of ${encodingType}`);
  }
}
function signersToBitmap(signers: number[], committeeSize: number): Uint8Array {
  const bitmapSize = Math.ceil(committeeSize / 8);
  const bitmap = new Uint8Array(bitmapSize);

  for (const signer of signers) {
    const byteIndex = Math.floor(signer / 8);
    const bitIndex = signer % 8;
    bitmap[byteIndex] |= 1 << bitIndex;
  }

  return bitmap;
}
export function getSourceSymbols(
  nShards: number,
  encodingType: EncodingType = "RS2",
) {
  const safetyLimit = decodingSafetyLimit(nShards, encodingType);
  const maxFaulty = getMaxFaultyNodes(nShards);
  const minCorrect = nShards - maxFaulty;

  return {
    primarySymbols: minCorrect - maxFaulty - safetyLimit,
    secondarySymbols: minCorrect - safetyLimit,
  };
}
export function encodedSliverSize(
  unencodedLength: number,
  nShards: number,
  encodingType: EncodingType = "RS2",
): number {
  const { primarySymbols, secondarySymbols } = getSourceSymbols(
    nShards,
    encodingType,
  );

  let symbolSize =
    Math.floor(
      (Math.max(unencodedLength, 1) - 1) / (primarySymbols * secondarySymbols),
    ) + 1;

  if (encodingType === "RS2" && symbolSize % 2 === 1) {
    symbolSize = symbolSize + 1;
  }

  const singleShardSize = (primarySymbols + secondarySymbols) * symbolSize;

  return singleShardSize * nShards;
}
export function encodedBlobLength(
  unencodedLength: number,
  nShards: number,
  encodingType: EncodingType = "RS2",
): number {
  const sliverSize = encodedSliverSize(unencodedLength, nShards, encodingType);
  const metadata = nShards * DIGEST_LEN * 2 + BLOB_ID_LEN;
  return nShards * metadata + sliverSize;
}

export function publishArticle(
  walrusClient: WalrusClient,
  fileSize: number,
  owner: string,
  blobId: string,
  rootHash: Uint8Array,
  articleMetadata: {
    identifier: string;
    tags: {
      "content-type": string;
    };
    size: number;
    isPublic: boolean;
  }[],
  attributes: Record<string, string | null>,
  existingAttributes: Record<string, string> | null,
) {
  return async (tx: Transaction) => {
    const systemState = await walrusClient.systemState();
    const encodedSize = encodedBlobLength(
      fileSize,
      systemState.committee.n_shards,
    );

    console.log({ fileSize, encodedSize });
    console.log({ articleMetadata });
    const [article, publishReceipt] = tx.add(
      startPublishArticle({
        package: ZING_STUDIO_PACKAGE_ADDRESS,
        arguments: {
          config: tx.sharedObjectRef(ZING_STUDIO_CONFIG_SHARED_OBJECT_REF),
          studio: tx.object(deriveStudioID(owner)),
          walrusSystem: tx.sharedObjectRef(WALRUS_SYSTEM_SHARED_OBJECT_REF),
          storageTreasury: tx.sharedObjectRef(
            ZING_STORAGE_TREASURY_SHARED_OBJECT_REF,
          ),
          storageSpace: tx.object(deriveStorageID(owner)),
          subscriptionLevel: null,
          blobId: blobIdToInt(blobId),
          rootHash: BigInt(bcs.u256().parse(rootHash)),
          unencodedBlobSize: fileSize, // we do the encodedSize calculation on-chain
          encodingType: REDSTUFF_CODING_TYPE,
          identifiers: tx.pure.vector(
            "string",
            articleMetadata.map((m) => m.identifier),
          ),
          blobIndexes: tx.pure.vector(
            "u64",
            articleMetadata.map(() => 0),
          ),
          mimeTypes: tx.pure.vector(
            "string",
            articleMetadata.map((m) => m.tags["content-type"]),
          ),
          metadataSizes: tx.pure.vector(
            "u64",
            articleMetadata.map((m) => m.size),
          ),
        },
      }),
    );

    if (!existingAttributes) {
      tx.add(
        articleBlobAddMetadata({
          package: ZING_STUDIO_PACKAGE_ADDRESS,
          arguments: {
            config: tx.sharedObjectRef(ZING_STUDIO_CONFIG_SHARED_OBJECT_REF),
            self: article,
            blobIndex: tx.pure.u64(0),
            metadata: newMetadata({
              package: WAL_TESTNET_PACKAGE_ADDRESS,
            }),
          },
        }),
      );
    }

    Object.keys(attributes).forEach((key) => {
      const value = attributes[key];

      if (value === null) {
        if (existingAttributes && key in existingAttributes) {
          tx.add(
            articleBlobRemoveMetadata({
              package: ZING_STUDIO_PACKAGE_ADDRESS,
              arguments: {
                config: tx.sharedObjectRef(
                  ZING_STUDIO_CONFIG_SHARED_OBJECT_REF,
                ),
                self: article,
                blobIndex: tx.pure.u64(0),
                key,
              },
            }),
          );
        }
      } else {
        tx.add(
          articleBlobInsertOrUpdateMetadataPair({
            package: ZING_STUDIO_PACKAGE_ADDRESS,
            arguments: {
              config: tx.sharedObjectRef(ZING_STUDIO_CONFIG_SHARED_OBJECT_REF),
              self: article,
              blobIndex: tx.pure.u64(0),
              key,
              value,
            },
          }),
        );
      }
    });

    // put article to studio
    tx.add(
      finalizePublishArticle({
        package: ZING_STUDIO_PACKAGE_ADDRESS,
        arguments: {
          config: tx.sharedObjectRef(ZING_STUDIO_CONFIG_SHARED_OBJECT_REF),
          studio: tx.object(deriveStudioID(owner)),
          receipt: publishReceipt,
          article: article,
        },
      }),
    );
  };
}

export function certifyArticleBlobTransaction(
  walrusClient: WalrusClient,
  owner: string,
  articleId: string,
  {
    blobId,
    blobObjectId,
    confirmations,
    certificate,
    deletable,
  }: CertifyBlobOptions,
) {
  return async (tx: Transaction) => {
    const systemState = await walrusClient.systemState();
    const combinedSignature =
      certificate ??
      (await walrusClient.certificateFromConfirmations({
        confirmations,
        blobId,
        deletable,
        blobObjectId,
      }));
    tx.add(
      certifyArticleBlob({
        package: ZING_STUDIO_PACKAGE_ADDRESS,
        arguments: {
          config: tx.sharedObjectRef(ZING_STUDIO_CONFIG_SHARED_OBJECT_REF),
          studio: tx.object(deriveStudioID(owner)),
          walrusSystem: tx.sharedObjectRef(WALRUS_SYSTEM_SHARED_OBJECT_REF),
          articleId: tx.object(articleId),
          blobIndex: tx.pure.u64(0),
          signature: tx.pure.vector("u8", combinedSignature.signature),
          signersBitmap: tx.pure.vector(
            "u8",
            signersToBitmap(
              combinedSignature.signers,
              systemState.committee.members.length,
            ),
          ),
          message: tx.pure.vector("u8", combinedSignature.serializedMessage),
        },
      }),
    );
  };
}

export const zingWriteFlow = (
  suiClient: SuiJsonRpcClient,
  walrusClient: WalrusClient,
  sealClient: SealClient,
  studioObjectId: string | null,
  owner: string,
  articleMetadata: {
    identifier: string;
    tags: {
      "content-type": string;
    };
    size: number;
    isPublic: boolean;
  }[],
  options: WriteFilesFlowOptions,
  withUploadRelayClient: boolean,
) => {
  const { files } = options;

  const encode = async () => {
    const { quilt, index } = await walrusClient.encodeQuilt({
      blobs: await Promise.all(
        files.map(async (file, i) => {
          const contents = await file.bytes();
          let bytes;
          if (studioObjectId) {
            // seal encode
            const { encryptedObject: encryptedBytes } =
              await sealClient.encrypt({
                threshold: 1,
                packageId: ZING_STUDIO_PACKAGE_ADDRESS,
                id: deriveStudioID(owner),
                data: contents,
              });

            bytes = encryptedBytes;
          } else {
            bytes = contents;
          }

          return {
            contents: bytes,
            identifier: (await file.getIdentifier()) ?? `file-${i}`,
            tags: (await file.getTags()) ?? {},
          };
        }),
      ),
    });

    // store encryptedBytes
    const metadata = withUploadRelayClient
      ? await walrusClient.computeBlobMetadata({
          bytes: quilt,
        })
      : await walrusClient.encodeBlob(quilt);

    return {
      metadata,
      size: quilt.length,
      data: withUploadRelayClient ? quilt : undefined,
      index,
    };
  };

  const register = (
    { data, metadata, index, size }: Awaited<ReturnType<typeof encode>>,
    { deletable, owner, attributes }: WriteFilesFlowRegisterOptions,
  ) => {
    const transaction = new Transaction();

    // 1. rent storage space and publish article
    transaction.add(
      publishArticle(
        walrusClient,
        size,
        owner,
        metadata.blobId,
        metadata.rootHash,
        articleMetadata,
        { _walrusBlobType: "quilt", ...attributes },
        null,
      ),
    );

    console.log({ registerTransaction: transaction });

    return {
      registerTransaction: transaction,
      index,
      data,
      metadata,
      deletable,
    };
  };

  const upload = async (
    { index, data, metadata, deletable }: Awaited<ReturnType<typeof register>>,
    { digest }: WriteFilesFlowUploadOptions,
  ) => {
    const { articleId, blobObjectId } = await getObjectId(
      suiClient,
      walrusClient,
      digest,
    );

    if (withUploadRelayClient) {
      const meta = metadata as Awaited<
        ReturnType<typeof walrusClient.computeBlobMetadata>
      >;
      return {
        index,
        articleId,
        blobObjectId,
        metadata,
        deletable,
        certificate: (
          await walrusClient.writeBlobToUploadRelay({
            blobId: metadata.blobId,
            blob: data!,
            nonce: meta.nonce,
            txDigest: digest,
            blobObjectId,
            deletable,
            encodingType: meta.metadata.encodingType as EncodingType,
          })
        ).certificate,
      };
    }

    const meta = metadata as Awaited<
      ReturnType<typeof walrusClient.encodeBlob>
    >;

    return {
      index,
      blobObjectId,
      articleId,
      metadata,
      deletable,
      confirmations: await walrusClient.writeEncodedBlobToNodes({
        blobId: metadata.blobId,
        objectId: blobObjectId,
        metadata: meta.metadata,
        sliversByNode: meta.sliversByNode,
        deletable,
      }),
    };
  };

  const certify = ({
    index,
    metadata,
    confirmations,
    certificate,
    articleId,
    blobObjectId,
    deletable,
  }: Awaited<ReturnType<typeof upload>>) => {
    console.log({ confirmations });
    const tx = new Transaction();

    if (confirmations) {
      tx.add(
        certifyArticleBlobTransaction(walrusClient, owner, articleId, {
          certificate,
          blobId: metadata.blobId,
          blobObjectId,
          confirmations,
          deletable,
        }),
      );
    } else {
      tx.add(
        certifyArticleBlobTransaction(walrusClient, owner, articleId, {
          certificate,
          blobId: metadata.blobId,
          blobObjectId,
          deletable,
        }),
      );
    }
    return {
      index,
      blobObjectId,
      metadata,
      transaction: tx,
    };
  };

  async function listFiles({
    index,
    blobObjectId,
    metadata,
  }: Awaited<ReturnType<typeof certify>>) {
    return index.patches.map((patch) => ({
      id: encodeQuiltPatchId({
        quiltId: metadata.blobId,
        patchId: {
          version: 1,
          startIndex: patch.startIndex,
          endIndex: patch.endIndex,
        },
      }),
      blobId: metadata.blobId,
      blobObjectId,
    }));
  }

  const stepResults: {
    encode?: Awaited<ReturnType<typeof encode>>;
    register?: Awaited<ReturnType<typeof register>>;
    upload?: Awaited<ReturnType<typeof upload>>;
    certify?: Awaited<ReturnType<typeof certify>>;
    listFiles?: never;
  } = {};

  function getResults<T extends keyof typeof stepResults>(
    step: T,
    current: keyof typeof stepResults,
  ): NonNullable<(typeof stepResults)[T]> {
    if (!stepResults[step]) {
      throw new Error(`${step} must be executed before calling ${current}`);
    }
    return stepResults[step];
  }

  return {
    encode: async () => {
      if (!stepResults.encode) {
        stepResults.encode = await encode();
      }
    },
    register: (options: WriteFilesFlowRegisterOptions) => {
      stepResults.register = register(
        getResults("encode", "register"),
        options,
      );
      return stepResults.register.registerTransaction;
    },
    upload: async (options: WriteFilesFlowUploadOptions) => {
      stepResults.upload = await upload(
        getResults("register", "upload"),
        options,
      );
    },
    certify: () => {
      stepResults.certify = certify(getResults("upload", "certify"));
      return stepResults.certify.transaction;
    },
    listFiles: async () => listFiles(getResults("certify", "listFiles")),
  };
};

export function usePublishArticle() {
  const { sealClient, suiJsonRpcClient } = useAppContext();
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction();

  return useMutation({
    mutationFn: async ({
      walrusFiles,
      metadata,
      isPublic,
      onProgress,
    }: {
      walrusFiles: WalrusFile[];
      metadata: {
        identifier: string;
        tags: {
          "content-type": string;
        };
        size: number;
        isPublic: boolean;
      }[];
      isPublic: boolean;
      onProgress?: (stage: WalrusUploadFlowStage) => void;
    }) => {
      if (!currentAccount) return;

      const report = (stage: WalrusUploadFlowStage) => {
        if (onProgress) onProgress(stage);
      };

      const owner = currentAccount?.address;

      if (!owner) throw new Error("no signer");
      // Step 1: Create and encode the flow (can be done immediately when file is selected)
      const flow = zingWriteFlow(
        suiJsonRpcClient,
        suiJsonRpcClient.walrus,
        sealClient,
        isPublic ? null : deriveStudioID(owner),
        owner,
        metadata,
        {
          files: walrusFiles,
        },
        true,
      );

      report("encode");
      await flow.encode();

      // Step 2: Register the blob (triggered by user clicking a register button after the encode step)
      async function handleRegister() {
        if (!owner)
          throw new Error("suiaddress not found in zkloginsignerstate");

        report("register_blob");
        const registerTx = flow.register({
          epochs: 1,
          owner,
          deletable: true,
        });

        const registerTxEffects = await signAndExecuteTransaction({
          transaction: registerTx,
        });

        if (!registerTxEffects?.digest)
          throw new Error("fail to execute register Blob transaction");

        const finalizedTransaction = await suiJsonRpcClient.waitForTransaction({
          digest: registerTxEffects.digest,
        });
        // Step 3: Upload the data to storage nodes
        // This can be done immediately after the register step, or as a separate step the user initiates
        report("upload");
        await flow.upload({ digest: finalizedTransaction.digest });
      }

      await handleRegister();

      // Step 4: Certify the blob (triggered by user clicking a certify button after the blob is uploaded)
      async function handleCertify() {
        report("certify_blob");
        const certifyTx = flow.certify();

        const certifyTxEffects = await signAndExecuteTransaction({
          transaction: certifyTx,
        });

        if (!certifyTxEffects?.digest)
          throw new Error("fail to execute certify Blob transaction");

        await suiJsonRpcClient.waitForTransaction({
          digest: certifyTxEffects.digest,
        });

        report("fetching_files");
        // Step 5: Get the new files
        const blobs = await flow.listFiles();

        return blobs;
      }

      return await handleCertify();
    },
    onSuccess: async () => {},
  });
}
