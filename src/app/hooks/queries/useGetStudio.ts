import { useQuery } from "@tanstack/react-query";
import type { SuiClient } from "@mysten/sui/client";
import { deriveStudioID } from "@/lib/utils";
import { Studio } from "@/_generated/zing_studio/studio";

async function fetchStudio(
  suiClient: SuiClient,
  owner: string,
): Promise<typeof Studio.$inferType | null> {
  const studioId = deriveStudioID(owner);

  const studioObjectResponse = await suiClient.getObject({
    id: studioId,
    options: { showBcs: true },
  });

  if (studioObjectResponse.error?.code === "notExists") {
    return null;
  }

  if (studioObjectResponse.data?.bcs?.dataType !== "moveObject") {
    throw new Error(`Failed to parse studio object for ${owner}`);
  }

  const studio = Studio.fromBase64(studioObjectResponse.data.bcs.bcsBytes);

  return studio;
}

export const getStudioQueryKey = (owner?: string | null) => ["studio", owner];
export function useGetStudio(suiClient?: SuiClient, owner?: string) {
  return useQuery({
    queryKey: getStudioQueryKey(owner),
    queryFn: async () => {
      if (!suiClient || !owner) {
        throw new Error("SuiClient and owner are required");
      }
      return fetchStudio(suiClient, owner);
    },
    enabled: Boolean(suiClient && owner),
    retry: (failureCount, error) => {
      console.log({ error });
      // Don't retry if the studio doesn't exist
      if (error instanceof Error && error.message.includes("notExists")) {
        return false;
      }
      return false;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    refetchOnMount: false, // Only fetch if data is stale
  });
}
