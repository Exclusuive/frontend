import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { ImagePlus } from "lucide-react";

export default function MintNewItem() {
  return (
    <Dialog>
      <DialogTrigger>
        <Card className="cursor-pointer transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle>Create New Item</CardTitle>
            <CardDescription>Create a new item and mint it to a recipient</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Create a brand new item with custom name and image, then mint it to a recipient.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Create & Mint New Item</Button>
          </CardFooter>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {/* {mode === "new" ? "Create and Mint New Item" : "Mint Existing Item"} */}
            {"Create and Mint New Item"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="layer" className="text-right">
              Layer
            </Label>
            <Select
              // value={state.layer}
              value={"state.layer"}
              // onValueChange={(value) => setState((prev) => ({ ...prev, layer: value }))}
              onValueChange={(value) => {}}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue>Select a layer</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {/* {layerTypes.map((layerType) => (
                  <SelectItem key={layerType} value={layerType}>
                    {layerType}
                  </SelectItem>
                ))} */}
              </SelectContent>
            </Select>
          </div>

          {/* {mode === "new" ? ( */}
          {"new" === "new" ? (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="itemName" className="text-right">
                  Item Name
                </Label>
                <Input
                  id="itemName"
                  // value={state.itemName}
                  value={"state.itemName"}
                  // onChange={(e) => setState((prev) => ({ ...prev, itemName: e.target.value }))}
                  onChange={(e) => {}}
                  className="col-span-3"
                  placeholder="Enter item name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="itemImage" className="text-right">
                  Item Image
                </Label>
                <div className="col-span-3 space-y-2">
                  <div
                    className="flex h-32 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 hover:border-gray-400"
                    onClick={() => document.getElementById("itemImage")?.click()}
                  >
                    {/* {state.itemImage ? (
                      <div className="relative h-full w-full">
                        <img
                          src={URL.createObjectURL(state.itemImage)}
                          alt="Selected item"
                          className="h-full w-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="text-center">
                        <ImagePlus className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                        <div className="mt-2">Click to upload image</div>
                      </div>
                    )} */}
                  </div>
                  <input
                    id="itemImage"
                    type="file"
                    accept="image/*"
                    // onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item" className="text-right">
                Item
              </Label>
              <Select
              // value={state.selectedItemId}
              // onValueChange={(value) => {
              //   setState((prev) => ({ ...prev, selectedItemId: value }));
              //   const selectedItem = filteredItems.find((item) => item.name === value);
              //   if (selectedItem) {
              //     setState((prev) => ({
              //       ...prev,
              //       layer: selectedItem.layer,
              //       itemName: selectedItem.name,
              //       selectedItemImageUrl: selectedItem.img_url,
              //     }));
              //   }
              // }}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select an item" />
                </SelectTrigger>
                <SelectContent>
                  {/* {filteredItems.map((item) => (
                    <SelectItem key={item.name} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))} */}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Property Type Selection and Value Input */}
          {/* {propertyTypes.length > 0 && ( */}
          {true && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="propertyType" className="text-right">
                  Property Type
                </Label>
                <Select
                // value={state.selectedPropertyType}
                // onValueChange={(value) =>
                //   setState((prev) => ({ ...prev, selectedPropertyType: value }))
                // }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a property type" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* {propertyTypes.map((propertyType) => (
                      <SelectItem key={propertyType} value={propertyType}>
                        {propertyType}
                      </SelectItem>
                    ))} */}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="propertyValue" className="text-right">
                  Property Value
                </Label>
                <div className="col-span-3 flex gap-2">
                  <Input
                    id="propertyValue"
                    // value={state.propertyValue}
                    // onChange={(e) =>
                    //   setState((prev) => ({ ...prev, propertyValue: e.target.value }))
                    // }
                    className="flex-1"
                    placeholder="Enter property value"
                  />
                  <Button
                    type="button"
                    // onClick={handleAddProperty}
                    // disabled={!state.selectedPropertyType || !state.propertyValue}
                  >
                    Add
                  </Button>
                </div>
              </div>

              {/* Display added properties */}
              {/* {state.properties.length > 0 && ( */}
              {true && (
                <div className="col-span-4 space-y-2">
                  <Label className="block text-right">Added Properties</Label>
                  <div className="space-y-2">
                    {/* {state.properties.map((property, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-md border p-2"
                      >
                        <div>
                          <span className="font-medium">{property.type}:</span> {property.value}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveProperty(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))} */}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="recipient" className="text-right">
              Recipient
            </Label>
            <Input
              id="recipient"
              // value={state.recipient}
              // onChange={(e) => setState((prev) => ({ ...prev, recipient: e.target.value }))}
              className="col-span-3"
              placeholder="Enter recipient address"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              // onClose();
              // setState(initialState);
            }}
          >
            Cancel
          </Button>
          {/* <Button onClick={handleMint} disabled={state.isLoading}> */}
          <Button>{/* {state.isLoading ? "Minting..." : "Mint"} */}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
