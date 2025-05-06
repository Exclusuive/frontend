import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

export default function AddPropertyScrollModal({ slotNumber }: { slotNumber: number }) {
  const [propertyType, setPropertyType] = useState("Select Property Type");
  const [propertyValue, setPropertyValue] = useState(0);

  const [currentCollection, setCurrentCollection] = useState<CollectionData>();

  const { addPropertyScrollToSlot } = useAddProductToSlot();

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
        <DialogTitle>Add PropertyScroll to Slot {slotNumber}</DialogTitle>
        {/* <DialogDescription>Select a product and quantity.</DialogDescription> */}
      </DialogHeader>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="quantity" className="text-right">
          Property Type
        </Label>
        <Select
          value={propertyType}
          defaultValue={"Select Property Type"}
          onValueChange={(value) => {
            setPropertyType(value);
          }}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue>{propertyType}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {currentCollection &&
              currentCollection.objectData.content.fields.property_types.fields.contents.map(
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
        <Label htmlFor="propertyValue" className="text-right">
          Value
        </Label>
        <Input
          id="propertyValue"
          type="number"
          value={propertyValue}
          onChange={(e) => {
            setPropertyValue(Number(e.target.value));
          }}
          className="col-span-3"
        />
      </div>
      <Button
        onClick={() => {
          addPropertyScrollToSlot({ slotNumber, propertyType, propertyValue });
          setPropertyType("Select Property Type");
          setPropertyValue(0);
        }}
      >
        Add PropertyScroll to Slot
      </Button>
    </DialogContent>
  );
}
