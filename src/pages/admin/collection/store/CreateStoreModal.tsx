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
import { DialogDescription } from "@radix-ui/react-dialog";
import { useState } from "react";

import { useCreateStore } from "@/hooks/moveCall/store";

export default function CreateStoreModal() {
  const [newStoreName, setNewStoreName] = useState("");

  const { createStore } = useCreateStore();

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
              createStore({ storeName: newStoreName });
              setNewStoreName("");
            }}
          >
            Create
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
