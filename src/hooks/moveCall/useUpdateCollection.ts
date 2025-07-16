import { useState } from "react";
import { Transaction } from "@mysten/sui/transactions";
import { MODULE } from "@/types/moveRegistry";
import {
  COLLECTION_MODULE_FUNCTIONS,
  COLLECTION_MODULE_STRUCTS,
  UPGRADED_PACKAGE_ID,
} from "@/types/moveRegistry";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useSuiClient } from "@mysten/dapp-kit";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Collection } from "@/types/collection";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export function useUpdateCollection() {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Collection | null>(null);

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

  const updateCollection = ({
    collection_id,
    collection_cap_id,
    name,
    img_url,
    description,
    layers,
    attributes,
    tickets,
  }: {
    collection_id: string;
    collection_cap_id: string;
    name: string;
    img_url?: string | null;
    description?: string | null;
    layers?: string[];
    attributes?: string[];
    tickets?: string[];
  }) => {
    setIsPending(true);
    setError(null);
    setResult(null);

    if (!account) return;

    const tx = new Transaction();

    layers?.forEach((layer) => {
      tx.moveCall({
        package: UPGRADED_PACKAGE_ID,
        module: COLLECTION,
        target: COLLECTION_MODULE_FUNCTIONS.register_layer_type,
        arguments: [tx.object(collection_id), tx.object(collection_cap_id), tx.pure.string(layer)],
      });
    });

    attributes?.forEach((attribute) => {
      tx.moveCall({
        package: UPGRADED_PACKAGE_ID,
        module: COLLECTION,
        target: COLLECTION_MODULE_FUNCTIONS.register_attribute_type,
        arguments: [
          tx.object(collection_id),
          tx.object(collection_cap_id),
          tx.pure.string(attribute),
        ],
      });
    });

    tickets?.forEach((ticket) => {
      tx.moveCall({
        package: UPGRADED_PACKAGE_ID,
        module: COLLECTION,
        target: COLLECTION_MODULE_FUNCTIONS.register_ticket_type,
        arguments: [tx.object(collection_id), tx.object(collection_cap_id), tx.pure.string(ticket)],
      });
    });

    if (img_url) {
      tx.moveCall({
        package: UPGRADED_PACKAGE_ID,
        module: COLLECTION,
        target: COLLECTION_MODULE_FUNCTIONS.update_type_config,
        typeArguments: [COLLECTION_MODULE_STRUCTS.MembershipType],
        arguments: [
          tx.object(collection_id),
          tx.object(collection_cap_id),
          tx.pure.string(name),
          tx.pure.string("img_url"),
          tx.pure.string(img_url),
        ],
      });
    }

    if (description) {
      tx.moveCall({
        package: UPGRADED_PACKAGE_ID,
        module: COLLECTION,
        target: COLLECTION_MODULE_FUNCTIONS.update_type_config,
        typeArguments: [COLLECTION_MODULE_STRUCTS.MembershipType],
        arguments: [
          tx.object(collection_id),
          tx.object(collection_cap_id),
          tx.pure.string(name),
          tx.pure.string("description"),
          tx.pure.string(description),
        ],
      });
    }

    // markets?.forEach((market) => {
    //   tx.moveCall({
    //     package: UPGRADED_PACKAGE_ID,
    //     module: COLLECTION,
    //     target: COLLECTION_MODULE_FUNCTIONS.create_market,
    //     arguments: [tx.object(collection_id), tx.object(collection_cap_id), tx.pure.string(market)],
    //   });
    // });

    signAndExecuteTransaction(
      {
        transaction: tx.serialize(),
      },
      {
        onSuccess: () => {
          supabase
            .rpc("update_collection", {
              p_collection_id: collection_id,
              p_img_url: img_url || null,
              p_description: description || null,
              p_layers: layers,
              p_attributes: attributes,
              p_tickets: tickets,
            })
            .then((res) => {
              if (res.error) {
                setError(res.error.message);
              } else {
                setIsPending(false);
                setResult(res.data);
              }
            });
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
    updateCollection,
    isPending,
    error,
    result,
  };
}
