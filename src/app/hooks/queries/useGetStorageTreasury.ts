import { StorageTreasury } from "@/_generated/zing_studio/storage";
import { useQuery } from "@tanstack/react-query";
import type { SuiClient } from "@mysten/sui/client";
import { ZING_STORAGE_TREASURY_SHARED_OBJECT_REF } from "@/lib/utils";

interface GetIdentifierResult {
  data: typeof StorageTreasury.$inferType | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

const fetchStorageTreasury = async (
  suiClient: SuiClient,
): Promise<typeof StorageTreasury.$inferType> => {
  const res = await suiClient.getObject({
    id: ZING_STORAGE_TREASURY_SHARED_OBJECT_REF.objectId,
    options: { showBcs: true },
  });

  console.log({ res });

  if (res.data?.bcs?.dataType !== "moveObject") {
    throw new Error("fail to get StorageTreasury");
  }

  return StorageTreasury.fromBase64(res.data.bcs.bcsBytes);
};

export function useGetStorageTreasury(
  suiClient?: SuiClient,
): GetIdentifierResult {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      "storageTreasury",
      ZING_STORAGE_TREASURY_SHARED_OBJECT_REF.objectId,
    ],
    queryFn: () => fetchStorageTreasury(suiClient!),
    enabled: !!suiClient,
    retry: 3,
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
