import { useGetMyCollections } from "@/hooks/collection";
import { CollectionData } from "@/types/collection";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { createContext, useEffect, useState } from "react";

export const CollectionContext = createContext<CollectionData[] | null>(null);

export const CollectionProvider = ({ children }: { children: React.ReactNode }) => {
  const account = useCurrentAccount();
  const { collections } = useGetMyCollections({
    owner: account ? account.address : "",
  });

  const [collectionsData, setCollectionsData] = useState<CollectionData[] | null>(null);

  useEffect(() => {
    setCollectionsData(collections);
  });

  return (
    <CollectionContext.Provider value={collectionsData}>{children}</CollectionContext.Provider>
  );
};
