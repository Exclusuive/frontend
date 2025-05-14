import { ORIGIN_PACKAGE_ID, UPGRADED_PACKAGE_ID } from "@/config/contants";
import { CollectionContext } from "@/context/CollectionContext";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useContext } from "react";
import { useToast } from "../UI/useToast";

export function useCreateCollection() {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const {
    collection: { refetch },
  } = useContext(CollectionContext);
  const { setToastState } = useToast();

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
    setToastState({
      type: "loading",
      message: "Collection is being created...",
    });

    const tx = new Transaction();
    const [col, cap] = tx.moveCall({
      package: UPGRADED_PACKAGE_ID,
      module: "collection",
      function: "new",
      arguments: [tx.pure.string(collectionName)],
    });

    layers.forEach((layer) => {
      tx.moveCall({
        package: UPGRADED_PACKAGE_ID,
        module: "collection",
        function: "add_layer_type",
        arguments: [tx.object(col), tx.object(cap), tx.pure.string(layer)],
      });
    });

    tx.moveCall({
      package: UPGRADED_PACKAGE_ID,
      module: "collection",
      function: "add_config_to_type",
      typeArguments: [`${ORIGIN_PACKAGE_ID}::collection::BaseType`],
      arguments: [
        tx.object(col),
        tx.object(cap),
        tx.pure.string(collectionName),
        tx.pure.string("img_url"),
        tx.pure.string(bannerImgURL),
      ],
    });

    tx.moveCall({
      package: UPGRADED_PACKAGE_ID,
      module: "collection",
      function: "add_config_to_type",
      typeArguments: [`${ORIGIN_PACKAGE_ID}::collection::BaseType`],
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
      typeArguments: [`${ORIGIN_PACKAGE_ID}::collection::Collection`],
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
          setToastState({
            type: "success",
            message: "Creating collection succeeded.",
          });
          setTimeout(() => {
            refetch();
            console.log("refetch");
          }, 1000);
        },
        onError: (err) => {
          console.log("Error", err);
          setToastState({
            type: "error",
            message: "Something went wrong while creating the collection. Please try again.",
          });
        },
      }
    );
  };
  return {
    createCollection,
  };
}

export function useUpdateCollection() {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const {
    collection: { collections, index, refetch },
  } = useContext(CollectionContext);
  const { setToastState } = useToast();

  const updateCollectionInfo = ({
    bannerImgURL,
    description,
  }: {
    bannerImgURL: string;
    description: string;
  }) => {
    if (!account) return;

    if (!collections) return;

    const currentCollection = collections[index];

    if (!currentCollection) return;

    const collectionName = currentCollection.objectData.content.fields.base_type.fields.type;

    setToastState({
      type: "loading",
      message: "Collection is being updated...",
    });

    const tx = new Transaction();

    tx.moveCall({
      package: UPGRADED_PACKAGE_ID,
      module: "collection",
      function: "update_config_to_type",
      typeArguments: [`${ORIGIN_PACKAGE_ID}::collection::BaseType`],
      arguments: [
        tx.object(currentCollection.id),
        tx.object(currentCollection.cap),
        tx.pure.string(collectionName),
        tx.pure.string("img_url"),
        tx.pure.string(bannerImgURL),
      ],
    });

    tx.moveCall({
      package: UPGRADED_PACKAGE_ID,
      module: "collection",
      function: "update_config_to_type",
      typeArguments: [`${ORIGIN_PACKAGE_ID}::collection::BaseType`],
      arguments: [
        tx.object(currentCollection.id),
        tx.object(currentCollection.cap),
        tx.pure.string(collectionName),
        tx.pure.string("description"),
        tx.pure.string(description),
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
            message: "Updating collection succeeded.",
          });
        },
        onError: (err) => {
          console.log("Error", err);
          setToastState({
            type: "error",
            message: "Something went wrong while updating the collection. Please try again.",
          });
        },
      }
    );
  };
  return {
    updateCollectionInfo,
  };
}

export function useAddLayerType() {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const {
    collection: { collections, index, refetch },
  } = useContext(CollectionContext);
  const { setToastState } = useToast();

  const addLayerType = ({ typeName }: { typeName: string }) => {
    if (!account) return;

    setToastState({
      type: "loading",
      message: "Layer type is being created...",
    });

    if (!collections) return;

    const currentCollection = collections[index];

    if (!currentCollection) return;

    const tx = new Transaction();

    tx.moveCall({
      package: UPGRADED_PACKAGE_ID,
      module: "collection",
      function: "add_layer_type",
      arguments: [
        tx.object(currentCollection.id),
        tx.object(currentCollection.cap),
        tx.pure.string(typeName),
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
            message: "Creating the layer type succeeded.",
          });
        },
        onError: (err) => {
          console.log("Error", err);
          setToastState({
            type: "error",
            message: "Something went wrong while creating the layer type. Please try again.",
          });
        },
      }
    );
  };
  return {
    addLayerType,
  };
}

export function useAddPropertyType() {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const {
    collection: { collections, index, refetch },
  } = useContext(CollectionContext);
  const { setToastState } = useToast();

  const addPropertyType = ({ typeName }: { typeName: string }) => {
    if (!account) return;

    setToastState({
      type: "loading",
      message: "Property type is being created...",
    });

    if (!collections) return;

    const currentCollection = collections[index];

    if (!currentCollection) return;

    const tx = new Transaction();

    tx.moveCall({
      package: UPGRADED_PACKAGE_ID,
      module: "collection",
      function: "add_property_type",
      arguments: [
        tx.object(currentCollection.id),
        tx.object(currentCollection.cap),
        tx.pure.string(typeName),
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
            message: "Creating the property type succeeded.",
          });
        },
        onError: (err) => {
          console.log("Error", err);
          setToastState({
            type: "error",
            message: "Something went wrong while creating the property type. Please try again.",
          });
        },
      }
    );
  };
  return {
    addPropertyType,
  };
}

export function useAddTicketType() {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const {
    collection: { collections, index, refetch },
  } = useContext(CollectionContext);
  const { setToastState } = useToast();

  const addTicketType = ({ typeName }: { typeName: string }) => {
    if (!account) return;

    setToastState({
      type: "loading",
      message: "Ticket type is being created...",
    });

    if (!collections) return;

    const currentCollection = collections[index];

    if (!currentCollection) return;

    const tx = new Transaction();

    tx.moveCall({
      package: UPGRADED_PACKAGE_ID,
      module: "collection",
      function: "add_ticket_type",
      arguments: [
        tx.object(currentCollection.id),
        tx.object(currentCollection.cap),
        tx.pure.string(typeName),
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
            message: "Creating the ticket type succeeded.",
          });
        },
        onError: (err) => {
          console.log("Error", err);
          setToastState({
            type: "error",
            message: "Something went wrong while creating the ticket type. Please try again.",
          });
        },
      }
    );
  };
  return {
    addTicketType,
  };
}
