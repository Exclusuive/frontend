import { DynamicFieldPage, getFullnodeUrl, SuiClient, SuiObjectResponse } from "@mysten/sui/client";
import { useEffect, useState } from "react";

export interface CollectionData {
  id: string;
  objectData: SuiObjectResponse;
  dynamicFieldData: DynamicFieldPage;
}

export const useGetMyCollections = ({ owner }: { owner: string }) => {
  const [collections, setCollecitons] = useState<CollectionData[]>([]);
  const [isPending, setIsPending] = useState<boolean>(true);

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

        const [objectDatas, dynamicFieldDatas] = await Promise.all([
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
          Promise.all(ids.map((id) => client.getDynamicFields({ parentId: id }))),
        ]);

        return ids.map((id, i) => {
          return {
            id,
            objectData: objectDatas[i],
            dynamicFieldData: dynamicFieldDatas[i],
          } as CollectionData;
        });
      })
      .then((collections) => {
        setCollecitons(collections);
        setIsPending(false);
      });
  }, [owner]);

  return {
    collections,
    isPending,
  };
};
