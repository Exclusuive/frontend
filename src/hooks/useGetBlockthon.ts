import { useEffect, useState } from "react";
import { useSuiClientQuery } from "@mysten/dapp-kit";
import { MEMBERSHIP_MODULE_STRUCTS } from "@/types/v2_moveRegistry";

// const COMMUNITY_ID = "0xaf550af908b1acb9496d29d27b2985a4614a41c60b27e6d8d0ee8c85aa91a8eb";

export function useGetBlockthon({ owner }: { owner: string }) {
  const [result, setResult] = useState<any>(null);
  const [hasMembership, setHasMembership] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState(null);
  const [refetchSwitch, setRefetchSwitch] = useState(false);

  const { data } = useSuiClientQuery("getOwnedObjects", {
    owner: owner || "",
    filter: { StructType: MEMBERSHIP_MODULE_STRUCTS.Membership },
    options: {
      showType: true,
      showContent: true,
    },
  });

  // Check if any owned Membership NFT has collection_id === "0x2::sui::SUI"
  const memberships =
    Array.isArray(data?.data) &&
    data.data.map((item) => {
      const content = item.data?.content;
      if (
        !content ||
        typeof content !== "object" ||
        !("fields" in content) ||
        !content.fields ||
        typeof content.fields !== "object" ||
        !("community_id" in content.fields) ||
        !content.fields.community_id ||
        typeof content.fields.community_id !== "string"
      ) {
        return false;
      }
      return content.fields;
    });

  const refetch = () => {
    setRefetchSwitch((prev) => !prev);
  };

  console.log(memberships);

  useEffect(() => {
    if (memberships) {
      setResult(memberships);
      setHasMembership(memberships.length > 0);
    } else {
      setResult(false);
      setHasMembership(false);
    }
    setIsPending(false);
    setError(null);
  }, [refetchSwitch, data]);

  return {
    result,
    hasMembership,
    isPending,
    error,
    refetch,
  };
}
