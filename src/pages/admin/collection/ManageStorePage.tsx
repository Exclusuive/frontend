import { useContext, useEffect, useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CollectionContext } from "@/context/CollectionContext";
import { SelectCollectionModal } from "@/page-components/admin/collection";
import { SelectStoreModal, Store } from "@/page-components/admin/collection/store";

interface Props {}

export default function ManageStorePage({}: Props) {
  const [isCOpen, setIsCOpen] = useState(false);
  const [isSOpen, setIsSOpen] = useState(false);

  const account = useCurrentAccount();
  const {
    collection: { index: cIndex },
    store: { index: sIndex },
  } = useContext(CollectionContext);

  useEffect(() => {
    if (cIndex === -1) {
      setIsCOpen(true);
    }
  }, [cIndex]);

  useEffect(() => {
    if (sIndex === -1 && cIndex !== -1) {
      setIsSOpen(true);
    }
  }, [isCOpen]);

  if (!account) {
    return <div className="flex items-center justify-center p-8">Please Connect Wallet</div>;
  }

  return (
    <div className="container w-full space-y-6 p-4">
      <h1 className="text-2xl font-bold">Manage Store</h1>
      <Dialog open={isCOpen} onOpenChange={setIsCOpen}>
        <DialogTrigger asChild>
          <Button>Select Collection</Button>
        </DialogTrigger>
        <SelectCollectionModal />
      </Dialog>
      {cIndex !== -1 && (
        <Dialog open={isSOpen} onOpenChange={setIsSOpen}>
          <SelectStoreModal />
        </Dialog>
      )}

      <Dialog open={isSOpen} onOpenChange={setIsSOpen}>
        <Store />
      </Dialog>
    </div>
  );
}
