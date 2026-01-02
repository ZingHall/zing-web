import { useEffect, useState } from "react";
import { importFileKey } from "@/app/hooks/queries/useGetFileKey";
import { useGetStudio } from "@/app/hooks/queries/useGetStudio";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useSessionKeyUtils } from "@/app/hooks/queries/useSessionKey";
import { useAppContext } from "@/app/context/appContext";
import {
  encodedBlobLength,
  usePublishArticle,
  WalrusUploadFlowStage,
} from "@/app/hooks/mutations/usePublish";
import { WalrusFile } from "@mysten/walrus";
import { encryptData, FIXED_FILE_IV } from "@/lib/utils";
import { useGetStorageTreasury } from "@/app/hooks/queries/useGetStorageTreasury";

type PublishState = {
  stage: WalrusUploadFlowStage;
  flow?: any;
  owner?: string;
  metadata?: any[];
  digest?: string;
};

export default function PublishTab() {
  const [embedFile, setEmbedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [publishState, setPublishState] = useState<PublishState>({
    stage: "idle",
  });

  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const { sealClient, fileKey, setFileKey, suiJsonRpcClient } = useAppContext();
  const { data: studio } = useGetStudio(suiClient, currentAccount?.address);
  const sealSessoinKeyUtils = useSessionKeyUtils();
  const { data: storageTreasury } = useGetStorageTreasury(suiClient);
  console.log({ storageTreasury });

  const { encodeStep, registerStep, uploadStep, certifyStep } =
    usePublishArticle();

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

      const data = new Uint8Array(fileKey);
      const decryptedKey = await sealClient.decrypt({
        data,
        sessionKey,
        txBytes,
      });
      console.log({ decryptedKey });
      const cryptoKey = await importFileKey(decryptedKey);
      setFileKey(cryptoKey);
    } catch (error) {
      console.error({ error });
    } finally {
      setIsDecrypting(false);
    }
  };

  // Step 1: Encode
  const handleEncode = async () => {
    if (!embedFile || !fileKey) return;

    setPublishState({ stage: "encoding" });

    const pngMetadata = {
      identifier: "zing-watermark-test.png",
      tags: { "content-type": "image/png" },
      size: embedFile.size,
      isPublic: false,
    };

    const fileBytes = new Uint8Array(await embedFile.arrayBuffer());
    const contents = await encryptData(fileKey, fileBytes, FIXED_FILE_IV);

    const systemState = await suiJsonRpcClient.walrus.systemState();
    const encodedSize = encodedBlobLength(
      contents.length,
      systemState.committee.n_shards,
    );
    console.log({ encodedSize });
    const pngFile = WalrusFile.from({
      contents,
      identifier: "zing-watermark-test.png",
      tags: { "content-type": "image/png" },
    });

    try {
      const result = await encodeStep.mutateAsync({
        walrusFiles: [pngFile],
        metadata: [pngMetadata],
      });

      setPublishState({
        stage: "ready_to_register",
        flow: result.flow,
        owner: result.owner,
        metadata: result.metadata,
      });
    } catch (error) {
      console.error("Encode failed:", error);
      setPublishState({ stage: "idle" });
    }
  };

  // Step 2: Register (wallet popup)
  const handleRegister = async () => {
    if (!publishState.flow || !publishState.owner) return;

    setPublishState({ ...publishState, stage: "registering" });

    try {
      const result = await registerStep.mutateAsync({
        flow: publishState.flow,
        owner: publishState.owner,
      });

      setPublishState({
        ...publishState,
        stage: "uploading",
        digest: result.digest,
      });

      // Automatically proceed to upload
      handleUpload(result.flow, result.digest);
    } catch (error) {
      console.error("Register failed:", error);
      setPublishState({ ...publishState, stage: "ready_to_register" });
    }
  };

  // Step 3: Upload
  const handleUpload = async (flow: any, digest: string) => {
    try {
      const result = await uploadStep.mutateAsync({ flow, digest });

      setPublishState({
        ...publishState,
        stage: "ready_to_certify",
        flow: result.flow,
      });
    } catch (error) {
      console.error("Upload failed:", error);
      setPublishState({ stage: "idle" });
    }
  };

  // Step 4: Certify (wallet popup)
  const handleCertify = async () => {
    if (!publishState.flow) return;

    setPublishState({ ...publishState, stage: "certifying" });

    try {
      const result = await certifyStep.mutateAsync({
        flow: publishState.flow,
      });

      console.log("Published blobs:", result.blobs);
      setPublishState({ stage: "complete" });
    } catch (error) {
      console.error("Certify failed:", error);
      setPublishState({ ...publishState, stage: "ready_to_certify" });
    }
  };

  useEffect(() => {
    if (!embedFile) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(embedFile);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [embedFile]);

  const getStageButton = () => {
    switch (publishState.stage) {
      case "idle":
        return (
          <button
            onClick={handleEncode}
            disabled={!embedFile || !fileKey}
            className="mt-5 w-full bg-black dark:bg-white text-white dark:text-black py-2 px-4 rounded font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            1. Encode File
          </button>
        );

      case "encoding":
        return (
          <button
            disabled
            className="mt-5 w-full bg-black dark:bg-white text-white dark:text-black py-2 px-4 rounded font-medium opacity-50 cursor-not-allowed"
          >
            Encoding...
          </button>
        );

      case "ready_to_register":
        return (
          <button
            onClick={handleRegister}
            className="mt-5 w-full bg-green-600 text-white py-2 px-4 rounded font-medium hover:bg-green-700"
          >
            2. Register Blob (Sign Transaction)
          </button>
        );

      case "registering":
        return (
          <button
            disabled
            className="mt-5 w-full bg-green-600 text-white py-2 px-4 rounded font-medium opacity-50 cursor-not-allowed"
          >
            Registering...
          </button>
        );

      case "uploading":
        return (
          <button
            disabled
            className="mt-5 w-full bg-blue-600 text-white py-2 px-4 rounded font-medium opacity-50 cursor-not-allowed"
          >
            Uploading to Storage Nodes...
          </button>
        );

      case "ready_to_certify":
        return (
          <button
            onClick={handleCertify}
            className="mt-5 w-full bg-purple-600 text-white py-2 px-4 rounded font-medium hover:bg-purple-700"
          >
            3. Certify Blob (Sign Transaction)
          </button>
        );

      case "certifying":
        return (
          <button
            disabled
            className="mt-5 w-full bg-purple-600 text-white py-2 px-4 rounded font-medium opacity-50 cursor-not-allowed"
          >
            Certifying...
          </button>
        );

      case "complete":
        return (
          <div className="mt-5 space-y-3">
            <div className="w-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 py-2 px-4 rounded font-medium text-center">
              ✓ Published Successfully!
            </div>
            <button
              onClick={() => {
                setPublishState({ stage: "idle" });
                setEmbedFile(null);
              }}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-2 px-4 rounded font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200"
            >
              Publish Another
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-black dark:text-zinc-50">
        Publish Your Image
        <span className="ml-5 text-sm text-red-500">
          *Please ensure the Storage Treasury has enough space. We&apos;re on
          testnet, so storage capacity is not guaranteed.
        </span>
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
                  {fileKey ? "Decrypted" : "Encrypted"}
                </span>
              </div>
              {!fileKey && (
                <button
                  onClick={handleDecryptFileKey}
                  disabled={isDecrypting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDecrypting ? "Decrypting..." : "Decrypt FileKey"}
                </button>
              )}
            </div>
          </div>

          {/* Progress indicator */}
          <div className="mb-5 bg-zinc-50 dark:bg-zinc-800 p-4 rounded">
            <div className="flex items-center justify-between text-sm mb-2">
              <span
                className={
                  publishState.stage !== "idle"
                    ? "text-green-600 dark:text-green-400 font-medium"
                    : "text-zinc-500"
                }
              >
                1. Encode
              </span>
              <span
                className={
                  [
                    "ready_to_register",
                    "registering",
                    "uploading",
                    "ready_to_certify",
                    "certifying",
                    "complete",
                  ].includes(publishState.stage)
                    ? "text-green-600 dark:text-green-400 font-medium"
                    : "text-zinc-500"
                }
              >
                2. Register
              </span>
              <span
                className={
                  [
                    "uploading",
                    "ready_to_certify",
                    "certifying",
                    "complete",
                  ].includes(publishState.stage)
                    ? "text-green-600 dark:text-green-400 font-medium"
                    : "text-zinc-500"
                }
              >
                3. Upload
              </span>
              <span
                className={
                  ["ready_to_certify", "certifying", "complete"].includes(
                    publishState.stage,
                  )
                    ? "text-green-600 dark:text-green-400 font-medium"
                    : "text-zinc-500"
                }
              >
                4. Certify
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300 flex justify-between">
                <label>
                  Upload <span className="text-red-500">*PNG</span> Image
                </label>
                <div className="text-gray-600">
                  Uploading to Storage Nodes takes around{" "}
                  <span className="text-red-500/80">30 seconds</span> as we
                  didn&apos;t use any publisher to upload-relay
                </div>
              </div>

              <input
                id="file-upload"
                type="file"
                accept="image/png"
                onChange={(e) => {
                  setEmbedFile(e.target.files?.[0] || null);
                  setPublishState({ stage: "idle" });
                }}
                className="hidden"
                disabled={
                  publishState.stage !== "idle" &&
                  publishState.stage !== "complete"
                }
              />

              <label
                htmlFor="file-upload"
                className={`w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 text-center block ${publishState.stage !== "idle" && publishState.stage !== "complete" ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700"}`}
              >
                {embedFile ? embedFile.name : "Select PNG File"}
              </label>

              {previewUrl && (
                <div className="mt-2 border border-zinc-300 dark:border-zinc-700 rounded p-2 max-w-xs">
                  <img
                    width={300}
                    height={300}
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-auto rounded"
                  />
                </div>
              )}
            </div>

            {getStageButton()}
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
