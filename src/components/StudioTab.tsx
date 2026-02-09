import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  useZingQuery,
  useZingInfiniteQuery,
  useZingClient,
  StudioApp,
} from "@zing-protocol/zing-sdk";
import { useAppContext } from "@/app/context/appContext";
import { formatStorageSize } from "@/lib/utils";
import { toast } from "sonner";
import { Transaction } from "@mysten/sui/transactions";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";

function getArticleExpirationStatus(article: any, currentEpoch?: number) {
  if (!currentEpoch) return "unknown";

  const blobs = article?.blobs ?? [];
  if (blobs.length === 0) return "expired";

  const minEndEpoch = Math.min(
    ...blobs.map((b: any) => Number(b.storage?.end_epoch ?? 0)),
  );

  if (minEndEpoch <= currentEpoch) return "expired";
  if (minEndEpoch < currentEpoch + 2) return "requires_renew";
  return "active";
}

function getStudioStatus(studio: any) {
  const now = Date.now();
  const end = Number(studio.period?.[1] ?? 0);
  return end <= now ? "expired" : "active";
}

export default function StudioTab() {
  const zingClient = useZingClient();
  const { suiJsonRpcClient } = useAppContext();
  const client = useSuiClient();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const [address, setAddress] = useState("");
  const [submittedAddress, setSubmittedAddress] = useState<string | null>(null);

  /** -------- Walrus epoch -------- */
  const { data: walrusSystem } = useQuery({
    queryKey: ["walrusSystem"],
    queryFn: async () => await suiJsonRpcClient.walrus.systemState(),
    enabled: !!suiJsonRpcClient,
    refetchInterval: 5 * 60 * 1000,
    refetchIntervalInBackground: true,
  });

  const currentEpoch = walrusSystem?.committee?.epoch;

  /** -------- Zing queries -------- */
  const { data: studio, isLoading: studioLoading } = useZingQuery(
    {
      method: "getStudio",
      params: [submittedAddress || ""],
    },
    {
      enabled: !!submittedAddress,
    },
    [submittedAddress || ""],
  );

  const {
    data: articles,
    isLoading: articlesLoading,
    refetch: refetchStudioWorks,
  } = useZingInfiniteQuery(
    {
      method: "getWorks",
      params: [submittedAddress || "", "article"],
    },
    {
      enabled: !!submittedAddress,
    },
    [submittedAddress || ""],
  );

  /** -------- Handlers -------- */
  function onSearch() {
    if (!address.startsWith("0x") || address.length < 10) {
      toast.error("Invalid Sui address");
      return;
    }
    setSubmittedAddress(address);
  }

  console.log({ submittedAddress });

  const allArticles = articles?.pages.flatMap((p: any) => p.data) ?? [];
  const studioStatus = studio ? getStudioStatus(studio) : "unknown";

  const expiredArticleIds: string[] = [];
  const renewArticleIds: string[] = [];

  if (studio && currentEpoch !== undefined) {
    for (const article of allArticles) {
      const articleStatus = getArticleExpirationStatus(article, currentEpoch);

      if (studioStatus === "expired") {
        // Rule 1: studio expired ? burn everything
        expiredArticleIds.push(article.id.id);
        continue;
      }

      if (articleStatus === "expired") {
        // Rule 2
        expiredArticleIds.push(article.id.id);
        continue;
      }

      if (articleStatus === "requires_renew") {
        // Rule 3
        renewArticleIds.push(article.id.id);
      }
    }
  }

  const renewStudioArticles = async (owner: string, articleIds: string[]) => {
    if (articleIds.length === 0) return;
    const tx = new Transaction();

    for (const articleId of articleIds) {
      tx.add(
        StudioApp.renewArticleWithStorageTreasury({
          package: zingClient.config.zing.ZING_STUDIO_PACKAGE_ADDRESS,
          arguments: {
            config: tx.sharedObjectRef(
              zingClient.config.zing.ZING_STUDIO_CONFIG_SHARED_OBJECT_REF,
            ),
            studio: tx.object(zingClient.getDerivedStudioID(owner)),
            walrusSystem: tx.sharedObjectRef(
              zingClient.config.walrus.WALRUS_SYSTEM_SHARED_OBJECT_REF,
            ),
            storageTreasury: tx.sharedObjectRef(
              zingClient.config.zing.ZING_STORAGE_TREASURY_SHARED_OBJECT_REF,
            ),
            storageSpace: tx.object(zingClient.getDerivedStorageID(owner)),
            articleId,
          },
        }),
      );
    }
    const { digest } = await signAndExecute({
      transaction: tx,
    });

    await client.waitForTransaction({ digest });
    await refetchStudioWorks();
  };

  const burnStudioArticles = async (owner: string, articleIds: string[]) => {
    if (articleIds.length === 0) return;
    const tx = new Transaction();

    for (const articleId of articleIds) {
      tx.add(
        StudioApp.burnArticle({
          package: zingClient.config.zing.ZING_STUDIO_PACKAGE_ADDRESS,
          arguments: {
            config: tx.sharedObjectRef(
              zingClient.config.zing.ZING_STUDIO_CONFIG_SHARED_OBJECT_REF,
            ),
            studio: tx.object(zingClient.getDerivedStudioID(owner)),
            walrusSystem: tx.sharedObjectRef(
              zingClient.config.walrus.WALRUS_SYSTEM_SHARED_OBJECT_REF,
            ),
            storageTreasury: tx.sharedObjectRef(
              zingClient.config.zing.ZING_STORAGE_TREASURY_SHARED_OBJECT_REF,
            ),
            articleId,
          },
        }),
      );
    }
    const { digest } = await signAndExecute({
      transaction: tx,
    });

    await client.waitForTransaction({ digest });
    await refetchStudioWorks();
  };

  return (
    <div className="space-y-6 p-6">
      {/* Search */}
      <div className="flex gap-2">
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch();
            }
          }}
          placeholder="Enter wallet address"
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={onSearch}
          className="px-4 py-2 rounded bg-black text-white"
        >
          Search
        </button>
      </div>

      {/* Studio */}
      {studioLoading && <div>Loading studio...</div>}

      {studio && (
        <div className="border rounded p-4 space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Studio</h2>
            <span
              className={`text-sm px-2 py-1 rounded ${
                status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {getStudioStatus(studio).toUpperCase()}
            </span>
          </div>

          <div>Owner: {studio.owner}</div>

          <div>
            Period: {new Date(Number(studio.period[0])).toLocaleString()} ?{" "}
            {new Date(Number(studio.period[1])).toLocaleString()}
          </div>

          <div>Members: {studio.membership.size}</div>
          <div>Works: {studio.works.size}</div>
        </div>
      )}

      {studio && (
        <div className="text-sm text-gray-600">
          {studioStatus === "expired" && (
            <div>?? Studio expired - all articles must be burned.</div>
          )}

          {studioStatus === "active" && renewArticleIds.length > 0 && (
            <div>? {renewArticleIds.length} article(s) nearing expiration.</div>
          )}
        </div>
      )}

      {studio && submittedAddress && (
        <div className="flex gap-3">
          {/* Burn */}
          <button
            disabled={expiredArticleIds.length === 0}
            onClick={async () => {
              await burnStudioArticles(submittedAddress, expiredArticleIds);
            }}
            className={`px-4 py-2 rounded text-white ${
              expiredArticleIds.length > 0
                ? "bg-red-600 hover:bg-red-700"
                : "bg-red-300 cursor-not-allowed"
            }`}
          >
            Burn {expiredArticleIds.length} Article
            {expiredArticleIds.length !== 1 ? "s" : ""}
          </button>

          {/* Renew */}
          <button
            disabled={studioStatus !== "active" || renewArticleIds.length === 0}
            onClick={async () => {
              await renewStudioArticles(submittedAddress, renewArticleIds);
            }}
            className={`px-4 py-2 rounded text-white ${
              studioStatus === "active" && renewArticleIds.length > 0
                ? "bg-yellow-600 hover:bg-yellow-700"
                : "bg-yellow-300 cursor-not-allowed"
            }`}
          >
            Renew {renewArticleIds.length} Article
            {renewArticleIds.length !== 1 ? "s" : ""}
          </button>
        </div>
      )}

      {/* Articles */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Articles</h2>

        {articlesLoading && <div>Loading articles...</div>}

        {allArticles.length === 0 && submittedAddress && (
          <div>No articles found</div>
        )}

        {allArticles.map((article: any) => {
          const status = getArticleExpirationStatus(article, currentEpoch);

          return (
            <div key={article.id.id} className="border rounded p-4 space-y-2">
              <div className="flex justify-between">
                <div className="font-mono text-sm">{article.id.id}</div>
                <span
                  className={`text-sm px-2 py-1 rounded ${
                    status === "active"
                      ? "bg-green-100 text-green-700"
                      : status === "requires_renew"
                        ? "bg-yellow-100 text-yellow-800"
                        : status === "expired"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {status.replace("_", " ").toUpperCase()}
                </span>
              </div>

              <div>
                Created: {new Date(Number(article.created_at)).toLocaleString()}
              </div>

              {article.blobs.map((blob: any, idx: number) => (
                <div key={idx} className="text-sm text-gray-600">
                  Blob {idx} - End Epoch: {blob.storage.end_epoch} - Size:{" "}
                  {formatStorageSize(
                    Number(blob.storage.storage_size).toString(),
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
