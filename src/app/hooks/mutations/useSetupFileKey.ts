import { setupFileKey } from "@/_generated/zing_studio/app";
import { useAppContext } from "@/app/context/appContext";
import {
  deriveStudioID,
  ZING_STUDIO_CONFIG_SHARED_OBJECT_REF,
  ZING_STUDIO_PACKAGE_ADDRESS,
  ZING_STUDIO_V0_PACKAGE_ADDRESS,
} from "@/lib/utils";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { bcs } from "@mysten/sui/bcs";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getStudioQueryKey } from "../queries/useGetStudio";

export async function createFileKey(): Promise<Uint8Array> {
  // Generate AES-GCM key
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true, // extractable (so we can export)
    ["encrypt", "decrypt"],
  );

  // Export as raw bytes
  const rawKey = await crypto.subtle.exportKey("raw", key);
  return new Uint8Array(rawKey); // 32 bytes (256 bits)
}

export function useSetupFileKey() {
  const { sealClient } = useAppContext();
  const queryClient = useQueryClient();
  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction();

  return useMutation({
    mutationFn: async ({ suiAddress }: { suiAddress: string }) => {
      const tx = new Transaction();

      // create random AES-GCM 256 key
      const fileKey = await createFileKey();

      const studioObjectId = deriveStudioID(suiAddress);
      // Seal encrypt Filekey
      const { encryptedObject: encryptedFileKeyBytes } =
        await sealClient.encrypt({
          threshold: 2,
          packageId: ZING_STUDIO_V0_PACKAGE_ADDRESS,
          id: studioObjectId,
          data: fileKey,
        });

      tx.add(
        setupFileKey({
          package: ZING_STUDIO_PACKAGE_ADDRESS,
          arguments: {
            config: tx.sharedObjectRef(ZING_STUDIO_CONFIG_SHARED_OBJECT_REF),
            studio: studioObjectId,
            encryptedFileKey: tx.pure(
              bcs.vector(bcs.U8).serialize(encryptedFileKeyBytes),
            ),
          },
        }),
      );

      const transactionResponse = await signAndExecuteTransaction({
        transaction: tx,
      });
      console.log({ transactionResponse });

      return transactionResponse;
    },
    onSuccess: async (params, variables) => {
      await queryClient.refetchQueries({
        queryKey: getStudioQueryKey(variables.suiAddress),
      });
    },
  });
}
