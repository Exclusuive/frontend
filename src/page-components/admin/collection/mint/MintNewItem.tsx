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
  DialogClose,
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
import { CollectionContext } from "@/context/CollectionContext";
import { CollectionData } from "@/types/collection";
import { useContext, useEffect, useState } from "react";
import { ImagePlus } from "lucide-react";
import { useMint } from "@/hooks/moveCall/mint";

export default function MintNewItem() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentCollection, setCurrentCollection] = useState<CollectionData>();
  const [layer, setLayer] = useState<string>("");
  const [itemType, setItemType] = useState<string>("");
  const [isNewItem, setIsNewItem] = useState<boolean>(false);
  const [property, setProperty] = useState<string>("");
  const [propertyValue, setPropertyValue] = useState<number>(0);
  const [addedProperties, setAddedProperties] = useState<Record<string, number>>();
  const [recipient, setRecipient] = useState<string>("");
  const [imageFile, setImageFile] = useState<File>();

  const {
    collection: { collections, index, refetch },
  } = useContext(CollectionContext);

  const { mintNewItem, mintExistingItem } = useMint();

  useEffect(() => {
    if (collections && index !== -1) {
      setCurrentCollection(collections[index]);
    }
  }, [collections, index]);

  useEffect(() => {
    resetForm();
  }, [isOpen]);

  const resetForm = () => {
    setLayer("");
    setItemType("");
    setProperty("");
    setPropertyValue(0);
    setAddedProperties(undefined);
    setRecipient("");
    setImageFile(undefined);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
          <DialogTitle>{"Create and Mint New Item"}</DialogTitle>
        </DialogHeader>

        <div className="scrollbar-hide flex h-[500px] flex-col gap-4 overflow-scroll py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="layer" className="text-right">
              Layer
            </Label>
            <Select
              value={layer}
              onValueChange={(value) => {
                setLayer(value);
              }}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select an layer">{layer}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {currentCollection &&
                  currentCollection.objectData.content.fields.layer_types.fields.contents.map(
                    (layer) => (
                      <SelectItem key={layer.fields.type} value={layer.fields.type}>
                        {layer.fields.type}
                      </SelectItem>
                    )
                  )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-existed" className="text-right">
              New / Existed
            </Label>
            <div className="col-span-3 flex gap-2 space-y-2">
              <Button
                className={`${isNewItem ? "cursor-pointer" : ""}`}
                variant={isNewItem ? "secondary" : "default"}
                onClick={() => {
                  setIsNewItem(false);
                }}
              >
                Existed Item
              </Button>
              <Button
                className={`${!isNewItem ? "cursor-pointer" : ""}`}
                variant={!isNewItem ? "secondary" : "default"}
                onClick={() => {
                  setIsNewItem(true);
                  setItemType("");
                }}
              >
                New Item
              </Button>
            </div>
          </div>

          {isNewItem ? (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="itemType" className="text-right">
                  Item Type
                </Label>
                <Input
                  id="itemType"
                  value={itemType}
                  onChange={(e) => {
                    setItemType(e.target.value);
                  }}
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
                    {imageFile ? (
                      <div className="relative h-full w-full">
                        <img
                          src={URL.createObjectURL(imageFile)}
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
                  <Input
                    id="itemImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      if (file) {
                        setImageFile(file);
                      }
                    }}
                    className="hidden"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-4 items-center gap-4">
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
                      .filter((item) => item.fields.type.fields.type === layer)
                      .map((item) => (
                        <SelectItem key={item.fields.item_type} value={item.fields.item_type}>
                          {item.fields.item_type}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Property Type Selection and Value Input */}
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="propertyType" className="text-right">
                Property Type
              </Label>
              <Select value={property} onValueChange={(value) => setProperty(value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a property type">{property}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {currentCollection &&
                    currentCollection.objectData.content.fields.property_types.fields.contents.map(
                      (property) => (
                        <SelectItem key={property.fields.type} value={property.fields.type}>
                          {property.fields.type}
                        </SelectItem>
                      )
                    )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="propertyValue" className="text-right">
                Property Value
              </Label>
              <div className="col-span-3 flex gap-2">
                <Input
                  id={property + propertyValue}
                  value={propertyValue}
                  onChange={(e) => setPropertyValue(Number(e.target.value))}
                  className="flex-1"
                  placeholder="Input a property value"
                />
                <Button
                  className="cursor-pointer"
                  type="button"
                  onClick={() => {
                    if (!property) return;

                    setAddedProperties((prev) => ({ ...prev, [property]: propertyValue }));
                    setProperty("");
                    setPropertyValue(0);
                  }}
                  disabled={!propertyValue}
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Display added properties */}
            <div className="col-span-4 space-y-2">
              <Label className="block text-right">Added Properties</Label>
              <div className="space-y-2">
                {addedProperties &&
                  Object.keys(addedProperties).map((property, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-md border p-2"
                    >
                      <div>
                        <span className="font-medium">{property}:</span> {addedProperties[property]}
                      </div>
                      <Button
                        className="cursor-pointer"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          delete addedProperties[property];
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          </div>

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
          <DialogClose>
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
              }}
            >
              Cancel
            </Button>
          </DialogClose>
          <DialogClose>
            <Button
              className="cursor-pointer"
              onClick={() => {
                resetForm();
                if (!addedProperties) return;

                isNewItem
                  ? mintNewItem({
                      layer,
                      itemType,
                      imgURL: "",
                      properties: addedProperties,
                      recipient,
                    })
                  : mintExistingItem({
                      layer,
                      itemType,
                      properties: addedProperties,
                      recipient,
                    });
              }}
            >
              Mint
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
