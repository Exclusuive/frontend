import { UPGRADED_PACKAGE_ID } from "@/config/contants";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { toast } from "sonner";

export function useEquipBase() {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const equipBase = ({
    collectionId,
    baseId,
    itemId,
  }: {
    collectionId: string;
    baseId: string;
    itemId: string;
  }) => {
    if (!account) return;

    if (!collectionId || !baseId || !itemId) return;
    console.log(collectionId, baseId, itemId);

    toast.dismiss();
    toast.loading("Loading...");

    const tx = new Transaction();

    tx.moveCall({
      package: UPGRADED_PACKAGE_ID,
      module: "collection",
      function: "equip_item_to_base",
      arguments: [tx.object(collectionId), tx.object(baseId), tx.object(itemId)],
    });

    signAndExecuteTransaction(
      {
        transaction: tx.serialize(),
      },
      {
        onSuccess: (data) => {
          toast.dismiss();
          toast.success(`Success! digset: ${data.digest}`);
        },
        onError: (err) => {
          toast.dismiss();
          toast.error(`Success! Error: ${err}`);
        },
      }
    );
  };
  return {
    equipBase,
  };
}

export function usePopFromItembag() {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const popFromItembag = ({ baseId, itemtype }: { baseId: string; itemtype: string }) => {
    if (!account) return;

    if (!baseId || !itemtype) return;
    console.log(baseId, itemtype);

    toast.dismiss();
    toast.loading("Loading...");

    const tx = new Transaction();

    const [item] = tx.moveCall({
      package: UPGRADED_PACKAGE_ID,
      module: "collection",
      function: "pop_item_from_bag",
      arguments: [tx.object(baseId), tx.pure.string(itemtype)],
    });
    tx.transferObjects([item], account.address);

    signAndExecuteTransaction(
      {
        transaction: tx.serialize(),
      },
      {
        onSuccess: (data) => {
          toast.dismiss();
          toast.success(`Success! digset: ${data.digest}`);
        },
        onError: (err) => {
          toast.dismiss();
          toast.error(`Success! Error: ${err}`);
        },
      }
    );
  };
  return {
    popFromItembag,
  };
}
