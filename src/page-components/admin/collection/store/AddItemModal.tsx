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
  const [imgURL, setImgURL] = useState("");

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
        <Label htmlFor="itemType" className="text-right">
          Item Type
        </Label>
        <Input
          id="itemType"
          type="string"
          value={itemType}
          onChange={(e) => {
            setItemType(e.target.value);
          }}
          className="col-span-3"
        />
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
      <DialogClose>
        <Button
          onClick={() => {
            addItemToSlot({ slotNumber, layerType, itemType, imgURL });
            setLayerType("Select Layer Type");
            setItemType("");
            setImgURL("");
          }}
        >
          Add Item to Slot
        </Button>
      </DialogClose>
    </DialogContent>
  );
}
