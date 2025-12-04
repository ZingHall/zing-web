import { purchaseStorageTier } from "@/_generated/zing_studio/app";
import { shareStorageSpace } from "@/_generated/zing_studio/storage";
import { _new, shareStudio } from "@/_generated/zing_studio/studio";
import {
  deriveStorageID,
  deriveStudioID,
  WALRUS_SYSTEM_SHARED_OBJECT_REF,
  ZING_FRAMEWORK_PACKAGE_ADDRESS,
  ZING_STORAGE_TREASURY_SHARED_OBJECT_REF,
  ZING_STUDIO_CONFIG_SHARED_OBJECT_REF,
  ZING_STUDIO_PACKAGE_ADDRESS,
  ZING_TREASURY_SHARED_OBJECT_REF,
} from "@/lib/utils";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { coinWithBalance, Transaction } from "@mysten/sui/transactions";
import { SUI_TYPE_ARG } from "@mysten/sui/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getStudioQueryKey } from "../queries/useGetStudio";
import { getStorageSpaceKey } from "../queries/useGetStorageSpace";
import { toast } from "sonner";

interface PurchaseStorageTierParams {
  suiAddress: string;
  isSetup: boolean;
  newTierIdx: number;
  balance: number;
}

export function usePurchaseStorageTier() {
  const queryClient = useQueryClient();
  const suiClient = useSuiClient();
  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction();

  return useMutation({
    mutationFn: async ({
      suiAddress,
      isSetup,
      newTierIdx,
      balance,
    }: PurchaseStorageTierParams) => {
      const tx = new Transaction();

      let studio;
      let storageSpace;

      if (!isSetup) {
        const created = tx.add(
          _new({
            package: ZING_STUDIO_PACKAGE_ADDRESS,
            arguments: [
              tx.sharedObjectRef(ZING_STUDIO_CONFIG_SHARED_OBJECT_REF),
            ],
          }),
        );

        // we can't setup FileKey during the first time we setup the studio as we can't retrieve ObjectId then

        studio = created[0];
        storageSpace = created[1];
      } else {
        studio = tx.object(deriveStudioID(suiAddress));
        storageSpace = tx.object(deriveStorageID(suiAddress));
      }

      const suiCoin = tx.add(
        coinWithBalance({
          type: SUI_TYPE_ARG,
          balance,
          useGasCoin: true,
        }),
      );

      tx.add(
        purchaseStorageTier({
          package: ZING_STUDIO_PACKAGE_ADDRESS,
          typeArguments: [SUI_TYPE_ARG],
          arguments: [
            tx.sharedObjectRef(ZING_STUDIO_CONFIG_SHARED_OBJECT_REF),
            studio,
            tx.sharedObjectRef(ZING_TREASURY_SHARED_OBJECT_REF),
            tx.sharedObjectRef(WALRUS_SYSTEM_SHARED_OBJECT_REF),
            tx.sharedObjectRef(ZING_STORAGE_TREASURY_SHARED_OBJECT_REF),
            storageSpace,
            tx.pure.u8(newTierIdx),
            suiCoin,
          ],
        }),
      );

      if (!isSetup) {
        tx.add(
          shareStudio({
            package: ZING_STUDIO_PACKAGE_ADDRESS,
            arguments: [studio],
          }),
        );

        tx.add(
          shareStorageSpace({
            package: ZING_STUDIO_PACKAGE_ADDRESS,
            arguments: [storageSpace],
          }),
        );
      }

      tx.moveCall({
        package: ZING_FRAMEWORK_PACKAGE_ADDRESS,
        module: "coin_utils",
        function: "burn_or_send_positive_coin",
        typeArguments: [SUI_TYPE_ARG],
        arguments: [suiCoin, tx.pure.address(suiAddress)],
      });

      const transactionResponse = await signAndExecuteTransaction({
        transaction: tx,
      });

      return transactionResponse;
    },
    onSuccess: async (res, variables) => {
      await suiClient.waitForTransaction({ digest: res.digest });

      await Promise.all([
        queryClient.refetchQueries({
          queryKey: getStudioQueryKey(variables.suiAddress),
        }),
        queryClient.refetchQueries({
          queryKey: getStorageSpaceKey(variables.suiAddress),
        }),
      ]);

      toast.success("Transaction success");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}
