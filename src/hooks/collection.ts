import { parseCollectionObjectData, parseDynamicBaseTypeField } from "@/lib/collection";
import { CollectionData } from "@/types/collection";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { useEffect, useState } from "react";

export const useGetMyCollections = ({ owner }: { owner: string }) => {
  const [collections, setCollecitons] = useState<CollectionData[]>([]);
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState(null);

  const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID;
  const COL_CAP_TYPE = `${PACKAGE_ID}::collection::CollectionCap`;

  const client = new SuiClient({ url: getFullnodeUrl("testnet") });
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
        const ids = data.data.flatMap((item) => {
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
            ids.map((id) =>
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
            ids.map((id) =>
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

        return ids.map((id, i) => {
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
  };
};
