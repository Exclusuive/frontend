import { useCurrentAccount } from "@mysten/dapp-kit";
import { useSuiClient } from "@mysten/dapp-kit";
import { useState } from "react";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { SuiTransactionBlockResponse } from "@mysten/sui/client";
import { MODULE } from "@/types/moveRegistry";
import { COLLECTION_MODULE_FUNCTIONS, UPGRADED_PACKAGE_ID } from "@/types/moveRegistry";
import { Membership } from "@/types/collection";
import { uploadMembership } from "@/hooks/axios/uploadBase";
import { getMembershipUrl } from "@/lib/collection";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export function useMintMembership() {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Membership | null>(null);

  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) =>
      await client.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          showRawEffects: true,
          showObjectChanges: true,
        },
      }),
  });
  const { COLLECTION } = MODULE;

  const mintMembership = async ({
    collection_id,
    collection_cap_id,
    recipient,
  }: {
    collection_id: string;
    collection_cap_id: string;
    recipient: string;
  }) => {
    setIsPending(true);
    setError(null);
    setResult(null);

    if (!account) return;

    const res = await uploadMembership();
    const baseImgPath = await getMembershipUrl(res.data.data.fullPath);
    const tx = new Transaction();

    tx.moveCall({
      package: UPGRADED_PACKAGE_ID,
      module: COLLECTION,
      target: COLLECTION_MODULE_FUNCTIONS.mint_membership,
      arguments: [
        tx.object(collection_id),
        tx.object(collection_cap_id),
        tx.pure.string(baseImgPath),
        tx.pure.address(recipient),
      ],
    });

    signAndExecuteTransaction(
      {
        transaction: tx.serialize(),
      },
      {
        onSuccess: (data: SuiTransactionBlockResponse) => {
          const membership: any = data.objectChanges?.find((item: any) =>
            item.objectType.includes("::collection::Membership"),
          );

          supabase
            .rpc("add_membership", {
              p_img_url: baseImgPath,
              p_collection_id: collection_id,
              p_membership_id: res.membership_id,
              p_address: membership.objectId,
            })
            .then((res) => {
              if (res.error) {
                setError(res.error.message);
              } else {
                setResult(res.data);
              }
            });
          setIsPending(false);
        },
        onError: (err: any) => {
          setError(err.message);
        },
        onSettled: () => {
          setIsPending(false);
        },
      },
    );
  };

  return {
    mintMembership,
    isPending,
    error,
    result,
  };
}
