import { useGetMyCollections } from "@/hooks/collection";
import { useGetMyCollectionStores } from "@/hooks/store";
import { CollectionData } from "@/types/collection";
import { StoreData } from "@/types/store";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { createContext, useState } from "react";

interface Value {
  collection: {
    collections: CollectionData[] | null;
    index: number;
    setIndex: React.Dispatch<React.SetStateAction<number>>;
  };
  store: {
    stores: StoreData[] | null;
    index: number;
    setIndex: React.Dispatch<React.SetStateAction<number>>;
  };
}

export const CollectionContext = createContext<Value>({
  collection: {
    collections: [],
    index: 0,
    setIndex: () => {},
  },
  store: {
    stores: [],
    index: 0,
    setIndex: () => {},
  },
});

export const CollectionProvider = ({ children }: { children: React.ReactNode }) => {
  const [cIndex, setCIndex] = useState<number>(-1);
  const [SIndex, setSIndex] = useState<number>(-1);

  const account = useCurrentAccount();

  const { collections } = useGetMyCollections({
    owner: account ? account.address : "",
  });

  const { stores } = useGetMyCollectionStores({
    owner: account ? account.address : "",
  });

  return (
    <CollectionContext.Provider
      value={{
        collection: { collections, index: cIndex, setIndex: setCIndex },
        store: { stores, index: SIndex, setIndex: setSIndex },
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
};
