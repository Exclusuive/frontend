import { useEffect, useState } from "react";
import { useSuiClientQuery } from "@mysten/dapp-kit";

const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID;
const MODULE_ID = import.meta.env.VITE_MODULE;
const COL_CAP_TYPE = `${PACKAGE_ID}::${MODULE_ID}::Ticket`;

export const useGetTickets = (address: string) => {
  const [result, setResult] = useState<Record<string, string[]>>({} as Record<string, string[]>);
  const [loading, setLoading] = useState(false);
  const [internalError, setInternalError] = useState<Error | null>(null);

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
    if (!data || isPending || error || disabled) return;

    const fetchStoreInfos = async () => {
      setLoading(true);
      setInternalError(null);

      try {
        const result: Record<string, string[]> = {}; // result 변수를 내부에서 선언해야 함

        data.data.forEach((item: any) => {
          const objectId = item.data.objectId;
          const ticketType = item.data.content.fields.type.fields.type;

          if (!result[ticketType]) {
            result[ticketType] = [];
          }

          result[ticketType].push(objectId);
        });

        setResult(result);
      } catch (e) {
        console.error("Unexpected error during fetch:", e);
        setInternalError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreInfos();
  }, [data, isPending, error]);

  return {
    tickets: result,
    loading,
    error: error || internalError,
  };
};
