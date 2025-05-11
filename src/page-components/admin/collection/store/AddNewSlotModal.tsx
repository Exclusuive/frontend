import { Button } from "@/components/ui/button";
import {
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddSlot } from "@/hooks/moveCall/store";
import { useState } from "react";

export default function AddNewSlotModal() {
  const [productType, setProductType] = useState("");
  const [price, setPrice] = useState(0);

  const { addSlotToStore } = useAddSlot();

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New Slot</DialogTitle>
        <DialogDescription>Enter the price for the new slot.</DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="type" className="text-right">
            Type
          </Label>
          <Select
            value={productType}
            onValueChange={(value) => {
              setProductType(value);
            }}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Base">Base</SelectItem>
              <SelectItem value="Item">Item</SelectItem>
              <SelectItem value="PropertyScroll">PropertyScroll</SelectItem>
              <SelectItem value="Ticket">Ticket</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="price" className="text-right">
            Price (MIST)
          </Label>
          <Input
            id="price"
            type="text"
            value={price}
            onChange={(e) => {
              setPrice(Number(e.target.value));
            }}
            className="col-span-3"
          />
        </div>
      </div>

      <DialogFooter>
        <DialogClose>
          <Button
            onClick={() => {
              if (
                productType === "Base" ||
                productType === "Item" ||
                productType === "PropertyScroll" ||
                productType === "Ticket"
              ) {
                addSlotToStore({ productType, price });
                setPrice(0);
                setProductType("");
              }
            }}
          >
            Add Slot
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
