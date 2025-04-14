import { useEffect, useState } from "react";
import { useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";
import { extractSupplierIds, getDynamicObjectIds, getMultiObjectFields } from "@/lib/sui"; // 유틸 함수들 import
import { Supplier } from "@/types/types";

const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID;
const MODULE_ID = import.meta.env.VITE_MODULE;
const COL_CAP_TYPE = `${PACKAGE_ID}::${MODULE_ID}::SupplierCap`;

export const useGetManageSuppliers = (
  address: string,
  collectionId: string
): { data: Supplier[]; loading: boolean; error: any } => {
  const [result, setResult] = useState<Supplier[]>([]);
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
        const supplierIdPairs = extractSupplierIds(caps); // ✅ 유틸 적용
        const allSupplierInfo = await Promise.all(
          supplierIdPairs.map(async ({ supplier_id, cap_id }) => {
            const dynamicIds = await getDynamicObjectIds(suiClient, supplier_id);
            const allIds = [supplier_id, ...dynamicIds];
            const allFieldsResponse = await getMultiObjectFields(suiClient, allIds);
            console.log(allFieldsResponse);

            const allFields = allFieldsResponse[0];

            if (allFields.collection_id === collectionId) {
              return {
                supplier_id,
                supplier_cap_id: cap_id,
                collection_id: allFields.collection_id,
                name: allFields.name || "",
                balance: allFields.balance || 0,
                selections: allFields.selections || [],
              } as Supplier;
            }
            return null;
          })
        );

        setResult(allSupplierInfo.filter(Boolean) as Supplier[]);
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
