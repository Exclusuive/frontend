import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ItemType } from "@/types/types";
import { MintItemData } from "@/types/contract";
import { ImagePlus } from "lucide-react";

type MintItemDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: "new" | "existing";
  layerTypes: string[];
  propertyTypes?: string[];
  existingItems?: ItemType[];
  onMint: (data: MintItemData) => void;
};

export function MintItemDialog({
  isOpen,
  onClose,
  mode,
  layerTypes,
  propertyTypes = [],
  existingItems = [],
  onMint,
}: MintItemDialogProps) {
  const initialState = {
    layer: "",
    itemName: "",
    itemImage: null as File | null,
    selectedItemId: "",
    recipient: "",
    isLoading: false,
    selectedItemImageUrl: "",
    selectedPropertyType: "",
    propertyValue: "",
    properties: [] as Array<{ type: string; value: number }>,
  };

  const [state, setState] = useState(initialState);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setState((prev) => ({ ...prev, itemImage: files[0] }));
    }
  };

  const handleAddProperty = () => {
    const { selectedPropertyType, propertyValue, properties } = state;
    if (selectedPropertyType && propertyValue) {
      setState((prev) => ({
        ...prev,
        properties: [
          ...properties,
          { type: selectedPropertyType, value: parseInt(propertyValue, 10) },
        ],
        selectedPropertyType: "",
        propertyValue: "",
      }));
    }
  };

  const handleRemoveProperty = (index: number) => {
    setState((prev) => {
      const newProperties = [...prev.properties];
      newProperties.splice(index, 1);
      return { ...prev, properties: newProperties };
    });
  };

  const handleMint = async () => {
    const { layer, recipient, itemName, itemImage, selectedItemId, properties } = state;

    if (!layer || !recipient) {
      return;
    }

    if (mode === "new" && (!itemName || !itemImage)) {
      return;
    }

    if (mode === "existing" && !selectedItemId) {
      return;
    }
    console.log(properties);
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const mintData: MintItemData = {
        layer,
        recipient,
        properties: properties,
      };

      if (mode === "new") {
        mintData.itemName = itemName;
        mintData.itemImage = itemImage!;
      } else {
        mintData.itemName = itemName;
        mintData.itemId = selectedItemId;
        mintData.itemImageUrl = state.selectedItemImageUrl;
      }

      await onMint(mintData);
      onClose();
      setState(initialState); // Reset state after minting
    } catch (error) {
      console.error("Error minting item:", error);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const filteredItems = existingItems.filter((item) => item.layer === state.layer);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "new" ? "Create and Mint New Item" : "Mint Existing Item"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="layer" className="text-right">
              Layer
            </Label>
            <Select
              value={state.layer}
              onValueChange={(value) => setState((prev) => ({ ...prev, layer: value }))}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a layer" />
              </SelectTrigger>
              <SelectContent>
                {layerTypes.map((layerType) => (
                  <SelectItem key={layerType} value={layerType}>
                    {layerType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {mode === "new" ? (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="itemName" className="text-right">
                  Item Name
                </Label>
                <Input
                  id="itemName"
                  value={state.itemName}
                  onChange={(e) => setState((prev) => ({ ...prev, itemName: e.target.value }))}
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
                    {state.itemImage ? (
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
                    )}
                  </div>
                  <input
                    id="itemImage"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
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
                value={state.selectedItemId}
                onValueChange={(value) => {
                  setState((prev) => ({ ...prev, selectedItemId: value }));
                  const selectedItem = filteredItems.find((item) => item.name === value);
                  if (selectedItem) {
                    setState((prev) => ({
                      ...prev,
                      layer: selectedItem.layer,
                      itemName: selectedItem.name,
                      selectedItemImageUrl: selectedItem.img_url,
                    }));
                  }
                }}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select an item" />
                </SelectTrigger>
                <SelectContent>
                  {filteredItems.map((item) => (
                    <SelectItem key={item.name} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Property Type Selection and Value Input */}
          {propertyTypes.length > 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="propertyType" className="text-right">
                  Property Type
                </Label>
                <Select
                  value={state.selectedPropertyType}
                  onValueChange={(value) =>
                    setState((prev) => ({ ...prev, selectedPropertyType: value }))
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a property type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((propertyType) => (
                      <SelectItem key={propertyType} value={propertyType}>
                        {propertyType}
                      </SelectItem>
                    ))}
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
                    value={state.propertyValue}
                    onChange={(e) =>
                      setState((prev) => ({ ...prev, propertyValue: e.target.value }))
                    }
                    className="flex-1"
                    placeholder="Enter property value"
                  />
                  <Button
                    type="button"
                    onClick={handleAddProperty}
                    disabled={!state.selectedPropertyType || !state.propertyValue}
                  >
                    Add
                  </Button>
                </div>
              </div>

              {/* Display added properties */}
              {state.properties.length > 0 && (
                <div className="col-span-4 space-y-2">
                  <Label className="block text-right">Added Properties</Label>
                  <div className="space-y-2">
                    {state.properties.map((property, index) => (
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
                    ))}
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
              value={state.recipient}
              onChange={(e) => setState((prev) => ({ ...prev, recipient: e.target.value }))}
              className="col-span-3"
              placeholder="Enter recipient address"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onClose();
              setState(initialState);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleMint} disabled={state.isLoading}>
            {state.isLoading ? "Minting..." : "Mint"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
