import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Collection } from "@/types/collection";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export function useGetCollectionDetail(collectionId: string) {
  const [collectionDetail, setCollectionDetail] = useState<Collection | null>(null);
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState(null);
  const [refetchSwitch, setRefetchSwitch] = useState(false);

  const refetch = () => {
    setRefetchSwitch((prev) => !prev);
  };

  useEffect(() => {
    supabase
      .rpc("get_collection_detail_by_collection_id", {
        p_collection_id: collectionId,
      })
      .then(({ data, error }: { data: any; error: any }) => {
        if (error) {
          setError(error);
        } else {
          setCollectionDetail(data);
        }
        setIsPending(false);
        setError(null);
      });
  }, [refetchSwitch]);

  return {
    collectionDetail,
    isPending,
    error,
    refetch,
  };
}
