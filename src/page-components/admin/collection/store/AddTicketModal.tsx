import { Button } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

export default function AddTicketModal({ slotNumber }: { slotNumber: number }) {
  const [ticketType, setTicketType] = useState("Select Ticket Type");

  const [currentCollection, setCurrentCollection] = useState<CollectionData>();

  const { addTicketToSlot } = useAddProductToSlot();

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
        <DialogTitle>Add Ticket to Slot {slotNumber}</DialogTitle>
        {/* <DialogDescription>Select a product and quantity.</DialogDescription> */}
      </DialogHeader>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="quantity" className="text-right">
          Ticket Type
        </Label>
        <Select
          value={ticketType}
          defaultValue={"Select Property Type"}
          onValueChange={(value) => {
            setTicketType(value);
          }}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue>{ticketType}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {currentCollection &&
              currentCollection.objectData.content.fields.ticket_types.fields.contents.map(
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
      </div>
      <DialogClose>
        <Button
          onClick={() => {
            addTicketToSlot({ slotNumber, ticketType });
            setTicketType("Select Ticket Type");
          }}
        >
          Add Ticket to Slot
        </Button>
      </DialogClose>
    </DialogContent>
  );
}
