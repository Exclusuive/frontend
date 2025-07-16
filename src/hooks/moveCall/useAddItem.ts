import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useState } from "react";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { MODULE } from "@/types/moveRegistry";
import { COLLECTION_MODULE_FUNCTIONS, UPGRADED_PACKAGE_ID } from "@/types/moveRegistry";
import { createClient } from "@supabase/supabase-js";
import { CollectionItem } from "@/types/collection";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export function useAddItem() {
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

  const addItem = ({
    collection_id,
    collection_cap_id,
    layer,
    name,
    img_url,
    description,
    attributes,
  }: {
    collection_id: string;
    collection_cap_id: string;
    layer: string;
    name: string;
    img_url: string;
    description?: string;
    attributes?: {
      name: string;
      value: number;
    }[];
  }) => {
    setIsPending(true);
    setError(null);
    setResult(null);

    if (!account) return;

    const tx = new Transaction();

    tx.moveCall({
      package: UPGRADED_PACKAGE_ID,
      module: COLLECTION,
      target: COLLECTION_MODULE_FUNCTIONS.register_item_type,
      arguments: [
        tx.object(collection_id),
        tx.object(collection_cap_id),
        tx.pure.string(layer),
        tx.pure.string(name),
        tx.pure.string(img_url),
      ],
    });

    // if (description) {
    //   tx.moveCall({
    //     package: UPGRADED_PACKAGE_ID,
    //     module: COLLECTION,
    //     target: COLLECTION_MODULE_FUNCTIONS.register_type_config,
    //     typeArguments: [COLLECTION_MODULE_STRUCTS.ItemType],
    //     arguments: [
    //       tx.object(collection_id),
    //       tx.object(collection_cap_id),
    //       tx.pure.string(name),
    //       tx.pure.string("description"),
    //       tx.pure.string(description),
    //     ],
    //   });
    // }

    // if (attributes) {
    //   tx.moveCall({
    //     package: UPGRADED_PACKAGE_ID,
    //     module: COLLECTION,
    //     target: COLLECTION_MODULE_FUNCTIONS.register_type_config,
    //     typeArguments: [COLLECTION_MODULE_STRUCTS.ItemType],
    //     arguments: [
    //       tx.object(collection_id),
    //       tx.object(collection_cap_id),
    //       tx.pure.string(name),
    //       tx.pure.string("attributes"),
    //       tx.pure.string(
    //         attributes.map((attribute) => `${attribute.name}:${attribute.value}`).join(","),
    //       ),
    //     ],
    //   });
    // }

    signAndExecuteTransaction(
      {
        transaction: tx.serialize(),
      },
      {
        onSuccess: () => {
          supabase
            .rpc("add_item", {
              p_attributes: attributes,
              p_collection_id: collection_id,
              p_description: description,
              p_img_url: img_url,
              p_layer: layer,
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
    addItem,
    isPending,
    error,
    result,
  };
}
