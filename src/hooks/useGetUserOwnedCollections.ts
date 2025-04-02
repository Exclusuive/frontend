import { useEffect, useState } from "react";
import { useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";

const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID;
const MODULE_ID = import.meta.env.VITE_MODULE;
const COL_CAP_TYPE = `${PACKAGE_ID}::${MODULE_ID}::Base`;

export const useGetUserOwnedCollections = (address: string) => {
  const [result, setResult] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [internalError, setInternalError] = useState<Error | null>(null);
  const suiClient = useSuiClient();

  // address가 없으면 일찍 리턴
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

    const uniqueCollectionIds = Array.from(
      new Set(
        data?.data
          .map((item) => {
            const content = item?.data?.content;
            if (!content || !("fields" in content)) return null;

            const fields = (content as any).fields;
            return fields?.type?.fields?.collection_id || null;
          })
          .filter((id): id is string => id !== null)
      )
    );

    console.log(uniqueCollectionIds);

    const fetchCollectionInfos = async () => {
      setLoading(true);
      setInternalError(null);

      try {
        const allCollectionInfo = await Promise.all(
          uniqueCollectionIds.map(async (collectionId) => {
            try {
              const fieldsData = await suiClient.getDynamicFields({ parentId: collectionId });
              const objectIds = fieldsData.data.map((item: any) => item.objectId);
              const allObjectIds = [collectionId, ...objectIds];
              const res = await suiClient.multiGetObjects({
                ids: allObjectIds,
                options: { showContent: true },
              });

              const name = {
                name: "name",
                content:
                  (res[0].data?.content as any)?.fields?.base_type?.fields?.name ?? "Unknown",
              };

              const dynamic = res
                .slice(1)
                .filter((item: any) => item.data && item.data.content)
                .map((item: any) => (item.data!.content as any).fields.value.fields);

              const result = [name, ...dynamic];

              const merged = result.reduce(
                (acc, item) => {
                  acc[item.name] = item.content;
                  return acc;
                },
                {} as Record<string, any>
              );

              return { ...merged, collectionId };
            } catch (e) {
              console.error("Failed to fetch collection info:", e);
              return null;
            }
          })
        );

        const filteredInfo = allCollectionInfo.filter(Boolean);
        setResult(filteredInfo);
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
