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
import { CollectionItem } from "@/types/types";
import { MintItemData } from "@/types/contract";
import { ImagePlus } from "lucide-react";
type MintItemDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: "new" | "existing";
  layerTypes: string[];
  propertyTypes?: string[];
  existingItems?: CollectionItem[];
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
  const [layer, setLayer] = useState<string>("");
  const [itemName, setItemName] = useState<string>("");
  const [itemImage, setItemImage] = useState<File | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [recipient, setRecipient] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedItemImageUrl, setSelectedItemImageUrl] = useState<string>("");

  // Property type and value state
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>("");
  const [propertyValue, setPropertyValue] = useState<string>("");
  const [properties, setProperties] = useState<Array<{ type: string; value: string }>>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setItemImage(e.target.files[0]);
    }
  };

  const handleAddProperty = () => {
    if (selectedPropertyType && propertyValue) {
      setProperties([...properties, { type: selectedPropertyType, value: propertyValue }]);
      setSelectedPropertyType("");
      setPropertyValue("");
    }
  };

  const handleRemoveProperty = (index: number) => {
    const newProperties = [...properties];
    newProperties.splice(index, 1);
    setProperties(newProperties);
  };

  const handleMint = async () => {
    if (!layer || !recipient) {
      return;
    }

    if (mode === "new" && (!itemName || !itemImage)) {
      return;
    }

    if (mode === "existing" && !selectedItemId) {
      return;
    }

    setIsLoading(true);

    try {
      const mintData: MintItemData = {
        layer,
        recipient,
        properties:
          properties.length > 0
            ? properties.map((property) => ({
                type: property.type,
                value: parseInt(property.value, 10),
              }))
            : undefined,
      };

      if (mode === "new") {
        mintData.itemName = itemName;
        mintData.itemImage = itemImage!;
      } else {
        mintData.itemName = itemName;
        mintData.itemId = selectedItemId;
        mintData.itemImageUrl = selectedItemImageUrl;
      }

      await onMint(mintData);
      onClose();
    } catch (error) {
      console.error("Error minting item:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const filteredItems = existingItems.filter((item) => item.layer === layer);

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
            <Select value={layer} onValueChange={setLayer}>
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
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
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
                    {itemImage ? (
                      <div className="relative h-full w-full">
                        <img
                          src={URL.createObjectURL(itemImage)}
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
                value={selectedItemId}
                onValueChange={(value) => {
                  setSelectedItemId(value);
                  const selectedItem = filteredItems.find((item) => item.name === value);
                  if (selectedItem) {
                    setLayer(selectedItem.layer);
                    setItemName(selectedItem.name);
                    setSelectedItemImageUrl(selectedItem.img_url);
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
                <Select value={selectedPropertyType} onValueChange={setSelectedPropertyType}>
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
                    value={propertyValue}
                    onChange={(e) => setPropertyValue(e.target.value)}
                    className="flex-1"
                    placeholder="Enter property value"
                  />
                  <Button
                    type="button"
                    onClick={handleAddProperty}
                    disabled={!selectedPropertyType || !propertyValue}
                  >
                    Add
                  </Button>
                </div>
              </div>

              {/* Display added properties */}
              {properties.length > 0 && (
                <div className="col-span-4 space-y-2">
                  <Label className="block text-right">Added Properties</Label>
                  <div className="space-y-2">
                    {properties.map((property, index) => (
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
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="col-span-3"
              placeholder="Enter recipient address"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleMint} disabled={isLoading}>
            {isLoading ? "Minting..." : "Mint"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
