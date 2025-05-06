import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAddProductToSlot } from "@/hooks/moveCall/store";
import { useState } from "react";

export default function AddBaseModal({ slotNumber }: { slotNumber: number }) {
  const [imgURL, setImgURL] = useState("");

  const { addBaseToSlot } = useAddProductToSlot();

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add Base to Slot {slotNumber}</DialogTitle>
        {/* <DialogDescription>Select a product and quantity.</DialogDescription> */}
      </DialogHeader>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="itemURL" className="text-right">
          Item URL
        </Label>
        <Input
          id="itemURL"
          type="string"
          value={imgURL}
          onChange={(e) => {
            setImgURL(e.target.value);
          }}
          className="col-span-3"
        />
      </div>
      <Button
        onClick={() => {
          addBaseToSlot({ slotNumber, imgURL });
          setImgURL("");
        }}
      >
        Add Base to Slot
      </Button>
    </DialogContent>
  );
}
