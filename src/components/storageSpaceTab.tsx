import { coinWithBalance, Transaction } from "@mysten/sui/transactions";
import {
  useSuiClient,
  useSignAndExecuteTransaction,
  useCurrentAccount,
} from "@mysten/dapp-kit";
import { formatStorageSize, WAL_TESTNET_TYPE } from "@/lib/utils";
import { useAppContext } from "@/app/context/appContext";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useZingClient, useZingQuery, Storage } from "@zing-protocol/zing-sdk";

export default function StorageStatusPage() {
  const { suiJsonRpcClient } = useAppContext();
  const client = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { data: storageTreasury, refetch: refetchStorageTreasury } =
    useZingQuery({
      method: "getStorageTreasury",
      params: [],
    });
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const zingClient = useZingClient();

  const { data: walrusSystem, refetch: refetchWalrusSystem } = useQuery({
    queryKey: ["walrusSystem"],
    queryFn: async () => suiJsonRpcClient.walrus.systemState(),
    enabled: !!suiJsonRpcClient,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
  const currentEopch = walrusSystem?.committee.epoch;
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

      const { digest } = await signAndExecute({
        transaction: tx,
        chain: "sui:testnet",
      });

      await client.waitForTransaction({ digest });
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

      const { digest } = await signAndExecute({
        transaction: tx,
        chain: "sui:testnet",
      });

      await client.waitForTransaction({ digest });
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

      {/* STORAGE BY EPOCH + BUTTON */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow">
        <div className="flex justify-between items-center mb-4">
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

        <div className="space-y-4">
          {storageTreasury?.storages_by_epoch.contents
            .filter((epoch) => epoch.value.start_epoch >= (currentEopch || 0))
            .sort((a, b) => a.value.start_epoch - b.value.start_epoch)
            .map((epoch) => (
              <div
                key={epoch.key}
                className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg"
              >
                <p>Epoch: {epoch.key}</p>
                <p>
                  Storage Size: {formatStorageSize(epoch.value.storage_size)}
                </p>
              </div>
            ))}
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
    </div>
  );
}
