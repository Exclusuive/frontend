import { useEffect, useState } from "react";
import { useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";
import { getDynamicObjectIds, getMultiObjectFields } from "@/lib/sui";

const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID;
const MODULE_ID = import.meta.env.VITE_MODULE;
const COL_CAP_TYPE = `${PACKAGE_ID}::${MODULE_ID}::Item`;

export const useGetUserItems = (address: string, collectionId: string | undefined) => {
  const [result, setResult] = useState<
    Record<
      string,
      {
        id: any;
        type: string;
        img_url: string;
        properties: any;
      }[]
    >
  >({});
  const [loading, setLoading] = useState(false);
  const [internalError, setInternalError] = useState<Error | null>(null);
  const suiClient = useSuiClient();

  // address가 없으면 일찍 리턴
  const disabled = !address;
  const { data, isPending, error } = useSuiClientQuery("getOwnedObjects", {
    owner: address,
    filter: { StructType: COL_CAP_TYPE },
    options: {
      showType: true,
      showContent: true,
    },
  });

  useEffect(() => {
    if (disabled || !data || isPending || error || !collectionId) return;

    const result = data.data
      .filter((item) => {
        const content = item?.data?.content;
        if (!content || !("fields" in content)) return false;

        const fields = (content as any).fields;
        const collection_id = fields?.type?.fields?.collection_id;
        return collection_id === collectionId;
      })
      .map((item) => {
        const content = item?.data?.content;
        const fields = (content as any).fields;

        // Return a Promise for each item
        return getDynamicObjectIds(suiClient, fields?.id.id).then((dynamicIds) => {
          return getMultiObjectFields(suiClient, dynamicIds).then((allFieldsResponse) => {
            const properties = allFieldsResponse.map((field: any) => {
              return {
                type: field.value.fields.type.fields.type,
                value: field.value.fields.value,
              };
            });
            return {
              id: fields?.id.id,
              layer: fields?.type.fields.type,
              name: fields?.item_type,
              img_url: fields?.img_url,
              collection_id: fields?.type.fields.collection_id,
              properties: properties,
            };
          });
        });
      });

    // Use Promise.all to resolve all Promises
    Promise.all(result).then((resolvedItems) => {
      const itemsByLayer = (resolvedItems ?? []).reduce(
        (
          acc: Record<string, { type: string; img_url: string; id: string; properties: any }[]>,
          entry: any
        ) => {
          const layer = entry.layer;
          const name = entry.name;
          const img_url = entry.img_url;
          const id = entry.id;
          const properties = entry.properties;
          if (!acc[layer]) acc[layer] = [];
          acc[layer].push({ type: name, img_url, id, properties });

          return acc;
        },
        {}
      );

      setResult(itemsByLayer);
      setLoading(false);
      setInternalError(null);
    });
  }, [data, isPending, error, disabled, collectionId]);

  return {
    data: result,
    loading,
    error: error || internalError,
  };
};
