import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useState } from "react";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { MODULE } from "@/types/moveRegistry";
import { COLLECTION_MODULE_FUNCTIONS, UPGRADED_PACKAGE_ID } from "@/types/moveRegistry";
import { createClient } from "@supabase/supabase-js";
import { Market } from "@/types/collection";
import { SuiTransactionBlockResponse } from "@mysten/sui/client";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export function useCreateMarket() {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Market | null>(null);

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

  const createMarket = ({
    collection_id,
    collection_cap_id,
    name,
  }: {
    collection_id: string;
    collection_cap_id: string;
    name: string;
  }) => {
    setIsPending(true);
    setError(null);
    setResult(null);

    if (!account) return;

    const tx = new Transaction();

    tx.moveCall({
      package: UPGRADED_PACKAGE_ID,
      module: COLLECTION,
      target: COLLECTION_MODULE_FUNCTIONS.create_market,
      arguments: [tx.object(collection_id), tx.object(collection_cap_id), tx.pure.string(name)],
    });

    signAndExecuteTransaction(
      {
        transaction: tx.serialize(),
      },
      {
        onSuccess: (data: SuiTransactionBlockResponse) => {
          const market: any = data.objectChanges?.find(
            (item: any) =>
              item.objectType.includes("::collection::Market") &&
              !item.objectType.includes("::collection::MarketCap"),
          );
          const marketCap: any = data.objectChanges?.find((item: any) =>
            item.objectType.includes("::collection::MarketCap"),
          );
          supabase
            .rpc("create_market", {
              p_collection_id: collection_id,
              p_market_cap_id: marketCap?.objectId || "",
              p_market_id: market?.objectId || "",
              p_name: name,
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
    createMarket,
    isPending,
    error,
    result,
  };
}
