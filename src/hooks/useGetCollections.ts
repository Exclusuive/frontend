import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Collection } from "@/types/collection";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export function useGetAllCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [refetchSwitch, setRefetchSwitch] = useState(false);

  const refetch = () => {
    setRefetchSwitch((prev) => !prev);
  };

  useEffect(() => {
    supabase.rpc("get_collections").then(({ data, error }: { data: any; error: any }) => {
      if (error) {
        setError(error);
      } else {
        setCollections(data);
      }
      setIsPending(false);
      setError(null);
    });
  }, [refetchSwitch]);

  return {
    collections,
    isPending,
    error,
    refetch,
  };
}
