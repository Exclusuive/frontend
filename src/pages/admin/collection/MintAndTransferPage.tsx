import { Button } from "@/components/ui/button";
import { SelectCollectionModal } from "@/page-components/admin/collection";
import { useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { MintBase, MintItem } from "@/page-components/admin/collection/mint";

interface Props {}

export default function MintAndTransferPage({}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="container w-full space-y-6 p-4">
      <h1 className="text-2xl font-bold">Mint & Tranfer</h1>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>Select Collection</Button>
        </DialogTrigger>
        <SelectCollectionModal />
      </Dialog>
      <MintBase />
      <MintItem />
    </div>
  );
}
