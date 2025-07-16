import { Collection } from "@/types/collection";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Fetches the detail of a collection by its ID.
 * @param collectionId The ID of the collection to fetch.
 * @returns A promise resolving to the Collection detail.
 */
export const getCollectionDetail = async (collectionId: string): Promise<Collection> => {
  let { data } = await supabase.rpc("get_collection_detail_by_collection_id", {
    p_collection_id: collectionId,
  });
  return data;
};

export const getMembershipUrl = (path: string) => {
  return `https://ezesepaxcbbzvjjzivwe.supabase.co/storage/v1/object/public/${path}`;
};
