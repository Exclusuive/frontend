import { useEffect, useState } from "react";
import { useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";
import { getDynamicObjectIds, getMultiObjectFields } from "@/lib/sui"; // 유틸 함수들 import
import { Store } from "@/types/types";

const PACKAGE_ID = import.meta.env.VITE_MOVE_CALL_PACKAGE_ID;
const MODULE_ID = import.meta.env.VITE_MODULE;
const COL_CAP_TYPE = `${PACKAGE_ID}::${MODULE_ID}::StoreCreated`;

export const useGetStores = (): { data: Store[]; loading: boolean; error: any } => {
  const [result, setResult] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [internalError, setInternalError] = useState<Error | null>(null);
  const suiClient = useSuiClient();

  const {
    data,
    isPending,
    error: queryError,
  } = useSuiClientQuery("queryEvents", {
    query: {
      MoveEventType: COL_CAP_TYPE,
    },
  });

  useEffect(() => {
    if (!data || isPending || queryError) return;

    const objectIds = data.data.map((item: any) => item.parsedJson.id);

    const fetchStoreInfos = async () => {
      setLoading(true);
      setInternalError(null);

      try {
        const allStoreInfo = await Promise.all(
          objectIds.map(async (store_id) => {
            const dynamicIds = await getDynamicObjectIds(suiClient, store_id);
            const allIds = [store_id, ...dynamicIds];
            const allFieldsResponse = await getMultiObjectFields(suiClient, allIds);

            const store = allFieldsResponse[0];

            return {
              store_id,
              store_cap_id: store.cap_id,
              collection_id: store.collection_id,
              name: store.name || "",
              balance: store.balance || 0,
              slots: store.slots || [],
            } as Store;
          })
        );

        setResult(allStoreInfo.flat().filter(Boolean) as Store[]);
      } catch (e) {
        console.error("Unexpected error during fetch:", e);
        setInternalError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreInfos();
  }, [data, isPending, queryError]);

  return {
    data: result,
    loading,
    error: queryError || internalError,
  };
};
