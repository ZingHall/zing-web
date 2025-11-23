import { useQuery } from "@tanstack/react-query";
import type { SuiClient } from "@mysten/sui/client";
import { StorageSpace } from "@/_generated/zing_studio/storage";
import { deriveStorageID } from "@/lib/utils";

interface UseGetStorageSpaceResult {
  data: typeof StorageSpace.$inferType | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

const fetchStorageSpace = async (suiClient: SuiClient, owner: string) => {
  const storageSpaceId = deriveStorageID(owner);
  console.log({ storageSpaceId });

  const storageSpaceObjectResponse = await suiClient.getObject({
    id: storageSpaceId,
    options: { showBcs: true },
  });
  console.log({ storageSpaceObjectResponse });

  if (storageSpaceObjectResponse.error?.code === "notExists") {
    return null;
  }

  if (storageSpaceObjectResponse.data?.bcs?.dataType !== "moveObject") {
    throw new Error(`Failed to parse proof object for ${owner}`);
  }

  const storage_space = StorageSpace.fromBase64(
    storageSpaceObjectResponse.data.bcs.bcsBytes,
  );
  return storage_space;
};

export const getStorageSpaceKey = (owner?: string | null) => [
  "storageSpace",
  owner,
];
export function useGetStorageSpace(
  suiClient?: SuiClient,
  owner?: string,
): UseGetStorageSpaceResult {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: getStorageSpaceKey(owner),
    queryFn: () => fetchStorageSpace(suiClient!, owner!),
    enabled: Boolean(suiClient && owner),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    data: data ?? null,
    loading: isLoading,
    error: error as Error | null,
    refetch: () => {
      refetch();
    },
  };
}
