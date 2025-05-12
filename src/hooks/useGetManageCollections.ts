import { useEffect, useState } from "react";
import { useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";
// import {
//   extractCollectionIds,
//   mergeFields,
//   getDynamicObjectIds,
//   getMultiObjectFields,
// } from "@/lib/sui"; // 유틸 함수들 import
import { Collection } from "@/types/types";

const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID;
const MODULE_ID = import.meta.env.VITE_MODULE;
const COL_CAP_TYPE = `${PACKAGE_ID}::${MODULE_ID}::CollectionCap`;

export const useGetManageCollections = (
  address: string
): { data: Collection[]; loading: boolean; error: any } => {
  const [result, setResult] = useState<any[]>([]);
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

    const fetchCollectionInfos = async () => {
      setLoading(true);
      setInternalError(null);

      try {
        const caps = data.data;
        const collectionIdPairs = extractCollectionIds(caps); // ✅ 유틸 적용

        const allCollectionInfo = await Promise.all(
          collectionIdPairs.map(async ({ collection_id, cap_id }) => {
            try {
              const dynamicIds = await getDynamicObjectIds(suiClient, collection_id);
              const allIds = [collection_id, ...dynamicIds];
              const allFields = await getMultiObjectFields(suiClient, allIds);

              const name = {
                name: "name",
                content: allFields[0]?.base_type?.fields?.type ?? "Unknown",
              };

              const dynamic = allFields.slice(1).map((f: any) => f.value.fields);
              const merged = mergeFields([name, ...dynamic]);

              return { ...merged, cap_id, collection_id };
            } catch (e) {
              console.error("Failed to fetch collection info:", e);
              return null;
            }
          })
        );

        setResult(allCollectionInfo.filter(Boolean));
      } catch (e) {
        console.error("Unexpected error during fetch:", e);
        setInternalError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionInfos();
  }, [data, isPending, error, disabled]);

  return {
    data: result,
    loading,
    error: error || internalError,
  };
};
