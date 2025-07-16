import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useState } from "react";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { MODULE } from "@/types/moveRegistry";
import { COLLECTION_MODULE_FUNCTIONS, UPGRADED_PACKAGE_ID } from "@/types/moveRegistry";
import { createClient } from "@supabase/supabase-js";
import { CollectionItem, Membership } from "@/types/collection";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export function useEquipItem() {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CollectionItem | null>(null);

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

  const equipItem = ({
    collection_id,
    membership,
    item,
  }: {
    collection_id: string;
    membership: Membership;
    item: CollectionItem;
  }) => {
    setIsPending(true);
    setError(null);
    setResult(null);

    if (!account) return;

    const tx = new Transaction();

    tx.moveCall({
      package: UPGRADED_PACKAGE_ID,
      module: COLLECTION,
      target: COLLECTION_MODULE_FUNCTIONS.equip_item_to_membership,
      arguments: [
        tx.object(collection_id),
        tx.object(membership.address),
        tx.object(item.address || ""),
      ],
    });

    signAndExecuteTransaction(
      {
        transaction: tx.serialize(),
      },
      {
        onSuccess: () => {
          supabase
            .rpc("equip_item_to_membership", {
              p_item_name: item.name,
              p_membership_id: membership.membership_id,
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
    equipItem,
    isPending,
    error,
    result,
  };
}
