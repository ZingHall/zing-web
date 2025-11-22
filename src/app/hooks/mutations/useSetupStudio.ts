import { shareStorageSpace } from "@/_generated/zing_studio/storage";
import { _new, shareStudio } from "@/_generated/zing_studio/studio";
import {
  ZING_STUDIO_CONFIG_SHARED_OBJECT_REF,
  ZING_STUDIO_PACKAGE_ADDRESS,
} from "@/lib/utils";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation } from "@tanstack/react-query";

export function useSetupStudio() {
  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction();

  return useMutation({
    mutationFn: async () => {
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
      console.log({ transactionResponse });

      return transactionResponse;
    },
  });
}
