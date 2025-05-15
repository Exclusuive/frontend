import { ORIGIN_PACKAGE_ID, UPGRADED_PACKAGE_ID } from "@/config/contants";
import { CollectionContext } from "@/context/CollectionContext";
import { CollectionData } from "@/types/collection";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useContext, useEffect, useState } from "react";
import { useToast } from "../UI/useToast";
import { StoreData } from "@/types/store";
import { uploadToS3 } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

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

export function useAddSlot() {
  const [currentCollection, setCurrentCollection] = useState<CollectionData>();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const [currentStore, setCurrentStore] = useState<StoreData>();
  const [filterdStores, setFilteredStores] = useState<StoreData[]>();
  const {
    collection: { collections, index: cIndex },
    store: { stores, index: sIndex, refetch },
  } = useContext(CollectionContext);

  const { setToastState } = useToast();

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
      setToastState({
        type: "loading",
        message: "Slot is being created...",
      });

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
            console.log("Success! data:", data);
            refetch();
            setToastState({
              type: "success",
              message: "Creating slot succeeded.",
            });
          },
          onError: (err) => {
            console.log("Error", err);
            setToastState({
              type: "error",
              message: "Something went wrong while creating the slot. Please try again.",
            });
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

  const { setToastState } = useToast();

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
      setToastState({
        type: "loading",
        message: "Product is being created and added to slot...",
      });

      const tx = new Transaction();
      const baseId = uuidv4();

      // Upload image to S3
      uploadToS3({
        type: "bases",
        id: baseId,
        file: new File(["white"], "white.png", { type: "image/png" }),
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
            transaction: tx as any,
          },
          {
            onSuccess: (data) => {
              console.log("Success! data:", data);
              refetch();
              setToastState({
                type: "success",
                message: "Creating the product succeeded.",
              });
            },
            onError: (err) => {
              console.log("Error", err);
              setToastState({
                type: "error",
                message: "Something went wrong while creating the product. Please try again.",
              });
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
    imgURL,
  }: {
    slotNumber: number;
    layerType: string;
    itemType: string;
    imgURL: string;
  }) => {
    if (currentCollection && currentStore) {
      setToastState({
        type: "loading",
        message: "Product is being created and added to slot...",
      });

      const tx = new Transaction();

      const [product] = tx.moveCall({
        package: UPGRADED_PACKAGE_ID,
        module: "collection",
        function: "new_item",
        arguments: [
          tx.object(currentCollection.id),
          tx.object(currentCollection.cap),
          tx.pure.string(layerType),
          tx.pure.string(itemType),
          tx.pure.string(imgURL),
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

      signAndExecuteTransaction(
        {
          transaction: tx.serialize(),
        },
        {
          onSuccess: (data) => {
            console.log("Success! data:", data);
            refetch();
            setToastState({
              type: "success",
              message: "Creating the product succeeded.",
            });
          },
          onError: (err) => {
            console.log("Error", err);
            setToastState({
              type: "error",
              message: "Something went wrong while creating the product. Please try again.",
            });
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
      setToastState({
        type: "loading",
        message: "Product is being created and added to slot...",
      });

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
            console.log("Success! data:", data);
            refetch();
            setToastState({
              type: "success",
              message: "Creating the product succeeded.",
            });
          },
          onError: (err) => {
            console.log("Error", err);
            setToastState({
              type: "error",
              message: "Something went wrong while creating the product. Please try again.",
            });
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
      setToastState({
        type: "loading",
        message: "Product is being created and added to slot...",
      });

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
            console.log("Success! data:", data);
            refetch();
            setToastState({
              type: "success",
              message: "Creating the product succeeded.",
            });
          },
          onError: (err) => {
            console.log("Error", err);
            setToastState({
              type: "error",
              message: "Something went wrong while creating the product. Please try again.",
            });
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

  const { setToastState } = useToast();

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
      setToastState({
        type: "loading",
        message: "Condition is being created and added to slot...",
      });

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
            console.log("Success! data:", data);
            refetch();
            setToastState({
              type: "success",
              message: "Creating the condition succeeded.",
            });
          },
          onError: (err) => {
            console.log("Error", err);
            setToastState({
              type: "error",
              message: "Something went wrong while creating the condition. Please try again.",
            });
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
  const [currentCollection, setCurrentCollection] = useState<CollectionData>();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const [currentStore, setCurrentStore] = useState<StoreData>();
  const [filterdStores, setFilteredStores] = useState<StoreData[]>();
  const {
    collection: { collections, index: cIndex },
    store: { stores, index: sIndex, refetch },
  } = useContext(CollectionContext);

  const { setToastState } = useToast();

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

  const buyEventProduct = ({
    collectionId,
    storeId,
    slotNumber,
  }: {
    collectionId: string;
    storeId: string;
    slotNumber: number;
  }) => {
    if (currentCollection && currentStore) {
      setToastState({
        type: "loading",
        message: "Request is being created...",
      });

      const tx = new Transaction();

      const [request] = tx.moveCall({
        package: UPGRADED_PACKAGE_ID,
        module: "collection",
        function: "new_request",
        arguments: [tx.object(collectionId), tx.object(storeId), tx.pure.u64(slotNumber)],
      });

      tx.moveCall({
        package: UPGRADED_PACKAGE_ID,
        module: "collection",
        function: "confirm_request",
        arguments: [tx.object(collectionId), tx.object(storeId), tx.object(request)],
      });
      signAndExecuteTransaction(
        {
          transaction: tx.serialize(),
        },
        {
          onSuccess: (data) => {
            console.log("Success! data:", data);
            refetch();
            setToastState({
              type: "success",
              message: "Buying product succeeded.",
            });
          },
          onError: (err) => {
            console.log("Error", err);
            setToastState({
              type: "error",
              message: "Something went wrong while buying the product. Please try again.",
            });
          },
        }
      );
    }
  };

  return {
    buyEventProduct,
  };
}
