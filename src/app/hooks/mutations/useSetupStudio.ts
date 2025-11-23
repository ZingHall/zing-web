import { shareStorageSpace } from "@/_generated/zing_studio/storage";
import { _new, shareStudio } from "@/_generated/zing_studio/studio";
import {
  ZING_STUDIO_CONFIG_SHARED_OBJECT_REF,
  ZING_STUDIO_PACKAGE_ADDRESS,
} from "@/lib/utils";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getStudioQueryKey } from "../queries/useGetStudio";
import { getStorageSpaceKey } from "../queries/useGetStorageSpace";

export function useSetupStudio() {
  const suiClient = useSuiClient();
  const queryClient = useQueryClient();
  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction();

  return useMutation({
    mutationFn: async ({ suiAddress }: { suiAddress: string }) => {
      const tx = new Transaction();

      const [studio, storageSpace] = tx.add(
        _new({
          package: ZING_STUDIO_PACKAGE_ADDRESS,
          arguments: [tx.sharedObjectRef(ZING_STUDIO_CONFIG_SHARED_OBJECT_REF)],
        }),
      );
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

      const transactionResponse = await signAndExecuteTransaction({
        transaction: tx,
      });

      return {
        transactionResponse,
        suiAddress,
      };
    },
    onSuccess: async (res, variables) => {
      await suiClient.waitForTransaction({
        digest: res.transactionResponse.digest,
      });
      await Promise.all([
        queryClient.refetchQueries({
          queryKey: getStudioQueryKey(variables.suiAddress),
        }),
        queryClient.refetchQueries({
          queryKey: getStorageSpaceKey(variables.suiAddress),
        }),
      ]);
    },
  });
}
