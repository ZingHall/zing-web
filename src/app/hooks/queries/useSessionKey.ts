import {
  ZING_STUDIO_V0_PACKAGE_ADDRESS,
  ZING_STUDIO_CONFIG_SHARED_OBJECT_REF,
  ZING_STUDIO_PACKAGE_ADDRESS,
  deriveStudioID,
} from "@/lib/utils";
import { SessionKey } from "@mysten/seal";
import { Transaction } from "@mysten/sui/transactions";
import { fromHex } from "@mysten/sui/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import type { SuiClient } from "@mysten/sui/client";
import {
  useCurrentAccount,
  useSignPersonalMessage,
  useSuiClient,
} from "@mysten/dapp-kit";
import { sealApproveStudioOwner } from "@/_generated/zing_studio/studio";

export function useSessionKey(creator: string | null, enabled: boolean) {
  const suiClient = useSuiClient();
  const { sessionKey, createSessionKey, createSealApproveTransactionBytes } =
    useSessionKeyUtils();

  // Memoize the transaction bytes creation to avoid recreating on every render
  const txBytesQuery = useQuery({
    queryKey: ["sealApproveTransactionBytes", creator],
    queryFn: () =>
      createSealApproveTransactionBytes({
        suiClient,
        studioId: deriveStudioID(creator!),
      }),
    enabled: enabled && Boolean(creator),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create session key only when needed and not already available
  const sessionKeyQuery = useQuery({
    queryKey: ["ensureSessionKey", creator],
    queryFn: async () => {
      if (sessionKey) return sessionKey;
      const key = await createSessionKey({ suiClient });
      if (!key) throw new Error("Failed to create session key");
      return key;
    },
    enabled: enabled && Boolean(creator),
    staleTime: 4 * 60 * 1000, // a bit shorter than real TTL
    refetchInterval: 5 * 60 * 1000, // force refresh after expiry
  });

  const finalSessionKey = sessionKey || sessionKeyQuery.data;

  return {
    sessionKey: finalSessionKey,
    txBytes: txBytesQuery.data,
    isLoading: txBytesQuery.isLoading || sessionKeyQuery.isLoading,
    error: txBytesQuery.error || sessionKeyQuery.error,
  };
}

export function useSessionKeyUtils() {
  const queryClient = useQueryClient();
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signPersonalMessage } = useSignPersonalMessage();

  const { data: sessionKey } = useQuery({
    queryKey: ["sessionKey"],
    queryFn: () => null, // Initialize with null
    staleTime: 9 * 60 * 1000, // 9 minutes (before 10 min TTL expires)
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  // Memoize the mutation functions to prevent unnecessary re-renders
  const createSessionKey = useMutation({
    mutationKey: ["createSessionKey"],
    mutationFn: async ({ suiClient }: { suiClient: SuiClient }) => {
      if (!currentAccount) return;

      const suiAddress = currentAccount.address;
      const sessionKey = await SessionKey.create({
        address: suiAddress,
        packageId: ZING_STUDIO_V0_PACKAGE_ADDRESS,
        ttlMin: 10,
        suiClient,
      });

      const message = sessionKey.getPersonalMessage();
      const { signature } = await signPersonalMessage({ message });

      sessionKey.setPersonalMessageSignature(signature);
      return sessionKey;
    },
    onSuccess: (key) => {
      queryClient.setQueryData(["sessionKey"], key);
    },
  });

  const createSealApproveTransactionBytes = useMutation({
    mutationKey: ["createSealApproveTransactionBytes"],
    mutationFn: async ({
      suiClient,
      studioId,
    }: {
      suiClient: SuiClient;
      studioId: string;
    }) => {
      const tx = new Transaction();
      tx.add(
        sealApproveStudioOwner({
          package: ZING_STUDIO_PACKAGE_ADDRESS,
          arguments: {
            id: tx.pure.vector("u8", fromHex(studioId)),
            self: tx.object(studioId),
            config: tx.sharedObjectRef(ZING_STUDIO_CONFIG_SHARED_OBJECT_REF),
          },
        }),
      );
      const txBytes = await tx.build({
        client: suiClient,
        onlyTransactionKind: true,
      });
      return txBytes;
    },
  });

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      sessionKey,
      createSessionKey: createSessionKey.mutateAsync,
      createSealApproveTransactionBytes:
        createSealApproveTransactionBytes.mutateAsync,
      isCreating: createSessionKey.isPending,
    }),
    [
      sessionKey,
      createSessionKey.mutateAsync,
      createSealApproveTransactionBytes.mutateAsync,
      createSessionKey.isPending,
    ],
  );
}
