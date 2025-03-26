import { useEffect, useState } from "react";
import { useCurrentAccount, useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";
import { Collection } from "@/types/api";

export const useGetCollections = () => {
  const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID;
  const MODULE_ID = import.meta.env.VITE_MODULE;
  const TYPE = `${PACKAGE_ID}::${MODULE_ID}::CollectionCap`;
  const BASE_TYPE = `${PACKAGE_ID}::${MODULE_ID}::BaseType`;
  const CONFIG_KEY_TYPE = `${PACKAGE_ID}::${MODULE_ID}::ConfigKey<${BASE_TYPE}>`;

  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const account = useCurrentAccount();
  const suiClient = useSuiClient();

  const { data, isPending, error } = useSuiClientQuery("getOwnedObjects", {
    owner: account?.address || "",
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
      console.log(caps);
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

      const fetchedCollections = await Promise.all(
        collectionIds.map(async ({ collectionId, capId }) => {
          try {
            const res = await suiClient.getDynamicFieldObject({
              parentId: collectionId,
              name: {
                type: CONFIG_KEY_TYPE,
                value: "description",
              },
            });
            console.log(res);

            const fields = (res.data?.content as any)?.fields;

            return {
              ...(fields as Collection),
              objectId: collectionId,
              capId,
            };
          } catch (e) {
            console.error("❌ Failed to fetch collection by ID", collectionId, e);
            return null;
          }
        })
      );

      setCollections(fetchedCollections.filter(Boolean) as any[]);
      setLoading(false);
    };

    fetchCollections();
  }, [data, isPending, error]);

  return { collections, loading };
};
