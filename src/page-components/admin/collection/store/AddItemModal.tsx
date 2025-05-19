import { Button } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CollectionContext } from "@/context/CollectionContext";
import { useAddProductToSlot } from "@/hooks/moveCall/store";
import { CollectionData } from "@/types/collection";
import { useContext, useEffect, useState } from "react";

export default function AddItemModal({ slotNumber }: { slotNumber: number }) {
  const [layerType, setLayerType] = useState("Select Layer Type");
  const [itemType, setItemType] = useState("");
  const [count, setCount] = useState(0);

  const { addItemToSlot } = useAddProductToSlot();

  const [currentCollection, setCurrentCollection] = useState<CollectionData>();

  const {
    collection: { collections, index },
  } = useContext(CollectionContext);

  useEffect(() => {
    if (collections && index !== -1) {
      setCurrentCollection(collections[index]);
    }
  }, [collections, index]);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add Item to Slot {slotNumber}</DialogTitle>
        {/* <DialogDescription>Select a product and quantity.</DialogDescription> */}
      </DialogHeader>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="quantity" className="text-right">
          Layer Type
        </Label>
        <Select
          value={layerType}
          defaultValue={"Select Layer Type"}
          onValueChange={(value) => {
            setLayerType(value);
          }}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue>{layerType}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {currentCollection &&
              currentCollection.objectData.content.fields.layer_types.fields.contents.map(
                (data) => {
                  return (
                    <SelectItem key={data.fields.type} value={data.fields.type}>
                      {data.fields.type}
                    </SelectItem>
                  );
                }
              )}
          </SelectContent>
        </Select>
        <Label htmlFor="item" className="text-right">
          Item Type
        </Label>
        <Select value={itemType} onValueChange={(value) => setItemType(value)}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select an item" />
          </SelectTrigger>
          <SelectContent>
            {currentCollection &&
              currentCollection.objectData.content.fields.item_types.fields.contents
                .filter((item) => item.fields.type.fields.type === layerType)
                .map((item) => (
                  <SelectItem key={item.fields.item_type} value={item.fields.item_type}>
                    {item.fields.item_type}
                  </SelectItem>
                ))}
          </SelectContent>
        </Select>
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
            addItemToSlot({ slotNumber, layerType, itemType, count });
            setLayerType("Select Layer Type");
            setItemType("");
            setCount(0);
          }}
        >
          Add Item to Slot
        </Button>
      </DialogClose>
    </DialogContent>
  );
}
