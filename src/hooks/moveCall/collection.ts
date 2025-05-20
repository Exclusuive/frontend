import { ORIGIN_PACKAGE_ID, UPGRADED_PACKAGE_ID } from "@/config/contants";
import { CollectionContext } from "@/context/CollectionContext";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useContext } from "react";
import { toast } from "sonner";

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
    toast.dismiss();
    toast.loading("Loading...");

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
        transaction: tx.serialize(),
      },
      {
        onSuccess: (data) => {
          toast.dismiss();
          toast.success(`Success! digset: ${data.digest}`);
          setTimeout(() => {
            refetch();
            console.log("refetch");
          }, 1000);
        },
        onError: (err) => {
          toast.dismiss();
          toast.error(`Success! Error: ${err}`);
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

  const updateCollectionInfo = ({ description }: { description: string }) => {
    if (!account) return;

    if (!collections) return;

    const currentCollection = collections[index];

    if (!currentCollection) return;

    const collectionName = currentCollection.objectData.content.fields.base_type.fields.type;

    toast.dismiss();
    toast.loading("Loading...");

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
        tx.pure.string("description"),
        tx.pure.string(description),
      ],
    });

    signAndExecuteTransaction(
      {
        transaction: tx.serialize(),
      },
      {
        onSuccess: (data) => {
          toast.dismiss();
          toast.loading("Loading...");
          refetch();
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
    updateCollectionInfo,
  };
}

export function useAddLayerType() {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const {
    collection: { collections, index, refetch },
  } = useContext(CollectionContext);

  const addLayerType = ({ typeName }: { typeName: string }) => {
    if (!account) return;

    toast.dismiss();
    toast.loading("Loading...");

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
        transaction: tx.serialize(),
      },
      {
        onSuccess: (data) => {
          refetch();
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
    addLayerType,
  };
}

export function useAddPropertyType() {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const {
    collection: { collections, index },
  } = useContext(CollectionContext);

  const addPropertyType = ({ typeName }: { typeName: string }) => {
    if (!account) return;

    toast.dismiss();
    toast.loading("Loading...");

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
    addPropertyType,
  };
}

export function useAddTicketType() {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const {
    collection: { collections, index, refetch },
  } = useContext(CollectionContext);

  const addTicketType = ({ typeName }: { typeName: string }) => {
    if (!account) return;

    toast.dismiss();
    toast.loading("Loading...");

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
        transaction: tx.serialize(),
      },
      {
        onSuccess: (data) => {
          refetch();
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
    addTicketType,
  };
}
