import { useGetMyCollections } from "@/hooks/collection";
import { CollectionData } from "@/types/collection";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { createContext, useEffect, useState } from "react";

interface Value {
  collections: CollectionData[] | null;
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const CollectionContext = createContext<Value>({
  collections: [],
  index: 0,
  setIndex: () => {},
});

export const CollectionProvider = ({ children }: { children: React.ReactNode }) => {
  const [collectionsData, setCollectionsData] = useState<CollectionData[] | null>(null);
  const [index, setIndex] = useState<number>(0);

  const account = useCurrentAccount();
  const { collections } = useGetMyCollections({
    owner: account ? account.address : "",
  });

  useEffect(() => {
    setCollectionsData(collections);
  });

  return (
    <CollectionContext.Provider value={{ collections: collectionsData, index, setIndex }}>
      {children}
    </CollectionContext.Provider>
  );
};
