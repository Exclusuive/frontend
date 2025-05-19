import { UPGRADED_PACKAGE_ID } from "@/config/contants";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useToast } from "../UI/useToast";

export function useEquipBase() {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const { setToastState } = useToast();

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

    setToastState({
      type: "loading",
      message: "Base is being equipped...",
    });

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
          console.log("Success! data:", data);
          setToastState({
            type: "success",
            message: "Base is being equipped...",
          });
        },
        onError: (err) => {
          console.log("Error", err);
          setToastState({
            type: "error",
            message: "Something went wrong while equipping the base. Please try again.",
          });
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
  const { setToastState } = useToast();

  const popFromItembag = ({ baseId, itemtype }: { baseId: string; itemtype: string }) => {
    if (!account) return;

    if (!baseId || !itemtype) return;
    console.log(baseId, itemtype);

    setToastState({
      type: "loading",
      message: "Item is being popped from itembag...",
    });

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
          console.log("Success! data:", data);
          setToastState({
            type: "success",
            message: "Item is popped from itembag successfully.",
          });
        },
        onError: (err) => {
          console.log("Error", err);
          setToastState({
            type: "error",
            message: "Something went wrong while popping the item from itembag. Please try again.",
          });
        },
      }
    );
  };
  return {
    popFromItembag,
  };
}
