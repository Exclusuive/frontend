import { Button } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAddProductToSlot } from "@/hooks/moveCall/store";
import { useState } from "react";

export default function AddBaseModal({ slotNumber }: { slotNumber: number }) {
  const [count, setCount] = useState(0);

  const { addBaseToSlot } = useAddProductToSlot();

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add Base to Slot {slotNumber}</DialogTitle>
        {/* <DialogDescription>Select a product and quantity.</DialogDescription> */}
      </DialogHeader>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="itemURL" className="text-right">
          Count
        </Label>
        <Input
          id="itemURL"
          type="number"
          value={count}
          onChange={(e) => {
            setCount(Number(e.target.value));
          }}
          className="col-span-3"
        />
      </div>
      <DialogClose>
        <Button
          onClick={() => {
            addBaseToSlot({ slotNumber, count });
            setCount(0);
          }}
        >
          Add Base to Slot
        </Button>
      </DialogClose>
    </DialogContent>
  );
}
