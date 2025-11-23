"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { importFileKey } from "@/app/hooks/queries/useGetFileKey";
import { useGetStudio } from "@/app/hooks/queries/useGetStudio";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useSessionKeyUtils } from "@/app/hooks/queries/useSessionKey";
import { useAppContext } from "@/app/context/appContext";
import {
  usePublishArticle,
  WalrusUploadFlowStage,
} from "@/app/hooks/mutations/usePublish";
import { WalrusFile } from "@mysten/walrus";
import { encryptData, FIXED_FILE_IV } from "@/lib/utils";

export default function PublishTab() {
  const [embedFile, setEmbedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const { sealClient, fileKey, setFileKey } = useAppContext();
  const { data: studio } = useGetStudio(suiClient, currentAccount?.address);
  const [uploadStatus, setUploadStatus] = useState<WalrusUploadFlowStage>();

  const sealSessoinKeyUtils = useSessionKeyUtils();

  const [isDecrypting, setIsDecrypting] = useState(false);
  const handleDecryptFileKey = async () => {
    if (!studio || !studio.encrypted_file_key) return;
    try {
      setIsDecrypting(true);
      const fileKey = studio.encrypted_file_key;
      const sessionKey = await sealSessoinKeyUtils.createSessionKey({
        suiClient,
      });

      if (!sessionKey) {
        console.error("fail to fetch sessionKey");
        return;
      }
      const txBytes =
        await sealSessoinKeyUtils.createSealApproveTransactionBytes({
          suiClient,
          studioId: studio.id.id,
        });

      const decryptedKey = await sealClient.decrypt({
        data: new Uint8Array(fileKey),
        sessionKey,
        txBytes,
      });

      console.log({ decryptedKeyBytes: decryptedKey });

      const cryptoKey = await importFileKey(decryptedKey);
      setFileKey(cryptoKey);
    } catch (error) {
      console.error({ error });
    } finally {
      setIsDecrypting(false);
    }
  };

  const { mutateAsync: publishArticle, isPending: isPublishing } =
    usePublishArticle();
  const handlePublish = async () => {
    if (!embedFile || !fileKey) return;

    const pngMetadata = {
      identifier: "zing-watermark-test.png",
      tags: {
        "content-type": "image/png",
      },
      size: embedFile.size,
      isPublic: false,
    };
    const fileBytes = new Uint8Array(await embedFile.arrayBuffer());
    const contents = await encryptData(fileKey, fileBytes, FIXED_FILE_IV);
    const pngFile = WalrusFile.from({
      contents,
      identifier: "zing-watermark-test.png",
      tags: {
        "content-type": "image/png",
      },
    });

    await publishArticle({
      walrusFiles: [pngFile],
      metadata: [pngMetadata],
      onProgress: setUploadStatus,
    });
  };

  useEffect(() => {
    if (!embedFile) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(embedFile);
    setPreviewUrl(url);

    // Cleanup the object URL when the component unmounts or file changes
    return () => URL.revokeObjectURL(url);
  }, [embedFile]);

  console.log({ uploadStatus });

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-black dark:text-zinc-50">
        Publish your Image
      </h2>
      {studio ? (
        <>
          <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded mb-5">
            <h3 className="font-medium text-black dark:text-zinc-50 mb-2">
              File Key Status
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex space-x-2 items-center">
                <div
                  className={`w-3 h-3 rounded-full ${fileKey ? "bg-green-500" : "bg-red-500"}`}
                ></div>
                <span
                  className={`text-sm font-medium ${fileKey ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                >
                  {fileKey ? "Encrypted" : "Decrypted"}
                </span>
              </div>
              {!fileKey && (
                <button
                  onClick={handleDecryptFileKey}
                  disabled={isDecrypting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Decrypt FileKey
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                Upload <span className="text-red-500">*PNG</span> Image
              </label>

              <input
                id="file-upload"
                type="file"
                accept="image/png"
                onChange={(e) => setEmbedFile(e.target.files?.[0] || null)}
                className="hidden"
              />

              <label
                htmlFor="file-upload"
                className="w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 cursor-pointer text-center"
              >
                {embedFile ? embedFile.name : "Select PNG File"}
              </label>

              {previewUrl && (
                <div className="mt-2 border border-zinc-300 dark:border-zinc-700 rounded p-2 max-w-1/3">
                  <Image
                    width={60}
                    height={60}
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-auto rounded"
                  />
                </div>
              )}
            </div>

            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="mt-5 w-full bg-black dark:bg-white text-white dark:text-black py-2 px-4 rounded font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPublishing ? uploadStatus : "Publish to Walrus"}
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Connect your wallet to setup your watermark studio
          </p>
          <div className="text-sm text-zinc-500 dark:text-zinc-500">
            Use the connect button in the top navigation
          </div>
        </div>
      )}
    </div>
  );
}
