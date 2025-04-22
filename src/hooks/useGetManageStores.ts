import { useEffect, useState } from "react";
import { useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";
import { extractStoreIds, getDynamicObjectIds, getMultiObjectFields } from "@/lib/sui"; // 유틸 함수들 import
import { Store } from "@/types/types";

const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID;
const MODULE_ID = import.meta.env.VITE_MODULE;
const COL_CAP_TYPE = `${PACKAGE_ID}::${MODULE_ID}::StoreCap`;

export const useGetManageStores = (
  address: string
): { data: Store[]; loading: boolean; error: any } => {
  const [result, setResult] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [internalError, setInternalError] = useState<Error | null>(null);
  const suiClient = useSuiClient();

  const disabled = !address;
  const { data, isPending, error } = useSuiClientQuery("getOwnedObjects", {
    owner: address,
    filter: { StructType: COL_CAP_TYPE },
    options: {
      showType: true,
      showContent: true,
    },
  });

  useEffect(() => {
    if (disabled || !data || isPending || error) return;

    const fetchSupplierInfos = async () => {
      setLoading(true);
      setInternalError(null);

      try {
        const caps = data.data;
        const storeIdPairs = extractStoreIds(caps); // ✅ 유틸 적용
        const allSupplierInfo = await Promise.all(
          storeIdPairs.map(async ({ store_id, cap_id }) => {
            const dynamicIds = await getDynamicObjectIds(suiClient, store_id);
            const allIds = [store_id, ...dynamicIds];
            const allFieldsResponse = await getMultiObjectFields(suiClient, allIds);

            const supplier = allFieldsResponse[0];

            return {
              store_id,
              store_cap_id: cap_id,
              collection_id: supplier.collection_id,
              name: supplier.name || "",
              balance: supplier.balance || 0,
              slots: supplier.slots || [],
            } as Store;
          })
        );

        setResult(allSupplierInfo.filter(Boolean) as Store[]);
      } catch (e) {
        console.error("Unexpected error during fetch:", e);
        setInternalError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplierInfos();
  }, [data, isPending, error, disabled]);

  return {
    data: result,
    loading,
    error: error || internalError,
  };
};
