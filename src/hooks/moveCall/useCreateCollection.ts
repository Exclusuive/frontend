import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useState } from "react";
import { Transaction } from "@mysten/sui/transactions";
import { MODULE } from "@/types/moveRegistry";
import {
  COLLECTION_MODULE_FUNCTIONS,
  COLLECTION_MODULE_STRUCTS,
  UPGRADED_PACKAGE_ID,
} from "@/types/moveRegistry";
import { SuiTransactionBlockResponse } from "@mysten/sui/client";
import { createClient } from "@supabase/supabase-js";
import { Collection } from "@/types/collection";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export function useCreateCollection() {
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

  const createCollection = ({
    name,
    img_url,
    description,
    layers,
  }: {
    name: string;
    img_url?: string;
    description?: string;
    layers?: string[];
  }) => {
    setIsPending(true);
    setError(null);
    setResult(null);

    if (!account) return;

    const tx = new Transaction();
    const [col, cap] = tx.moveCall({
      package: UPGRADED_PACKAGE_ID,
      module: COLLECTION,
      target: COLLECTION_MODULE_FUNCTIONS.new_collection,
      arguments: [tx.pure.string(name)],
    });

    layers?.forEach((layer) => {
      tx.moveCall({
        package: UPGRADED_PACKAGE_ID,
        module: COLLECTION,
        target: COLLECTION_MODULE_FUNCTIONS.register_layer_type,
        arguments: [tx.object(col), tx.object(cap), tx.pure.string(layer)],
      });
    });

    if (img_url) {
      tx.moveCall({
        package: UPGRADED_PACKAGE_ID,
        module: COLLECTION,
        target: COLLECTION_MODULE_FUNCTIONS.register_type_config,
        typeArguments: [COLLECTION_MODULE_STRUCTS.MembershipType],
        arguments: [
          tx.object(col),
          tx.object(cap),
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
        target: COLLECTION_MODULE_FUNCTIONS.register_type_config,
        typeArguments: [COLLECTION_MODULE_STRUCTS.MembershipType],
        arguments: [
          tx.object(col),
          tx.object(cap),
          tx.pure.string(name),
          tx.pure.string("description"),
          tx.pure.string(description),
        ],
      });
    }

    tx.moveCall({
      package: "0x2",
      module: "transfer",
      function: "public_share_object",
      typeArguments: [COLLECTION_MODULE_STRUCTS.Collection],
      arguments: [tx.object(col)],
    });

    tx.transferObjects([cap], tx.pure.address(account.address));

    signAndExecuteTransaction(
      {
        transaction: tx.serialize(),
      },
      {
        onSuccess: (data: SuiTransactionBlockResponse) => {
          const collection: any = data.objectChanges?.find(
            (item: any) =>
              item.objectType.includes("::collection::Collection") &&
              !item.objectType.includes("::collection::CollectionCap"),
          );

          const cap: any = data.objectChanges?.find((item: any) =>
            item.objectType.includes("::collection::CollectionCap"),
          );

          supabase
            .rpc("create_collection", {
              p_collection_id: collection?.objectId || "",
              p_collection_cap_id: cap?.objectId || "",
              p_name: name,
              p_img_url: img_url,
              p_description: description,
              p_category: "",
              p_layers: layers,
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
    createCollection,
    isPending,
    error,
    result,
  };
}
