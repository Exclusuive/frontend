import { useEffect, useState } from "react";
import { useSuiClientQuery } from "@mysten/dapp-kit";
import { MEMBERSHIP_MODULE_STRUCTS, COMMUNITY_ID } from "@/types/v2_moveRegistry";

export function useCheckMembership({ owner }: { owner: string }) {
  const [userHasMembership, setUserHasMembership] = useState<boolean>(false);
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

  const membership_id = data?.data
    .find((item: any) => {
      const content = item.data?.content;
      return content.fields.community_id === COMMUNITY_ID;
    })
    ?.data?.objectId?.toString();

  const refetch = () => {
    setRefetchSwitch((prev) => !prev);
  };

  useEffect(() => {
    if (data) {
      setUserHasMembership(true);
    } else {
      setUserHasMembership(false);
    }
    setIsPending(false);
    setError(null);
  }, [refetchSwitch, data]);

  return {
    userHasMembership,
    membership_id,
    isPending,
    error,
    refetch,
  };
}
