import { PACKAGE_ID } from "@/config/contants";
import { CollectionContext } from "@/context/CollectionContext";
import { CollectionData } from "@/types/collection";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useContext, useEffect, useState } from "react";
import { useToast } from "../UI/useToast";

export function useMint() {
  const [currentCollection, setCurrentCollection] = useState<CollectionData>();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const {
    collection: { collections, index: cIndex },
  } = useContext(CollectionContext);

  const { setToastState } = useToast();

  useEffect(() => {
    if (collections && cIndex !== -1) {
      setCurrentCollection(collections[cIndex]);
    }
  }, [collections, cIndex]);

  const mintBase = ({ imgURL, recipient }: { imgURL: string; recipient: string }) => {
    if (currentCollection) {
      setToastState({
        type: "loading",
        message: "Base NFT is being created...",
      });

      const tx = new Transaction();
      tx.moveCall({
        package: PACKAGE_ID,
        module: "collection",
        function: "mint_and_tranfer_base",
        arguments: [
          tx.object(currentCollection.id),
          tx.object(currentCollection.cap),
          tx.pure.string(imgURL),
          tx.pure.address(recipient),
        ],
      });

      signAndExecuteTransaction(
        {
          transaction: tx,
        },
        {
          onSuccess: (data) => {
            console.log("Success! data:", data);
            setToastState({
              type: "success",
              message: "Creating base NFT succeeded.",
            });
          },
          onError: (err) => {
            console.log("Error", err);
            setToastState({
              type: "error",
              message: "Something went wrong while creating the base NFT. Please try again.",
            });
          },
        }
      );
    }
  };

  return {
    mintBase,
  };
}
