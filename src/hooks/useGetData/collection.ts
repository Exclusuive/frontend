import { PACKAGE_ID } from "@/config/contants";
import { parseCollectionObjectData, parseDynamicBaseTypeField } from "@/lib/collection";
import { CollectionData } from "@/types/collection";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { useEffect, useState } from "react";

export const useGetMyCollections = ({ owner }: { owner: string }) => {
  const [collections, setCollecitons] = useState<CollectionData[]>([]);
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState(null);
  const [refetchSwitch, setRefetchSwitch] = useState(false);

  const COL_CAP_TYPE = `${PACKAGE_ID}::collection::CollectionCap`;

  const client = new SuiClient({ url: getFullnodeUrl("testnet") });

  const refetch = () => {
    setRefetchSwitch((prev) => !prev);
  };

  useEffect(() => {
    client
      .getOwnedObjects({
        owner,
        filter: { StructType: COL_CAP_TYPE },
        options: {
          showType: true,
          showContent: true,
        },
      })
      .then(async (data) => {
        const capIds = data.data.flatMap((item) => {
          const content = item.data?.content;
          if (
            content &&
            "fields" in content &&
            content.fields !== null &&
            "id" in content.fields &&
            typeof content.fields.id === "object" &&
            content.fields.id !== null &&
            "id" in content.fields.id &&
            typeof content.fields.id.id === "string"
          ) {
            return [content.fields.id.id];
          }
          return [];
        });
        const collectionIds = data.data.flatMap((item) => {
          const content = item.data?.content;
          if (
            content &&
            "fields" in content &&
            "collection_id" in content.fields &&
            typeof content.fields.collection_id === "string"
          ) {
            return [content.fields.collection_id];
          }
          return [];
        });

        const [objectDataArray, dynamicFieldDatasArray] = await Promise.all([
          Promise.all(
            collectionIds.map((id) =>
              client.getObject({
                id,
                options: {
                  showType: true,
                  showContent: true,
                },
              })
            )
          ),
          Promise.all(
            collectionIds.map((id) =>
              client
                .getDynamicFields({ parentId: id }) // line break
                .then((data) => {
                  const dynamicFieldObjectIds = data.data.map((d) => {
                    return d.objectId;
                  });

                  return client.multiGetObjects({
                    ids: dynamicFieldObjectIds,
                    options: { showContent: true, showType: true },
                  });
                })
            )
          ),
        ]);

        return collectionIds.map((id, i) => {
          if (!objectDataArray[i].data) return;

          const collectionObjectData = parseCollectionObjectData(objectDataArray[i].data);

          if (!collectionObjectData) return;

          const parsedDynamicFieldDatas = dynamicFieldDatasArray[i].map((d) => {
            if (!d.data) return null;
            return parseDynamicBaseTypeField(d.data);
          });

          const filteredDynamicFieldDatas = parsedDynamicFieldDatas.filter(
            (value) => value !== null
          );

          if (filteredDynamicFieldDatas.length !== parsedDynamicFieldDatas.length) {
            return;
          }

          return {
            id,
            cap: capIds[i],
            objectData: collectionObjectData,
            dynamicFieldData: filteredDynamicFieldDatas,
          } as CollectionData;
        });
      })
      .then((collections) => {
        const collectionsWithoutNull = collections.flatMap((c) => {
          if (!c) return [];
          return c;
        });

        setCollecitons(collectionsWithoutNull);
        setIsPending(false);
        setError(null);
      })
      .catch((e) => {
        setError(e);
      });
  }, [owner]);

  return {
    collections,
    isPending,
    error,
    refetch,
  };
};
