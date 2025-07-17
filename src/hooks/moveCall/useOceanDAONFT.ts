import { useCurrentAccount } from "@mysten/dapp-kit";
import { useState } from "react";
import { CollectionItem, Membership } from "@/types/collection";
import { uploadMembership } from "@/hooks/axios/uploadBase";
import { getMembershipUrl } from "@/lib/collection";
import axios from "axios";

export function useMakeOceanDAONFT() {
  const account = useCurrentAccount();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Membership | null>(null);

  const makeOceanDAONFT = async ({
    item,
    recipient,
    isNew,
  }: {
    item: CollectionItem;
    recipient: string;
    isNew: boolean;
  }) => {
    setIsPending(true);
    setError(null);
    setResult(null);
    try {
      if (!account) return;
      let baseImgPath;

      if (isNew) {
        const res = await uploadMembership();
        baseImgPath = await getMembershipUrl(res.data.data.fullPath);
      }
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/exclusuive/makeOceanDAO`, {
        item,
        recipient,
        baseImgPath,
      });

      setResult(res.data);
      setIsPending(false);
      setError(null);
    } catch (error) {
      setError(error as string);
    }
  };

  return {
    makeOceanDAONFT,
    isPending,
    error,
    result,
  };
}
