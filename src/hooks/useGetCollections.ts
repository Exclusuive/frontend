import { useEffect, useState } from "react";
import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { getCollectionsByObjectIds } from "@/api/collections";
import { Collection } from "@/types/api";

type CollectionWithOwner = Collection & {
  objectId: string;
  owner: string;
};

export const useGetCollections = () => {
  const PACKAGE = "0xe47afcfd1189c1d1ec792428c952e07a6016046d5fdfdc7de3120c3ac249116f";
  const MODULE = "collection";
  const [collections, setCollections] = useState<CollectionWithOwner[]>([]);
  const [loading, setLoading] = useState(true);
  const account = useCurrentAccount();

  const { data, isPending, error } = useSuiClientQuery("getOwnedObjects", {
    owner: account?.address || "",
    options: {
      showType: true,
      showOwner: true,
      showContent: true,
    },
  });

  useEffect(() => {
    const fetch = async () => {
      if (!data || isPending || error) return;

      const filtered = data.data.filter((obj) => {
        const type = obj.data?.type;
        return type?.startsWith(`${PACKAGE}::${MODULE}::`);
      });

      // collection_id, objectId, owner 추출
      const mapping = filtered
        .map((obj) => {
          const content = obj.data?.content;
          const objectId = obj.data?.objectId;

          let owner = "";
          const rawOwner = obj.data?.owner;

          if (typeof rawOwner === "object" && rawOwner !== null && "AddressOwner" in rawOwner) {
            owner = rawOwner.AddressOwner;
          }

          if (content?.dataType === "moveObject") {
            const fields = content.fields as any;
            const collectionId = fields?.collection_id;
            if (collectionId && objectId && owner) {
              return {
                collectionId,
                objectId,
                owner,
              };
            }
          }

          return null;
        })
        .filter(Boolean) as {
        collectionId: string;
        objectId: string;
        owner: string;
      }[];

      if (mapping.length > 0) {
        const uniqueCollectionIds = [...new Set(mapping.map((m) => m.collectionId))];

        try {
          const res = await getCollectionsByObjectIds(uniqueCollectionIds);

          // 컬렉션 ID 기준으로 owner와 objectId 붙이기
          const combined: CollectionWithOwner[] = res.map((collection) => {
            const match = mapping.find((m) => m.collectionId === collection.id);
            return {
              ...collection,
              objectId: match?.objectId || "",
              owner: match?.owner || "",
            };
          });

          setCollections(combined);
        } catch (err) {
          console.error("컬렉션 조회 실패:", err);
        }
      }

      setLoading(false);
    };

    fetch();
  }, [data, isPending, error]);

  return { collections, loading };
};
