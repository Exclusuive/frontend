import { PACKAGE_ID } from "@/config/contants";
import { CollectionContext } from "@/context/CollectionContext";
import { CollectionData } from "@/types/collection";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useContext, useEffect, useState } from "react";
import { useToast } from "../UI/useToast";

export function useCreateStore() {
  const [currentCollection, setCurrentCollection] = useState<CollectionData>();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const {
    collection: { collections, index: cIndex },
    store: { refetch },
  } = useContext(CollectionContext);
  const { setToastState } = useToast();

  useEffect(() => {
    if (collections && cIndex !== -1) {
      setCurrentCollection(collections[cIndex]);
    }
  }, [collections, cIndex]);

  const createStore = ({ storeName }: { storeName: string }) => {
    if (currentCollection) {
      setToastState({
        type: "loading",
        message: "Store is being created...",
      });

      const tx = new Transaction();
      tx.moveCall({
        package: PACKAGE_ID,
        module: "collection",
        function: "create_store",
        arguments: [
          tx.object(currentCollection.id),
          tx.object(currentCollection.cap),
          tx.pure.string(storeName),
        ],
      });
      signAndExecuteTransaction(
        {
          transaction: tx,
        },
        {
          onSuccess: (data) => {
            console.log("Success! data:", data);
            refetch();
            setToastState({
              type: "success",
              message: "Creating store succeeded.",
            });
          },
          onError: (err) => {
            console.log("Error", err);
            setToastState({
              type: "error",
              message: "Something went wrong while creating the store. Please try again.",
            });
          },
        }
      );
    }
  };

  return {
    createStore,
  };
}
