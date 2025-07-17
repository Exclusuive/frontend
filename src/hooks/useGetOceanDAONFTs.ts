import { useEffect, useState } from "react";
import { useSuiClientQuery } from "@mysten/dapp-kit";
import { COLLECTION_MODULE_STRUCTS } from "@/types/moveRegistry";

export function useCheckOceanDAONFTs({ owner }: { owner: string }) {
  const [result, setResult] = useState<boolean>(false);
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

  // Check if any owned Membership NFT has collection_id === "0x2::sui::SUI"
  const hasOceanDAONFT =
    Array.isArray(data?.data) &&
    data.data.some((item) => {
      const content = item.data?.content;
      if (
        !content ||
        typeof content !== "object" ||
        !("fields" in content) ||
        !content.fields ||
        typeof content.fields !== "object" ||
        !("type" in content.fields) ||
        !content.fields.type ||
        typeof content.fields.type !== "object" ||
        !("fields" in content.fields.type) ||
        !content.fields.type.fields ||
        typeof content.fields.type.fields !== "object" ||
        !("collection_id" in content.fields.type.fields)
      ) {
        return false;
      }
      return (
        content.fields.type.fields.collection_id ===
        "0x965e1118ddbdfd65af1809a80f6e1bf25cd45569ba2c09a13e8f1fb4b31f8a2c"
      );
    });

  const refetch = () => {
    setRefetchSwitch((prev) => !prev);
  };

  useEffect(() => {
    if (hasOceanDAONFT) {
      setResult(true);
    } else {
      setResult(false);
    }
    setIsPending(false);
    setError(null);
  }, [refetchSwitch, data]);

  return {
    result,
    isPending,
    error,
    refetch,
  };
}
