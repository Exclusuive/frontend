import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { CollectionItem } from "@/types/collection";
import { useSuiClientQuery } from "@mysten/dapp-kit";
import { COLLECTION_MODULE_STRUCTS } from "@/types/moveRegistry";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export function useGetMemberItems({ owner }: { owner: string }) {
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState(null);
  const [refetchSwitch, setRefetchSwitch] = useState(false);

  const { data } = useSuiClientQuery("getOwnedObjects", {
    owner: owner || "",
    filter: { StructType: COLLECTION_MODULE_STRUCTS.Item },
    options: {
      showType: true,
      showContent: true,
    },
  });

  const itemInfos = data?.data?.flatMap((item) => {
    const content = item.data?.content;
    if (
      content &&
      "fields" in content &&
      content.fields !== null &&
      "id" in content.fields &&
      typeof content.fields.id === "object" &&
      content.fields.id !== null &&
      "id" in content.fields.id &&
      typeof content.fields.id.id === "string" &&
      "type" in content.fields &&
      typeof content.fields.type === "object" &&
      content.fields.type !== null &&
      "fields" in content.fields.type &&
      content.fields.type.fields !== null &&
      typeof content.fields.type.fields === "object" &&
      "type_name" in content.fields.type.fields &&
      typeof content.fields.type.fields.type_name === "string"
    ) {
      return [{ address: content.fields.id.id, name: content.fields.type.fields.type_name }];
    }
    return [];
  });

  const refetch = () => {
    setRefetchSwitch((prev) => !prev);
  };

  useEffect(() => {
    if (itemInfos && itemInfos.length > 0) {
      supabase
        .rpc("get_items_by_item_names", {
          p_item_names: itemInfos.map((item) => item.name),
        })
        .then(({ data, error }: { data: any; error: any }) => {
          if (error) {
            setError(error);
            setIsPending(false);
            return;
          }
          const itemsWithAddress = Array.isArray(data)
            ? data.map((item: any) => ({
                ...item,
                address: itemInfos.find((info) => info.name === item.name)?.address || null,
              }))
            : [];
          setItems(itemsWithAddress);
          setIsPending(false);
          setError(null);
        });
    }
  }, [refetchSwitch, data]);

  return {
    items,
    isPending,
    error,
    refetch,
  };
}
