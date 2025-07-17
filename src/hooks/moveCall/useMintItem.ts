import { useCurrentAccount } from "@mysten/dapp-kit";
import { useSuiClient } from "@mysten/dapp-kit";
import { useState } from "react";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { MODULE } from "@/types/moveRegistry";
import { COLLECTION_MODULE_FUNCTIONS, UPGRADED_PACKAGE_ID } from "@/types/moveRegistry";
import { CollectionItem } from "@/types/collection";

export function useMintItem() {
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

  const mintItem = async ({
    collection_id,
    collection_cap_id,
    item,
    recipient,
  }: {
    collection_id: string;
    collection_cap_id: string;
    item: CollectionItem;
    recipient: string;
  }) => {
    setIsPending(true);
    setError(null);
    setResult(null);

    if (!account) return;
    const tx = new Transaction();

    if (item) {
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
            arguments: [tx.object(collection_id), tx.object(item_obj), tx.object(attribute_scroll)],
          });
        });
      }

      tx.transferObjects([tx.object(item_obj)], recipient);
    }

    signAndExecuteTransaction(
      {
        transaction: tx.serialize(),
      },
      {
        onSuccess: () => {
          setIsPending(false);
          setResult(item);
        },
        onError: (err: any) => {
          setIsPending(false);
          setError(err.message);
        },
        onSettled: () => {
          setIsPending(false);
        },
      },
    );
  };

  return {
    mintItem,
    isPending,
    error,
    result,
  };
}
