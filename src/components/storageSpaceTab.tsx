import { coinWithBalance, Transaction } from "@mysten/sui/transactions";
import {
  useCurrentAccount,
  useCurrentClient,
  useDAppKit,
} from "@mysten/dapp-kit-react";
import { formatStorageSize, WAL_TESTNET_TYPE } from "@/lib/utils";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import {
  useZingClient,
  useZingQuery,
  Storage,
  COIN_DECIMALS,
} from "@zing-protocol/zing-sdk";
import { WalrusClient } from "@mysten/walrus";
import { SuiGrpcClient } from "@mysten/sui/grpc";
import { ClientWithExtensions } from "@mysten/sui/client";

export default function StorageStatusPage() {
  const client = useCurrentClient() as ClientWithExtensions<
    { walrus: WalrusClient },
    SuiGrpcClient
  >;
  const currentAccount = useCurrentAccount();
  const dappKit = useDAppKit();

  const { data: storageTreasury, refetch: refetchStorageTreasury } =
    useZingQuery({
      method: "getStorageTreasury",
      params: [],
    });
  const zingClient = useZingClient();

  const { data: walrusSystem, refetch: refetchWalrusSystem } = useQuery({
    queryKey: ["walrusSystem"],
    queryFn: async () => {
      const systemState = await client.walrus.systemState();
      return systemState;
    },
    enabled: !!client,
  });
  const currentEopch = walrusSystem?.committee.epoch;

  const usedStorageByEpoch = new Map<number, number>(
    storageTreasury?.total_used_storage_size_by_epoch.contents.map((e) => [
      Number(e.key),
      Number(e.value),
    ]) ?? [],
  );

  const storageByEpoch = new Map<
    number,
    (typeof Storage.StorageTreasury.$inferType.storages_by_epoch.contents)[number]["value"]
  >(
    storageTreasury?.storages_by_epoch.contents.map((s) => [
      Number(s.key),
      s.value,
    ]) ?? [],
  );

  const allEpochs = Array.from(
    new Set([...usedStorageByEpoch.keys(), ...storageByEpoch.keys()]),
  ).sort((a, b) => b - a);

  const storages = storageTreasury?.storages_by_epoch.contents ?? [];

  const activeStorages = storages.filter(
    (s) => s.value.end_epoch > (currentEopch ?? 0),
  );

  const expiredStorages = storages.filter(
    (s) => s.value.end_epoch <= (currentEopch ?? 0),
  );

  const totalActiveStorage = activeStorages.reduce(
    (sum, s) => sum + Number(s.value.storage_size),
    0,
  );

  const totalUsedStorage =
    storageTreasury?.total_used_storage_size_by_epoch.contents
      .filter((e) => e.key >= (currentEopch ?? 0))
      .reduce((sum, e) => sum + Number(e.value), 0) ?? 0;
  // ------------------------------
  // TX BUILDERS
  // ------------------------------

  const fundStorage = (balance: number) => {
    const tx = new Transaction();
    const wal = tx.add(
      coinWithBalance({
        balance,
        useGasCoin: false,
        type: WAL_TESTNET_TYPE,
      }),
    );

    tx.add(
      Storage.fundWalTreasury({
        package: zingClient.config.zing.ZING_STUDIO_PACKAGE_ADDRESS,
        arguments: {
          self: tx.sharedObjectRef(
            zingClient.config.zing.ZING_STORAGE_TREASURY_SHARED_OBJECT_REF,
          ),
          config: tx.sharedObjectRef(
            zingClient.config.zing.ZING_STUDIO_CONFIG_SHARED_OBJECT_REF,
          ),
          coin: wal,
        },
      }),
    );

    return tx;
  };

  const reserveSpace = (
    address: string,
    storageAmount: number,
    startEpoch: number,
    endEpoch: number,
  ) => {
    const tx = new Transaction();

    if (endEpoch <= startEpoch) throw new Error("invalid epochs");

    const wal = tx.add(
      coinWithBalance({
        balance: 10 ** 9,
        useGasCoin: false,
        type: WAL_TESTNET_TYPE,
      }),
    );

    const storage = tx.moveCall({
      target: `${zingClient.config.walrus.WALRUS_PACKAGE}::system::reserve_space_for_epochs`,
      arguments: [
        tx.sharedObjectRef(
          zingClient.config.walrus.WALRUS_SYSTEM_SHARED_OBJECT_REF,
        ),
        tx.pure.u64(storageAmount),
        tx.pure.u32(startEpoch),
        tx.pure.u32(endEpoch),
        wal,
      ],
    });

    tx.add(
      Storage.addStorageToTreasury({
        package: zingClient.config.zing.ZING_STUDIO_PACKAGE_ADDRESS,
        arguments: {
          self: tx.sharedObjectRef(
            zingClient.config.zing.ZING_STORAGE_TREASURY_SHARED_OBJECT_REF,
          ),
          config: tx.sharedObjectRef(
            zingClient.config.zing.ZING_STUDIO_CONFIG_SHARED_OBJECT_REF,
          ),
          walrusSystem: tx.sharedObjectRef(
            zingClient.config.walrus.WALRUS_SYSTEM_SHARED_OBJECT_REF,
          ),
          storage,
        },
      }),
    );
    tx.transferObjects([wal], address);

    return tx;
  };

  // ------------------------------
  // EXECUTION HANDLERS
  // ------------------------------

  const handleFund = async () => {
    try {
      const amount = Number(0.5 * 10 ** 9);
      if (!amount) return alert("Invalid amount");

      const tx = fundStorage(amount);

      const result = await dappKit.signAndExecuteTransaction({
        transaction: tx,
      });

      if (!result.Transaction?.digest)
        throw new Error("Failed to get handleFund Transaction digest");

      await client.core.waitForTransaction({
        digest: result.Transaction.digest,
      });
      await refetchStorageTreasury();

      toast.success("Fund storage treasury success!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleReserve = async () => {
    try {
      if (!currentEopch || !currentAccount) return;
      const amount = 66034000;
      const start = Number(currentEopch);
      const end = Number(currentEopch + 2);

      const tx = reserveSpace(currentAccount.address, amount, start, end);

      const result = await dappKit.signAndExecuteTransaction({
        transaction: tx,
      });

      if (!result.Transaction?.digest)
        throw new Error("Failed to get handleFund Transaction digest");

      await client.core.waitForTransaction({
        digest: result.Transaction.digest,
      });
      await refetchStorageTreasury();

      toast.success("Reserved storage successfully!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // ------------------------------
  // RENDER UI
  // ------------------------------

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-semibold">Storage Space Status</h1>

      <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">Storage Overview</h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-zinc-500">Active Storage</p>
            <p className="font-semibold">
              {formatStorageSize(totalActiveStorage)}
            </p>
          </div>

          <div>
            <p className="text-zinc-500">Used Storage</p>
            <p className="font-semibold">
              {formatStorageSize(totalUsedStorage)}
            </p>
          </div>

          <div>
            <p className="text-zinc-500">Expired Windows</p>
            <p className="font-semibold text-red-600">
              {expiredStorages.length}
            </p>
          </div>

          <div>
            <p className="text-zinc-500">Active Windows</p>
            <p className="font-semibold">{activeStorages.length}</p>
          </div>
        </div>
      </div>

      {/* STORAGE BY EPOCH + BUTTON */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Storages by Epoch</h2>
          <div className="space-x-4">
            {/* Action button */}
            {currentEopch && (
              <button
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleReserve}
              >
                Topup Storage at Epoch {currentEopch} to {currentEopch + 2}
              </button>
            )}
            <button
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              onClick={async () => {
                await refetchWalrusSystem();
                await refetchStorageTreasury();
              }}
            >
              Refresh
            </button>
          </div>
        </div>

        <h3 className="mb-4">Current Epoch: {currentEopch}</h3>

        <div className="space-y-4">
          {allEpochs.map((epochKey) => {
            const storage = storageByEpoch.get(epochKey);
            const usedStorage = usedStorageByEpoch.get(epochKey) ?? 0;

            const expired = storage
              ? storage.end_epoch <= (currentEopch ?? 0)
              : epochKey < (currentEopch ?? 0); // fallback heuristic

            return (
              <div
                key={epochKey}
                className={`p-4 border rounded-lg ${
                  expired
                    ? "border-red-300 bg-red-50 dark:bg-red-900/20"
                    : "border-zinc-200 dark:border-zinc-700"
                }`}
              >
                <div className="flex justify-between">
                  <p>Epoch: {epochKey}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      expired
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {expired ? "EXPIRED" : "ACTIVE"}
                  </span>
                </div>

                {storage ? (
                  <>
                    <p>
                      Available Storage Size:{" "}
                      {formatStorageSize(storage.storage_size)}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {storage.start_epoch} - {storage.end_epoch}
                    </p>
                  </>
                ) : (
                  <p className="italic text-zinc-400">
                    No active storage window
                  </p>
                )}

                <p>Used Storage Size: {formatStorageSize(usedStorage)}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* WAL TREASURY + BUTTON */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">WAL Treasury</h2>

          <button
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
            onClick={handleFund}
          >
            Fund 0.5 WAL
          </button>
        </div>

        <div className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg">
          <p>ID: {storageTreasury?.wal_treasury.id.id}</p>
          <p>
            Balance:{" "}
            {Number(storageTreasury?.wal_treasury.balance.value) / 10 ** 9}
          </p>
        </div>
      </div>
      {/* Tier plans */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">Storage Tier Plans</h2>

        <div className="space-y-3">
          {storageTreasury?.tier_plan.contents.map((tier) => (
            <div
              key={tier.key}
              className="p-4 border rounded-lg border-zinc-200 dark:border-zinc-700"
            >
              <p className="font-medium">Tier {tier.key}</p>
              <p>
                Price: {Number(tier.value.price) / 10 ** COIN_DECIMALS.USDC}{" "}
                USDC
              </p>
              <p>Duration: {tier.value.duration_days} days</p>
              <p>Limit: {formatStorageSize(tier.value.storage_limit)}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Wal treasury */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">WAL Usage Budget</h2>

        <div className="space-y-3">
          {storageTreasury?.wal_treasury_usage_budget.contents.map((b) => (
            <div
              key={b.key}
              className="p-4 border rounded-lg border-zinc-200 dark:border-zinc-700"
            >
              <p>Tier {b.key}:</p>
              <p>Time window: {Number(b.value.duration)} s</p>
              <p>Max Budget: {Number(b.value.max_budget) / 10 ** 9} WAL</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
