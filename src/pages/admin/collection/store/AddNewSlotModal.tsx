import { Button } from "@/components/ui/button";
import {
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
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

export default function AddNewSlotModal() {
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
          {/* <Select value={selectionData.selectionType} onValueChange={handleSelectionTypeChange}> */}
          <Select value={"selectino type"} onValueChange={() => {}}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Item">Item</SelectItem>
              <SelectItem value="PropertyScroll">PropertyScroll</SelectItem>
              <SelectItem value="Ticket">Ticket</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="price" className="text-right">
            Price (SUI)
          </Label>
          <Input
            id="price"
            type="number"
            // value={selectionData.newSelectionPrice}
            value={"new seledtion price"}
            // onChange={(e) => handleSelectionPriceChange(Number(e.target.value))}
            onChange={(e) => {}}
            className="col-span-3"
          />
        </div>
      </div>

      <DialogFooter>
        <Button
          // onClick={() => selectedStore && handleAddSelection(selectedStore.store_id)}
          onClick={() => {}}
        >
          Add Selection
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
