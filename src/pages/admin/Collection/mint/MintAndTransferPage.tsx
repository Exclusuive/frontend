import { Button } from "@/components/ui/button";
import SelectCollectionModal from "../SelectCollectionModal";
import { useContext, useEffect, useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CollectionContext } from "@/context/CollectionContext";
import { CollectionData } from "@/types/collection";

interface Props {}

export default function MintAndTransferPage({}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentCollection, setCurrentCollection] = useState<CollectionData>();

  const {
    collection: { collections, index },
  } = useContext(CollectionContext);

  useEffect(() => {
    console.log("finally", collections);
    console.log("finally index", index);
    if (collections) {
      setCurrentCollection(collections[index]);
    }
  }, [collections, index]);

  return (
    <div className="container w-full space-y-6 p-4">
      <h1 className="text-2xl font-bold">Mint & Tranfer</h1>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>
          <Button>Select Collection</Button>
        </DialogTrigger>
        <SelectCollectionModal />
      </Dialog>
    </div>
  );
}
