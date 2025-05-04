import { Button } from "@/components/ui/button";
import SelectCollectionModal from "../SelectCollectionModal";
import { useContext, useEffect, useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CollectionContext } from "@/context/CollectionContext";
// import { CollectionData } from "@/types/collection";
import { useCurrentAccount } from "@mysten/dapp-kit";
import SelectStoreModal from "./SelectStoreModal";

interface Props {}

export default function ManageStorePage({}: Props) {
  const [isCOpen, setIsCOpen] = useState(false);
  const [isSOpen, setIsSOpen] = useState(false);
  // const [currentCollection, setCurrentCollection] = useState<CollectionData>();

  const account = useCurrentAccount();

  const {
    // collection: { collections, index: cIndex },
    collection: { index: cIndex },
    store: { index: sIndex },
  } = useContext(CollectionContext);

  // useEffect(() => {
  //   if (collections) {
  //     setCurrentCollection(collections[cIndex]);
  //   }
  // }, [collections, cIndex]);

  useEffect(() => {
    if (cIndex === -1) {
      setIsCOpen(true);
    }
  }, [cIndex]);

  useEffect(() => {
    if (!isCOpen && cIndex !== -1 && sIndex === -1) {
      setIsSOpen(true);
    }
  }, [isCOpen]);

  if (!account) {
    return <div className="flex items-center justify-center p-8">Please Connect Wallet</div>;
  }

  return (
    <div className="container w-full space-y-6 p-4">
      <h1 className="text-2xl font-bold">Manage Collection Store</h1>
      <Dialog open={isCOpen} onOpenChange={setIsCOpen}>
        <DialogTrigger>
          <Button>Select Collection</Button>
        </DialogTrigger>
        <SelectCollectionModal />
      </Dialog>
      {cIndex !== -1 && (
        <Dialog open={isSOpen} onOpenChange={setIsSOpen}>
          <DialogTrigger>
            <Button>Select Store</Button>
          </DialogTrigger>
          <SelectStoreModal />
        </Dialog>
      )}
    </div>
  );
}
