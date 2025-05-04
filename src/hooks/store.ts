// import { parseCollectionObjectData, parseDynamicBaseTypeField } from "@/lib/collection";
// import { CollectionData } from "@/types/collection";
import { parseDynamicBaseTypeField, parseStoreObjectData } from "@/lib/collection";
import { StoreData } from "@/types/store";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { useEffect, useState } from "react";

export const useGetMyCollectionStores = ({ owner }: { owner: string }) => {
  const [stores, setStores] = useState<StoreData[]>([]);
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState(null);

  const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID;
  const STORE_CAP_TYPE = `${PACKAGE_ID}::collection::StoreCap`;

  const client = new SuiClient({ url: getFullnodeUrl("testnet") });
  useEffect(() => {
    client
      .getOwnedObjects({
        owner,
        filter: { StructType: STORE_CAP_TYPE },
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
            "store_id" in content.fields &&
            typeof content.fields.store_id === "string"
          ) {
            return [content.fields.store_id];
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

          const storeObjectData = parseStoreObjectData(objectDataArray[i].data);

          if (!storeObjectData) return;

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
            objectData: storeObjectData,
            dynamicFieldData: filteredDynamicFieldDatas,
          } as StoreData;
        });
      })
      .then((collections) => {
        const storesWithoutNull = collections.flatMap((c) => {
          if (!c) return [];
          return c;
        });

        setStores(storesWithoutNull);
        setIsPending(false);
        setError(null);
      })
      .catch((e) => {
        setError(e);
      });
  }, [owner]);

  return {
    stores,
    isPending,
    error,
  };
};
