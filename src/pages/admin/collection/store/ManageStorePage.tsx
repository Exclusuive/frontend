import { Button } from "@/components/ui/button";
import SelectCollectionModal from "../SelectCollectionModal";
import { useContext, useEffect, useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CollectionContext } from "@/context/CollectionContext";
import { useCurrentAccount } from "@mysten/dapp-kit";
import SelectStoreModal from "./SelectStoreModal";
import { StoreData } from "@/types/store";
import Store from "./Store";

interface Props {}

export default function ManageStorePage({}: Props) {
  const [isCOpen, setIsCOpen] = useState(false);
  const [isSOpen, setIsSOpen] = useState(false);
  const [currentStore, setCurrentStore] = useState<StoreData>();

  const account = useCurrentAccount();

  const {
    collection: { index: cIndex },
    store: { stores, index: sIndex },
  } = useContext(CollectionContext);

  useEffect(() => {
    if (stores) {
      setCurrentStore(stores[sIndex]);
    }
  }, [stores, sIndex]);

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
          <SelectStoreModal />
        </Dialog>
      )}

      {currentStore && (
        <Dialog open={isSOpen} onOpenChange={setIsSOpen}>
          <Store store={currentStore} />
        </Dialog>
      )}
    </div>
  );
}
