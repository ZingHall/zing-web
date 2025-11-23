import { Article } from "@/_generated/zing_studio/article";
import { useQuery } from "@tanstack/react-query";
import type { SuiClient } from "@mysten/sui/client";
import { deriveWorksID, ZING_STUDIO_ARTICLE_TYPES } from "@/lib/utils";

interface UseGetWorksResult {
  data: Work[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export type Work = typeof Article.$inferType & {
  totalSize: number;
  registeredEpoch: number;
  deletable: boolean;
  storageSize: number;
};

async function fetchStudioWorks(
  suiClient: SuiClient,
  owner: string,
): Promise<Work[]> {
  const studioWorksId = deriveWorksID(owner);
  console.log({ studioWorksId });

  const res = await suiClient.getDynamicFields({
    parentId: studioWorksId,
  });

  const worksDynamicFields = res.data.filter(
    (work) => work.objectType === ZING_STUDIO_ARTICLE_TYPES,
  );
  const works = await suiClient.multiGetObjects({
    ids: worksDynamicFields.map((df) => df.objectId),
    options: {
      showBcs: true,
    },
  });

  const parsedWorks = works.map((w) => {
    if (w.data?.bcs?.dataType !== "moveObject") {
      throw new Error(`Failed to parse article works for ${owner}`);
    }
    const article = Article.fromBase64(w.data.bcs.bcsBytes);
    const totalSize = article.blobs.reduce((acc, b) => acc + Number(b.size), 0);
    const registeredEpoch = article.blobs[0].registered_epoch;
    const deletable = article.blobs[0].deletable;
    const storageSize = article.blobs.reduce(
      (acc, b) => acc + Number(b.storage.storage_size),
      0,
    );

    return {
      ...article,
      totalSize,
      registeredEpoch,
      deletable,
      storageSize,
    } as Work;
  });

  return parsedWorks;
}

export function useGetStudioWorks(
  suiClient?: SuiClient,
  owner?: string,
): UseGetWorksResult {
  const {
    data = [] as Work[],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["studioWorks", owner],
    queryFn: () => fetchStudioWorks(suiClient!, owner!),
    enabled: Boolean(suiClient && owner),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });

  return {
    data,
    loading,
    error: error as Error | null,
    refetch: () => {
      refetch();
    },
  };
}
