import { PACKAGE_ID } from "@/config/contants";
import { CollectionContext } from "@/context/CollectionContext";
// import { CollectionData } from "@/types/collection";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useContext } from "react";

export function useCreateCollection() {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const {
    collection: { refetch },
  } = useContext(CollectionContext);

  const createCollection = ({
    collectionName,
    bannerImgURL,
    description,
    layers,
  }: {
    collectionName: string;
    bannerImgURL: string;
    description: string;
    layers: string[];
  }) => {
    if (!account) return;

    const tx = new Transaction();
    const [col, cap] = tx.moveCall({
      package: PACKAGE_ID,
      module: "collection",
      function: "new",
      arguments: [tx.pure.string(collectionName)],
    });

    layers.forEach((layer) => {
      tx.moveCall({
        package: PACKAGE_ID,
        module: "collection",
        function: "add_layer_type",
        arguments: [tx.object(col), tx.object(cap), tx.pure.string(layer)],
      });
    });

    tx.moveCall({
      package: PACKAGE_ID,
      module: "collection",
      function: "add_config_to_type",
      typeArguments: [`${PACKAGE_ID}::collection::BaseType`],
      arguments: [
        tx.object(col),
        tx.object(cap),
        tx.pure.string(collectionName),
        tx.pure.string("img_url"),
        tx.pure.string(bannerImgURL),
      ],
    });

    tx.moveCall({
      package: PACKAGE_ID,
      module: "collection",
      function: "add_config_to_type",
      typeArguments: [`${PACKAGE_ID}::collection::BaseType`],
      arguments: [
        tx.object(col),
        tx.object(cap),
        tx.pure.string(collectionName),
        tx.pure.string("description"),
        tx.pure.string(description),
      ],
    });

    tx.moveCall({
      package: "0x2",
      module: "transfer",
      function: "public_share_object",
      typeArguments: [`${PACKAGE_ID}::collection::Collection`],
      arguments: [tx.object(col)],
    });

    tx.transferObjects([cap], tx.pure.address(account.address));

    signAndExecuteTransaction(
      {
        transaction: tx,
      },
      {
        onSuccess: (data) => {
          console.log("Success! data:", data);
          refetch();
        },
      }
    );
  };
  return {
    createCollection,
  };
}
