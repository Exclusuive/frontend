import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { CollectionContext } from "@/context/CollectionContext";
import { useAddConditionToSlot } from "@/hooks/moveCall/store";
import { CollectionData } from "@/types/collection";
import { useContext, useEffect, useState } from "react";

export default function AddConditionModal({ slotNumber }: { slotNumber: number }) {
  const [ticketType, setTicketType] = useState("Select Ticket Type");
  const [requirement, setRequirement] = useState(0);
  const [currentCollection, setCurrentCollection] = useState<CollectionData>();

  const { addConditionToSlot } = useAddConditionToSlot();

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
        <DialogTitle>
          {/* Add Condition to Selection {slot.fields.number} */}
          Add Condition to Selection 0
        </DialogTitle>
        <DialogDescription>Enter the details for the new condition.</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="ticketType" className="text-right">
            Ticket Type
          </Label>
          <Select value={ticketType} onValueChange={setTicketType}>
            <SelectTrigger className="col-span-3">
              <SelectValue>{ticketType}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {currentCollection &&
                currentCollection.objectData.content.fields.ticket_types.fields.contents.map(
                  (t) => (
                    <SelectItem key={t.fields.type} value={t.fields.type}>
                      {t.fields.type}
                    </SelectItem>
                  )
                )}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="requirements" className="text-right">
            Requirements
          </Label>
          <Input
            id="requirements"
            value={requirement}
            onChange={(e) => {
              setRequirement(Number(e.target.value));
            }}
            className="col-span-3"
          />
        </div>
      </div>
      <DialogFooter>
        {/* <Button onClick={() => handleAddConditionToSelection(slot.fields.number)}> */}
        <DialogClose>
          <Button
            onClick={() => {
              addConditionToSlot({ slotNumber, ticketType, requirement });
            }}
          >
            Add Condition
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
