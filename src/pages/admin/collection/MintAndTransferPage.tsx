import { Button } from "@/components/ui/button";
import { SelectCollectionModal } from "@/page-components/admin/collection";
import { useContext, useEffect, useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { MintBase, MintItem } from "@/page-components/admin/collection/mint";
import { CollectionContext } from "@/context/CollectionContext";

interface Props {}

export default function MintAndTransferPage({}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    collection: { collections, index },
  } = useContext(CollectionContext);

  useEffect(() => {
    if (index === -1) {
      setIsOpen(true);
    }
  }, [collections, index]);

  return (
    <div className="w-full space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mint & Transfer</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">Select Collection</Button>
          </DialogTrigger>
          <SelectCollectionModal />
        </Dialog>
      </div>

      <div className="m-auto flex h-full w-full max-w-[1300px] place-content-center">
        <div className="bg-card w-full p-6">
          <MintBase />
        </div>
        <div className="bg-card w-full p-6">
          <MintItem />
        </div>
      </div>
    </div>
  );
}
