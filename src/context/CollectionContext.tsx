import { useGetMyCollections } from "@/hooks/useGetData/collection";
import { useGetMyCollectionStores } from "@/hooks/useGetData/store";
import { CollectionData } from "@/types/collection";
import { StoreData } from "@/types/store";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { createContext, useState } from "react";

interface Value {
  collection: {
    collections: CollectionData[] | null;
    index: number;
    isPending: boolean;
    error: any;
    setIndex: React.Dispatch<React.SetStateAction<number>>;
    refetch: () => void;
  };
  store: {
    stores: StoreData[] | null;
    index: number;
    isPending: boolean;
    error: any;
    setIndex: React.Dispatch<React.SetStateAction<number>>;
    refetch: () => void;
  };
}

export const CollectionContext = createContext<Value>({
  collection: {
    collections: null,
    index: 0,
    isPending: true,
    error: null,
    setIndex: () => {},
    refetch: () => {},
  },
  store: {
    stores: null,
    index: 0,
    isPending: true,
    error: null,
    setIndex: () => {},
    refetch: () => {},
  },
});

export const CollectionProvider = ({ children }: { children: React.ReactNode }) => {
  const [cIndex, setCIndex] = useState<number>(-1);
  const [SIndex, setSIndex] = useState<number>(-1);

  const account = useCurrentAccount();

  const {
    collections,
    refetch: refetchCollection,
    isPending: isPendingC,
    error: errorC,
  } = useGetMyCollections({
    owner: account ? account.address : "",
  });

  const {
    stores,
    refetch: refetchStore,
    isPending: isPendingS,
    error: errorS,
  } = useGetMyCollectionStores({
    owner: account ? account.address : "",
  });

  return (
    <CollectionContext.Provider
      value={{
        collection: {
          collections,
          index: cIndex,
          setIndex: setCIndex,
          refetch: refetchCollection,
          isPending: isPendingC,
          error: errorC,
        },
        store: {
          stores,
          index: SIndex,
          setIndex: setSIndex,
          refetch: refetchStore,
          isPending: isPendingS,
          error: errorS,
        },
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
};
