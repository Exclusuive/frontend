import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Collection } from "@/types/collection";
import { useSuiClientQuery } from "@mysten/dapp-kit";
import { COLLECTION_MODULE_STRUCTS } from "@/types/moveRegistry";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export function useGetMemberCollections({ owner }: { owner: string }) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState(null);
  const [refetchSwitch, setRefetchSwitch] = useState(false);

  const { data } = useSuiClientQuery("getOwnedObjects", {
    owner: owner || "",
    filter: { StructType: COLLECTION_MODULE_STRUCTS.Membership },
    options: {
      showType: true,
      showContent: true,
    },
  });

  const membershipIds = data?.data?.flatMap((item) => {
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

  const refetch = () => {
    setRefetchSwitch((prev) => !prev);
  };

  useEffect(() => {
    if (membershipIds && membershipIds.length > 0) {
      supabase
        .rpc("get_collections_by_membership_addresses", {
          p_membership_addresses: membershipIds,
        })
        .then(({ data, error }: { data: any; error: any }) => {
          if (error) {
            setError(error);
          } else {
            setCollections(data);
          }
          setIsPending(false);
          setError(null);
        });
    }
  }, [refetchSwitch, data]);

  return {
    collections,
    isPending,
    error,
    refetch,
  };
}
