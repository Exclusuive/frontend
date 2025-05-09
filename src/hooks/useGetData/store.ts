import { ORIGIN_PACKAGE_ID } from "@/config/contants";
import { parseDynamicBaseTypeField, parseStoreObjectData } from "@/lib/collection";
import { StoreData } from "@/types/store";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { useEffect, useState } from "react";

export const useGetMyStores = ({ owner }: { owner: string }) => {
  const [stores, setStores] = useState<StoreData[]>([]);
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState(null);
  const [refetchSwitch, setRefetchSwitch] = useState(false);

  const STORE_CAP_TYPE = `${ORIGIN_PACKAGE_ID}::collection::StoreCap`;

  const client = new SuiClient({ url: getFullnodeUrl("testnet") });

  const refetch = () => {
    setRefetchSwitch((prev) => !prev);
  };

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
        const storeIds = data.data.flatMap((item) => {
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
            storeIds.map((id) =>
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
            storeIds.map((id) =>
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

        return storeIds.map((id, i) => {
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
            cap: capIds[i],
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
  }, [owner, refetchSwitch]);

  return {
    stores,
    isPending,
    error,
    refetch,
  };
};
