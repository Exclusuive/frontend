import { useEffect, useState } from "react";
import { useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";

const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID;
const MODULE_ID = import.meta.env.VITE_MODULE;
const COL_CAP_TYPE = `${PACKAGE_ID}::${MODULE_ID}::Base`;

export const useCheckUserNFTs = (address: string, collectionId: string | undefined) => {
  const [result, setResult] = useState<any[]>([]);
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
        return {
          id: fields?.id.id,
          name: fields?.name,
          img_url: fields?.img_url,
        };
      });

    setResult(result);
    setLoading(false);
  }, [data, isPending, error, disabled, collectionId]);

  return {
    data: result,
    loading,
    error: error || internalError,
  };
};
