import { UPGRADED_PACKAGE_ID } from "@/config/contants";
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
    collection: { collections, index: cIndex, refetch },
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
        package: UPGRADED_PACKAGE_ID,
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

  const mintNewItem = ({
    layer,
    itemType,
    imgURL,
    properties,
    recipient,
  }: {
    layer: string;
    itemType: string;
    imgURL: string;
    properties: Record<string, number>;
    recipient: string;
  }) => {
    if (currentCollection) {
      setToastState({
        type: "loading",
        message: "Item NFT is being created...",
      });

      const tx = new Transaction();
      tx.moveCall({
        package: UPGRADED_PACKAGE_ID,
        module: "collection",
        function: "add_item_type",
        arguments: [
          tx.object(currentCollection.id),
          tx.object(currentCollection.cap),
          tx.pure.string(layer),
          tx.pure.string(itemType),
          tx.pure.string(imgURL),
        ],
      });

      const [item] = tx.moveCall({
        package: UPGRADED_PACKAGE_ID,
        module: "collection",
        function: "new_item",
        arguments: [
          tx.object(currentCollection.id),
          tx.object(currentCollection.cap),
          tx.pure.string(layer),
          tx.pure.string(itemType),
        ],
      });

      const propertyScrolls = Object.entries(properties).map(([propertyType, value]) => {
        const [propertyScroll] = tx.moveCall({
          package: UPGRADED_PACKAGE_ID,
          module: "collection",
          function: "new_property_scroll",
          arguments: [
            tx.object(currentCollection.id),
            tx.object(currentCollection.cap),
            tx.pure.string(propertyType),
            tx.pure.u64(value),
          ],
        });

        return propertyScroll;
      });

      propertyScrolls.forEach((scroll) => {
        tx.moveCall({
          package: UPGRADED_PACKAGE_ID,
          module: "collection",
          function: "attach_property_to_item",
          arguments: [
            tx.object(currentCollection.id),
            // tx.object(currentCollection.cap),
            tx.object(item),
            tx.object(scroll),
          ],
        });
      });

      tx.transferObjects([item], recipient);

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
              message: "Creating item NFT succeeded.",
            });
          },
          onError: (err) => {
            console.log("Error", err);
            setToastState({
              type: "error",
              message: "Something went wrong while creating the item NFT. Please try again.",
            });
          },
        }
      );
    }
  };

  const mintExistingItem = ({
    layer,
    itemType,
    properties,
    recipient,
  }: {
    layer: string;
    itemType: string;
    properties: Record<string, number>;
    recipient: string;
  }) => {
    if (currentCollection) {
      setToastState({
        type: "loading",
        message: "Item NFT is being created...",
      });

      const tx = new Transaction();

      const [item] = tx.moveCall({
        package: UPGRADED_PACKAGE_ID,
        module: "collection",
        function: "new_item",
        arguments: [
          tx.object(currentCollection.id),
          tx.object(currentCollection.cap),
          tx.pure.string(layer),
          tx.pure.string(itemType),
        ],
      });

      const propertyScrolls = Object.entries(properties).map(([propertyType, value]) => {
        const [propertyScroll] = tx.moveCall({
          package: UPGRADED_PACKAGE_ID,
          module: "collection",
          function: "new_property_scroll",
          arguments: [
            tx.object(currentCollection.id),
            tx.object(currentCollection.cap),
            tx.pure.string(propertyType),
            tx.pure.u64(value),
          ],
        });

        return propertyScroll;
      });

      propertyScrolls.forEach((scroll) => {
        tx.moveCall({
          package: UPGRADED_PACKAGE_ID,
          module: "collection",
          function: "attach_property_to_item",
          arguments: [
            tx.object(currentCollection.id),
            // tx.object(currentCollection.cap),
            tx.object(item),
            tx.object(scroll),
          ],
        });
      });

      tx.transferObjects([item], recipient);

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
              message: "Creating item NFT succeeded.",
            });
          },
          onError: (err) => {
            console.log("Error", err);
            setToastState({
              type: "error",
              message: "Something went wrong while creating the item NFT. Please try again.",
            });
          },
        }
      );
    }
  };

  return {
    mintBase,
    mintNewItem,
    mintExistingItem,
  };
}
