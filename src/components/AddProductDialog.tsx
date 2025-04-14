import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetCollection } from "@/hooks/useGetCollection";
import { CollectionItem } from "@/types/types";
import { Separator } from "@/components/ui/separator";
import { useSendTransactions } from "@/hooks/useSendTransactions";

interface AddProductDialogProps {
  selectionNumber: number;
  selectionId: string;
  supplierId: string;
  selectionType: string;
  trigger?: React.ReactNode;
}

export default function AddProductDialog({
  selectionNumber,
  selectionId,
  supplierId,
  selectionType,
  trigger,
}: AddProductDialogProps) {
  const [searchParams] = useSearchParams();
  const collectionId = searchParams.get("collection_id");
  const capId = searchParams.get("cap_id");
  const supplierCapId = searchParams.get("supplier_cap_id");
  const { collection, loading } = useGetCollection(collectionId || "", capId || "");
  const { addProduct } = useSendTransactions();

  const [selectedId, setSelectedId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [open, setOpen] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<CollectionItem | null>(null);
  const [propertyValue, setPropertyValue] = useState<string>("");

  // Group items by layer
  const itemsByLayer =
    collection?.items?.reduce(
      (acc, item) => {
        if (!acc[item.layer]) {
          acc[item.layer] = [];
        }
        acc[item.layer].push(item);
        return acc;
      },
      {} as Record<string, CollectionItem[]>
    ) || {};

  const handleAddProduct = async () => {
    if (!selectedId || !collectionId || !capId || !supplierCapId) {
      return;
    }

    try {
      let result;

      // Use the provided selectionType
      const productSelectionType = selectionType;

      if (productSelectionType === "Item" && selectedItem) {
        // For Item type, we need the layer and item details
        result = await addProduct({
          id: collectionId,
          capId: capId,
          supplierId: supplierId,
          supplierCapId: supplierCapId,
          selectionNumber: selectionNumber,
          productType: "Item",
          quantity: quantity,
          layer: selectedItem.layer,
          itemName: selectedItem.name,
          img_url: selectedItem.img_url, // We don't have the image file here, it would need to be passed from the parent
        });
      } else if (productSelectionType === "Property") {
        // For Property type, we need the property name and value
        if (!propertyValue) {
          return;
        }

        result = await addProduct({
          id: collectionId,
          capId: capId,
          supplierId: supplierId,
          supplierCapId: supplierCapId,
          selectionNumber: selectionNumber,
          productType: "Property",
          quantity: quantity,
          propertyName: selectedId,
          propertyValue: propertyValue,
        });
      } else if (productSelectionType === "Ticket") {
        // For Ticket type, we need the ticket name
        result = await addProduct({
          id: collectionId,
          capId: capId,
          supplierId: supplierId,
          supplierCapId: supplierCapId,
          selectionNumber: selectionNumber,
          productType: "Ticket",
          quantity: quantity,
          ticketName: selectedId,
        });
      }

      if (result?.success) {
        setOpen(false);
        setSelectedId("");
        setQuantity(1);
        setSelectedLayer("");
        setSelectedItem(null);
        setPropertyValue("");
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const getTypeOptions = () => {
    switch (selectionType) {
      case "Item":
        return collection?.items || [];
      case "Property":
        return (collection?.property_types || []).map((type, index) => ({
          id: `prop${index}`,
          name: type,
          description: `Property Type: ${type}`,
        }));
      case "Ticket":
        return (collection?.ticket_types || []).map((type, index) => ({
          id: `ticket${index}`,
          name: type,
          description: `Ticket Type: ${type}`,
        }));
      default:
        return [];
    }
  };

  const getOptionKey = (
    option: CollectionItem | { id: string; name: string; description: string }
  ) => {
    if ("id" in option) {
      return option.id;
    }
    return option.name;
  };

  const getOptionValue = (
    option: CollectionItem | { id: string; name: string; description: string }
  ) => {
    if ("id" in option) {
      return option.id;
    }
    return option.name;
  };

  const handleItemSelect = (item: CollectionItem) => {
    setSelectedItem(item);
    setSelectedId(item.name);
    setSelectedLayer(item.layer);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="w-full">
            Add Product
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Product to Selection {selectionNumber}</DialogTitle>
          <DialogDescription>Select a product and quantity.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="selectedType" className="text-right">
              {selectionType}
            </Label>
            {selectionType === "Item" ? (
              <div className="col-span-3 max-h-[300px] overflow-y-auto rounded-md border p-2">
                {Object.entries(itemsByLayer).map(([layer, items]) => (
                  <div key={layer} className="mb-4">
                    <h3 className="mb-2 font-medium">{layer}</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {items.map((item) => (
                        <div
                          key={item.name}
                          className={`cursor-pointer rounded-md p-2 hover:bg-gray-100 ${
                            selectedId === item.name ? "bg-blue-100" : ""
                          }`}
                          onClick={() => handleItemSelect(item)}
                        >
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 overflow-hidden rounded-md">
                              <img
                                src={item.img_url}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <span>{item.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-2" />
                  </div>
                ))}
              </div>
            ) : (
              <Select value={selectedId} onValueChange={setSelectedId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={`Select ${selectionType.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {getTypeOptions().map((option) => (
                    <SelectItem key={getOptionKey(option)} value={getOptionValue(option)}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {selectionType === "Property" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="propertyValue" className="text-right">
                Value
              </Label>
              <Input
                id="propertyValue"
                value={propertyValue}
                onChange={(e) => setPropertyValue(e.target.value)}
                placeholder="Enter property value"
                className="col-span-3"
              />
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleAddProduct}
            disabled={!selectedId || (selectionType === "Property" && !propertyValue)}
          >
            Add Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
