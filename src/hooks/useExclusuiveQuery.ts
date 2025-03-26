import { useEffect, useState } from "react";
import { useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";

export const useExclusuiveQuery = () => {
  const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID;
  const MODULE_ID = import.meta.env.VITE_MODULE;
  const TYPE = `${PACKAGE_ID}::${MODULE_ID}::CollectionCap`;
  const [result, setResult] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const suiClient = useSuiClient();

  const getCollections = (address: string) => {
    const { data, isPending, error } = useSuiClientQuery("getOwnedObjects", {
      owner: address || "",
      filter: { StructType: TYPE },
      options: {
        showType: true,
        showContent: true,
      },
    });

    useEffect(() => {
      const fetchCollections = async () => {
        if (!data || isPending || error) return;

        const caps = data.data;
        const collectionIds = caps
          .map((obj) => {
            const content = obj.data?.content;
            if (
              content?.dataType === "moveObject" &&
              "fields" in content &&
              "collection_id" in content.fields
            ) {
              return {
                collectionId: content.fields.collection_id as string,
                capId: obj.data?.objectId as string,
              };
            }
            return null;
          })
          .filter(Boolean) as { collectionId: string; capId: string }[];
        setResult(collectionIds);
        setLoading(false);
      };
      fetchCollections();
    }, [data, isPending, error]);
    return { result, loading };
  };

  const getCollectionInfo = (collectionId: string) => {
    const { data, isPending, error } = useSuiClientQuery("getDynamicFields", {
      parentId: collectionId,
    });

    useEffect(() => {
      const fetchCollectionInfo = async () => {
        if (!data || isPending || error) return;
        const objectIds = data.data.map((item) => item.objectId);
        const objects = [collectionId, ...objectIds];
        const res = await suiClient.multiGetObjects({
          ids: objects,
          options: {
            showContent: true,
          },
        });
        const name = {
          name: "name",
          content: (res[0].data?.content as any)?.fields?.base_type?.fields?.name ?? "Unknown",
        };

        const dynamic = res
          .slice(1)
          .filter((item) => item.data && item.data.content)
          .map((item) => (item.data!.content as any).fields.value.fields);
        const result = [name, ...dynamic];

        // 각 요소를 하나의 객체로 병합
        const merged = result.reduce(
          (acc, item) => {
            acc[item.name] = item.content;
            return acc;
          },
          {} as Record<string, any>
        );

        // 최종 배열 형태로 감싸기
        setResult(merged);
        setLoading(false);
      };

      fetchCollectionInfo();
    }, [data, isPending, error]);
    return { result, loading };
  };

  const getCollectionInfos = (address: string) => {
    const { data, isPending, error } = useSuiClientQuery("getOwnedObjects", {
      owner: address,
      filter: { StructType: TYPE },
      options: {
        showType: true,
        showContent: true,
      },
    });

    useEffect(() => {
      const fetchCollectionInfos = async () => {
        if (!data || isPending || error) return;

        const caps = data.data;

        const collectionIds = caps
          .map((obj) => {
            const content = obj.data?.content;
            if (
              content?.dataType === "moveObject" &&
              "fields" in content &&
              "collection_id" in content.fields
            ) {
              return {
                collectionId: content.fields.collection_id as string,
                capId: obj.data?.objectId as string,
              };
            }
            return null;
          })
          .filter(Boolean) as { collectionId: string; capId: string }[];

        const allCollectionInfo = await Promise.all(
          collectionIds.map(async ({ collectionId, capId }) => {
            try {
              const fieldsData = await suiClient.getDynamicFields({ parentId: collectionId });
              const objectIds = fieldsData.data.map((item) => item.objectId);
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
                .filter((item) => item.data && item.data.content)
                .map((item) => (item.data!.content as any).fields.value.fields);

              const result = [name, ...dynamic];

              const merged = result.reduce(
                (acc, item) => {
                  acc[item.name] = item.content;
                  return acc;
                },
                {} as Record<string, any>
              );

              return { ...merged, capId };
            } catch (e) {
              console.error("Failed to fetch collection info:", e);
              return null;
            }
          })
        );

        const filteredInfo = allCollectionInfo.filter(Boolean);
        setResult(filteredInfo); // ✅ [{...collection1Info}, {...collection2Info}, ...]
        setLoading(false);
      };

      fetchCollectionInfos();
    }, [data, isPending, error]);

    return { result, loading };
  };

  return { getCollections, getCollectionInfo, getCollectionInfos };
};
