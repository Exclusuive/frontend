import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useContext, useEffect, useState } from "react";

import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID } from "@/config/contants";
import { CollectionContext } from "@/context/CollectionContext";
import { CollectionData } from "@/types/collection";

export default function CreateStoreModal() {
  const [newStoreName, setNewStoreName] = useState("");
  const [currentCollection, setCurrentCollection] = useState<CollectionData>();
  const {
    collection: { collections, index: cIndex },
    store: { refetch },
  } = useContext(CollectionContext);

  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  useEffect(() => {
    if (collections && cIndex !== -1) {
      setCurrentCollection(collections[cIndex]);
    }
  }, [collections, cIndex]);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create New Store Contract</DialogTitle>
        <DialogDescription>Enter the details for the new store contract.</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            value={newStoreName}
            onChange={(e) => setNewStoreName(e.target.value)}
            className="col-span-3"
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose>
          <Button
            onClick={() => {
              if (currentCollection) {
                const tx = new Transaction();
                tx.moveCall({
                  package: PACKAGE_ID,
                  module: "collection",
                  function: "create_store",
                  arguments: [
                    tx.object(currentCollection.id),
                    tx.object(currentCollection.cap),
                    tx.pure.string(newStoreName),
                  ],
                });
                signAndExecuteTransaction(
                  {
                    transaction: tx,
                  },
                  {
                    onSuccess: (data) => {
                      console.log("Success! data:", data);
                      refetch();
                    },
                  }
                );
                setNewStoreName("");
              }
            }}
          >
            Create
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
