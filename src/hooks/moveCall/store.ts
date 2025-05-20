import { ORIGIN_PACKAGE_ID, UPGRADED_PACKAGE_ID } from "@/config/contants";
import { CollectionContext } from "@/context/CollectionContext";
import { CollectionData } from "@/types/collection";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useContext, useEffect, useState } from "react";
import { StoreData } from "@/types/store";
import { uploadToS3 } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

export function useCreateStore() {
  const [currentCollection, setCurrentCollection] = useState<CollectionData>();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const {
    collection: { collections, index: cIndex },
  } = useContext(CollectionContext);

  useEffect(() => {
    if (collections && cIndex !== -1) {
      setCurrentCollection(collections[cIndex]);
    }
  }, [collections, cIndex]);

  const createStore = ({ storeName }: { storeName: string }) => {
    if (currentCollection) {
      toast.dismiss();
      toast.loading("Loading...");

      const tx = new Transaction();
      tx.moveCall({
        package: UPGRADED_PACKAGE_ID,
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
    }
  };

  return {
    createStore,
  };
}

export function useAddSlot() {
  const [currentCollection, setCurrentCollection] = useState<CollectionData>();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const [currentStore, setCurrentStore] = useState<StoreData>();
  const [filterdStores, setFilteredStores] = useState<StoreData[]>();
  const {
    collection: { collections, index: cIndex },
    store: { stores, index: sIndex, refetch },
  } = useContext(CollectionContext);

  useEffect(() => {
    if (stores && collections && collections.length > 0 && cIndex !== -1) {
      setFilteredStores(
        stores.filter(
          (store) => store.objectData.content.fields.collection_id === collections[cIndex].id
        )
      );
    }
  }, [stores, cIndex]);

  useEffect(() => {
    if (filterdStores) {
      setCurrentStore(filterdStores[sIndex]);
    }
  }, [filterdStores, sIndex]);

  useEffect(() => {
    if (collections && cIndex !== -1) {
      setCurrentCollection(collections[cIndex]);
    }
  }, [collections, cIndex]);

  const addSlotToStore = ({ productType, price }: { productType: string; price: number }) => {
    if (currentCollection && currentStore) {
      toast.dismiss();
      toast.loading("Loading...");

      const tx = new Transaction();
      tx.moveCall({
        package: UPGRADED_PACKAGE_ID,
        module: "collection",
        function: "add_slot_to_store",
        typeArguments: [`${ORIGIN_PACKAGE_ID}::collection::${productType}`],
        arguments: [
          tx.object(currentCollection.id),
          tx.object(currentStore.id),
          tx.object(currentStore.cap),
          tx.pure.u64(price),
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
            refetch();
          },
          onError: (err) => {
            toast.dismiss();
            toast.error(`Success! Error: ${err}`);
          },
        }
      );
    }
  };

  return {
    addSlotToStore,
  };
}

export function useAddProductToSlot() {
  const [currentCollection, setCurrentCollection] = useState<CollectionData>();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const [currentStore, setCurrentStore] = useState<StoreData>();
  const [filterdStores, setFilteredStores] = useState<StoreData[]>();
  const {
    collection: { collections, index: cIndex },
    store: { stores, index: sIndex, refetch },
  } = useContext(CollectionContext);

  useEffect(() => {
    if (stores && collections && collections.length > 0 && cIndex !== -1) {
      setFilteredStores(
        stores.filter(
          (store) => store.objectData.content.fields.collection_id === collections[cIndex].id
        )
      );
    }
  }, [stores, cIndex]);

  useEffect(() => {
    if (filterdStores) {
      setCurrentStore(filterdStores[sIndex]);
    }
  }, [filterdStores, sIndex]);

  useEffect(() => {
    if (collections && cIndex !== -1) {
      setCurrentCollection(collections[cIndex]);
    }
  }, [collections, cIndex]);

  const addBaseToSlot = ({ slotNumber, count }: { slotNumber: number; count: number }) => {
    if (currentCollection && currentStore) {
      toast.dismiss();
      toast.loading("Loading...");

      const tx = new Transaction();
      const baseId = uuidv4();

      // Upload image to S3
      uploadToS3({
        type: "bases",
        id: baseId,
        file: new File(["White"], "WhiteBackground.png", { type: "image/png" }),
      }).then(({ fileUrl }) => {
        for (let i = 0; i < count; i++) {
          const [product] = tx.moveCall({
            package: UPGRADED_PACKAGE_ID,
            module: "collection",
            function: "new_base",
            arguments: [
              tx.object(currentCollection.id),
              tx.object(currentCollection.cap),
              tx.pure.string(fileUrl),
            ],
          });

          tx.moveCall({
            package: UPGRADED_PACKAGE_ID,
            module: "collection",
            function: "add_product_to_store",
            typeArguments: [`${ORIGIN_PACKAGE_ID}::collection::Base`],
            arguments: [
              tx.object(currentCollection.id),
              tx.object(currentStore.id),
              tx.object(currentStore.cap),
              tx.pure.u64(slotNumber),
              tx.object(product),
            ],
          });
        }
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
      });
    }
  };

  const addItemToSlot = ({
    slotNumber,
    layerType,
    itemType,
    count,
  }: {
    slotNumber: number;
    layerType: string;
    itemType: string;
    count: number;
  }) => {
    if (currentCollection && currentStore) {
      toast.dismiss();
      toast.loading("Loading...");

      const tx = new Transaction();

      for (let i = 0; i < count; i++) {
        const [product] = tx.moveCall({
          package: UPGRADED_PACKAGE_ID,
          module: "collection",
          function: "new_item",
          arguments: [
            tx.object(currentCollection.id),
            tx.object(currentCollection.cap),
            tx.pure.string(layerType),
            tx.pure.string(itemType),
          ],
        });

        tx.moveCall({
          package: UPGRADED_PACKAGE_ID,
          module: "collection",
          function: "add_product_to_store",
          typeArguments: [`${ORIGIN_PACKAGE_ID}::collection::Item`],
          arguments: [
            tx.object(currentCollection.id),
            tx.object(currentStore.id),
            tx.object(currentStore.cap),
            tx.pure.u64(slotNumber),
            tx.object(product),
          ],
        });
      }

      signAndExecuteTransaction(
        {
          transaction: tx.serialize(),
        },
        {
          onSuccess: (data) => {
            toast.dismiss();
            toast.success(`Success! digset: ${data.digest}`);
            refetch();
          },
          onError: (err) => {
            toast.dismiss();
            toast.error(`Success! Error: ${err}`);
          },
        }
      );
    }
  };

  const addTicketToSlot = ({
    slotNumber,
    ticketType,
  }: {
    slotNumber: number;
    ticketType: string;
  }) => {
    if (currentCollection && currentStore) {
      toast.dismiss();
      toast.loading("Loading...");

      const tx = new Transaction();

      const [product] = tx.moveCall({
        package: UPGRADED_PACKAGE_ID,
        module: "collection",
        function: "new_ticket",
        arguments: [
          tx.object(currentCollection.id),
          tx.object(currentCollection.cap),
          tx.pure.string(ticketType),
        ],
      });

      tx.moveCall({
        package: UPGRADED_PACKAGE_ID,
        module: "collection",
        function: "add_product_to_store",
        typeArguments: [`${ORIGIN_PACKAGE_ID}::collection::Ticket`],
        arguments: [
          tx.object(currentCollection.id),
          tx.object(currentStore.id),
          tx.object(currentStore.cap),
          tx.pure.u64(slotNumber),
          tx.object(product),
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
    }
  };

  const addPropertyScrollToSlot = ({
    slotNumber,
    propertyType,
    propertyValue,
  }: {
    slotNumber: number;
    propertyType: string;
    propertyValue: number;
  }) => {
    if (currentCollection && currentStore) {
      toast.dismiss();
      toast.loading("Loading...");

      const tx = new Transaction();

      const [product] = tx.moveCall({
        package: UPGRADED_PACKAGE_ID,
        module: "collection",
        function: "new_property_scroll",
        arguments: [
          tx.object(currentCollection.id),
          tx.object(currentCollection.cap),
          tx.pure.string(propertyType),
          tx.pure.u64(propertyValue),
        ],
      });

      tx.moveCall({
        package: UPGRADED_PACKAGE_ID,
        module: "collection",
        function: "add_product_to_store",
        typeArguments: [`${ORIGIN_PACKAGE_ID}::collection::PropertyScroll`],
        arguments: [
          tx.object(currentCollection.id),
          tx.object(currentStore.id),
          tx.object(currentStore.cap),
          tx.pure.u64(slotNumber),
          tx.object(product),
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
    }
  };
  return {
    addBaseToSlot,
    addItemToSlot,
    addTicketToSlot,
    addPropertyScrollToSlot,
  };
}

export function useAddConditionToSlot() {
  const [currentCollection, setCurrentCollection] = useState<CollectionData>();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const [currentStore, setCurrentStore] = useState<StoreData>();
  const [filterdStores, setFilteredStores] = useState<StoreData[]>();
  const {
    collection: { collections, index: cIndex },
    store: { stores, index: sIndex, refetch },
  } = useContext(CollectionContext);

  useEffect(() => {
    if (stores && collections && collections.length > 0 && cIndex !== -1) {
      setFilteredStores(
        stores.filter(
          (store) => store.objectData.content.fields.collection_id === collections[cIndex].id
        )
      );
    }
  }, [stores, cIndex]);

  useEffect(() => {
    if (filterdStores) {
      setCurrentStore(filterdStores[sIndex]);
    }
  }, [filterdStores, sIndex]);

  useEffect(() => {
    if (collections && cIndex !== -1) {
      setCurrentCollection(collections[cIndex]);
    }
  }, [collections, cIndex]);

  const addConditionToSlot = ({
    slotNumber,
    ticketType,
    requirement,
  }: {
    slotNumber: number;
    ticketType: string;
    requirement: number;
  }) => {
    if (currentCollection && currentStore) {
      toast.dismiss();
      toast.loading("Loading...");

      const tx = new Transaction();

      tx.moveCall({
        package: UPGRADED_PACKAGE_ID,
        module: "collection",
        function: "add_condition_to_slot",
        arguments: [
          tx.object(currentCollection.id),
          tx.object(currentStore.id),
          tx.object(currentStore.cap),
          tx.pure.u64(slotNumber),
          tx.pure.string(ticketType),
          tx.pure.u64(requirement),
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
    }
  };

  return {
    addConditionToSlot,
  };
}

export function useBuyProduct() {
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const account = useCurrentAccount();

  const buyProduct = ({
    collectionId,
    storeId,
    slotNumber,
  }: {
    collectionId: string;
    storeId: string;
    slotNumber: number;
  }) => {
    toast.dismiss();
    toast.loading("Loading...");

    const tx = new Transaction();

    const [request] = tx.moveCall({
      package: UPGRADED_PACKAGE_ID,
      module: "collection",
      function: "new_request",
      arguments: [tx.object(collectionId), tx.object(storeId), tx.pure.u64(slotNumber)],
    });

    const [product] = tx.moveCall({
      package: UPGRADED_PACKAGE_ID,
      module: "collection",
      function: "confirm_request",
      typeArguments: [`${ORIGIN_PACKAGE_ID}::collection::Item`],
      arguments: [tx.object(collectionId), tx.object(storeId), tx.object(request)],
    });
    tx.transferObjects([tx.object(product)], tx.pure.address(account?.address || ""));
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
    buyProduct,
  };
}
