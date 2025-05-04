import { Button } from "@/components/ui/button";
import SelectCollectionModal from "../SelectCollectionModal";
import { useContext, useEffect, useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CollectionContext } from "@/context/CollectionContext";
import { CollectionData } from "@/types/collection";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useGetMyCollectionStores } from "@/hooks/collection-store";
import SelectStoreModal from "./SelectStoreModal";

interface Props {}

export default function ManageStorePage({}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentCollection, setCurrentCollection] = useState<CollectionData>();

  const account = useCurrentAccount();
  const { stores, isPending, error } = useGetMyCollectionStores({
    owner: account ? account.address : "",
  });
  const {
    collection: { collections, index },
  } = useContext(CollectionContext);

  useEffect(() => {
    console.log("stores", stores);
  }, [stores]);

  useEffect(() => {
    console.log("finally", collections);
    console.log("finally index", index);
    if (collections) {
      setCurrentCollection(collections[index]);
    }
  }, [collections, index]);

  if (!account) {
    return <div className="flex items-center justify-center p-8">Please Connect Wallet</div>;
  }

  if (isPending) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">Error: {JSON.stringify(error)}</div>
    );
  }
  return (
    <div className="container w-full space-y-6 p-4">
      <h1 className="text-2xl font-bold">Manage Collection Store</h1>
      {/* <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>
          <Button>Select Collection</Button>
        </DialogTrigger>
        <SelectCollectionModal />
      </Dialog> */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>
          <Button>Select Store</Button>
        </DialogTrigger>
        <SelectStoreModal />
      </Dialog>
    </div>
  );
}
