import { useEffect, useState } from "react";
import { useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";
import { SuiObjectResponse } from "@mysten/sui/client";
import { Store } from "@/types/types";
import { parseStoreInfo } from "@/lib/parseSuiQuery";

export const useGetStore = (storeId: string) => {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const suiClient = useSuiClient();

  const {
    data,
    isPending,
    error: queryError,
  } = useSuiClientQuery("getDynamicFields", {
    parentId: storeId,
  });

  useEffect(() => {
    const fetchStoreInfo = async () => {
      if (!data || isPending || queryError) return;

      const objectIds = data.data.map((item) => item.objectId);
      const objects = [storeId, ...objectIds];

      try {
        const res: SuiObjectResponse[] = await suiClient.multiGetObjects({
          ids: objects,
          options: {
            showContent: true,
          },
        });

        setStore(parseStoreInfo(res));
        setError(null);
      } catch (e) {
        console.error("Error fetching store detail:", e);
        setError(e instanceof Error ? e : new Error("Unknown error occurred"));
      } finally {
        setLoading(false);
      }
    };

    fetchStoreInfo();
  }, [storeId, data, isPending, queryError, suiClient]);

  return {
    store,
    loading,
    error,
    isPending: loading || isPending,
  };
};
