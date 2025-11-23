"use client";

import { useEffect, useState } from "react";
import { coinWithBalance, Transaction } from "@mysten/sui/transactions";
import {
  useSuiClient,
  useSignAndExecuteTransaction,
  useCurrentAccount,
} from "@mysten/dapp-kit";
import { useGetStorageTreasury } from "@/app/hooks/queries/useGetStorageTreasury";
import {
  WAL_PACKAGE_ADDRESS,
  WAL_TESTNET_TYPE,
  WALRUS_SYSTEM_SHARED_OBJECT_REF,
  ZING_STORAGE_TREASURY_SHARED_OBJECT_REF,
  ZING_STUDIO_CONFIG_SHARED_OBJECT_REF,
  ZING_STUDIO_PACKAGE_ADDRESS,
} from "@/lib/utils";
import { useAppContext } from "@/app/context/appContext";

export default function StorageStatusPage() {
  const { suiJsonRpcClient } = useAppContext();
  const client = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { data: storageTreasury } = useGetStorageTreasury(client);
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const [currentEopch, setCurrentEpoch] = useState<number>();

  useEffect(() => {
    const foo = async () => {
      const system = await suiJsonRpcClient.walrus.systemState();
      setCurrentEpoch(system.committee.epoch);
    };

    foo();
  }, [suiJsonRpcClient.walrus]);

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

    tx.moveCall({
      target: `${ZING_STUDIO_PACKAGE_ADDRESS}::storage::fund_wal_treasury`,
      arguments: [
        tx.sharedObjectRef(ZING_STORAGE_TREASURY_SHARED_OBJECT_REF),
        tx.sharedObjectRef(ZING_STUDIO_CONFIG_SHARED_OBJECT_REF),
        wal,
      ],
    });

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
      target: `${WAL_PACKAGE_ADDRESS}::system::reserve_space_for_epochs`,
      arguments: [
        tx.sharedObjectRef(WALRUS_SYSTEM_SHARED_OBJECT_REF),
        tx.pure.u64(storageAmount),
        tx.pure.u32(startEpoch),
        tx.pure.u32(endEpoch),
        wal,
      ],
    });

    tx.moveCall({
      target: `${ZING_STUDIO_PACKAGE_ADDRESS}::storage::add_storage_to_treasury`,
      arguments: [
        tx.sharedObjectRef(ZING_STORAGE_TREASURY_SHARED_OBJECT_REF),
        tx.sharedObjectRef(ZING_STUDIO_CONFIG_SHARED_OBJECT_REF),
        tx.sharedObjectRef(WALRUS_SYSTEM_SHARED_OBJECT_REF),
        storage,
      ],
    });

    tx.transferObjects([wal], address);

    return tx;
  };

  // ------------------------------
  // EXECUTION HANDLERS
  // ------------------------------

  const handleFund = async () => {
    const amount = Number(0.5 * 10 ** 9);
    if (!amount) return alert("Invalid amount");

    const tx = fundStorage(amount);

    await signAndExecute({
      transaction: tx,
      chain: "sui:testnet",
    });

    alert("Fund storage treasury success!");
  };

  const handleReserve = async () => {
    if (!currentEopch || !currentAccount) return;
    const amount = 10 ** 8;
    const start = Number(currentEopch);
    const end = Number(currentEopch + 2);

    const tx = reserveSpace(currentAccount.address, amount, start, end);

    await signAndExecute({
      transaction: tx,
      chain: "sui:testnet",
    });

    alert("Reserved storage successfully!");
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

          {/* Action button */}
          {currentEopch && (
            <button
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleReserve}
            >
              Topup Storage at Epoch {currentEopch} to {currentEopch + 2}
            </button>
          )}
        </div>

        <div className="space-y-4">
          {storageTreasury?.storages_by_epoch.contents.map((epoch) => (
            <div
              key={epoch.key}
              className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg"
            >
              <p>Epoch: {epoch.key}</p>
              <p>Storage Size: {epoch.value.storage_size}</p>
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
          <p>Balance: {storageTreasury?.wal_treasury.balance.value}</p>
        </div>
      </div>
    </div>
  );
}
