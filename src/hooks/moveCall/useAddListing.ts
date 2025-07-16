import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useState } from "react";
import { Transaction } from "@mysten/sui/transactions";
import {
  MODULE,
  UPGRADED_PACKAGE_ID,
  COLLECTION_MODULE_FUNCTIONS,
  COLLECTION_MODULE_STRUCTS,
} from "@/types/moveRegistry";
import { CollectionItem, Listing, Ticket } from "@/types/collection";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export function useAddListing() {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Listing | null>(null);

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

  const addListing = ({
    collection_id,
    collection_cap_id,
    market_id,
    market_cap_id,
    listing_number,
    price,
    conditions,
    item,
    value,
  }: {
    collection_id: string;
    collection_cap_id: string;
    market_id: string;
    market_cap_id: string;
    listing_number: number;
    price: number;
    conditions?: Ticket[];
    item?: CollectionItem | null;
    value: number;
  }) => {
    setIsPending(true);
    setError(null);
    setResult(null);

    if (!account) return;

    const tx = new Transaction();

    tx.moveCall({
      package: UPGRADED_PACKAGE_ID,
      module: COLLECTION,
      target: COLLECTION_MODULE_FUNCTIONS.register_listing_to_market,
      typeArguments: [COLLECTION_MODULE_STRUCTS.Item],
      arguments: [
        tx.object(collection_id),
        tx.object(market_id),
        tx.object(market_cap_id),
        tx.pure.u64(price),
      ],
    });

    if (conditions) {
      conditions.forEach((condition) => {
        tx.moveCall({
          package: UPGRADED_PACKAGE_ID,
          module: COLLECTION,
          target: COLLECTION_MODULE_FUNCTIONS.register_purchase_condition_to_listing,
          arguments: [
            tx.object(collection_id),
            tx.object(market_id),
            tx.object(market_cap_id),
            tx.pure.u64(listing_number),
            tx.pure.string(condition.name),
            tx.pure.u64(Number(condition.value)),
          ],
        });
      });
    }

    if (item) {
      for (let i = 0; i < value; i++) {
        const [item_obj] = tx.moveCall({
          package: UPGRADED_PACKAGE_ID,
          module: COLLECTION,
          target: COLLECTION_MODULE_FUNCTIONS.new_item,
          arguments: [
            tx.object(collection_id),
            tx.object(collection_cap_id),
            tx.pure.string(item.layer),
            tx.pure.string(item.name),
          ],
        });

        if (item.attributes) {
          item.attributes.forEach((attribute) => {
            const [attribute_scroll] = tx.moveCall({
              package: UPGRADED_PACKAGE_ID,
              module: COLLECTION,
              target: COLLECTION_MODULE_FUNCTIONS.new_attribute_scroll,
              arguments: [
                tx.object(collection_id),
                tx.object(collection_cap_id),
                tx.pure.string(attribute.name),
                tx.pure.u64(Number(attribute.value)),
              ],
            });
            tx.moveCall({
              package: UPGRADED_PACKAGE_ID,
              module: COLLECTION,
              target: COLLECTION_MODULE_FUNCTIONS.attach_attribute_to_item,
              arguments: [
                tx.object(collection_id),
                tx.object(item_obj),
                tx.object(attribute_scroll),
              ],
            });
          });
        }

        tx.moveCall({
          package: UPGRADED_PACKAGE_ID,
          module: COLLECTION,
          target: COLLECTION_MODULE_FUNCTIONS.stock_product_to_listing,
          typeArguments: [COLLECTION_MODULE_STRUCTS.Item],
          arguments: [
            tx.object(collection_id),
            tx.object(market_id),
            tx.object(market_cap_id),
            tx.pure.u64(listing_number),
            tx.object(item_obj),
          ],
        });
      }
    }

    signAndExecuteTransaction(
      {
        transaction: tx.serialize(),
      },
      {
        onSuccess: () => {
          supabase
            .rpc("add_listing", {
              p_market_id: market_id,
              p_price: price,
              p_item_name: item?.name || "",
              p_item_value: value,
              p_conditions: conditions,
            })
            .then((res) => {
              if (res.error) {
                console.log(res.error);
                setError(res.error.message);
              } else {
                console.log(res.data);
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
    addListing,
    isPending,
    error,
    result,
  };
}
