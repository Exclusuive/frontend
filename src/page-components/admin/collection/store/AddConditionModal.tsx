import { Button } from "@/components/ui/button";
import {
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

export default function AddConditionModal() {
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
          {/* <Select value={selectionData.newTicketType} onValueChange={handleTicketTypeChange}> */}
          <Select value={"new Ticket Type"} onValueChange={() => {}}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select ticket type" />
            </SelectTrigger>
            <SelectContent>
              {/* {collection?.ticket_types?.map((ticketType) => (
                <SelectItem key={ticketType} value={ticketType}>
                  {ticketType}
                </SelectItem>
              ))} */}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="requirements" className="text-right">
            Requirements
          </Label>
          <Input
            id="requirements"
            // value={selectionData.newRequirements}
            value={"new Requirmentes"}
            // onChange={(e) => handleRequirementsChange(e.target.value)}
            onChange={(e) => {}}
            className="col-span-3"
          />
        </div>
      </div>
      <DialogFooter>
        {/* <Button onClick={() => handleAddConditionToSelection(slot.fields.number)}> */}
        <Button onClick={() => {}}>Add Condition</Button>
      </DialogFooter>
    </DialogContent>
  );
}
