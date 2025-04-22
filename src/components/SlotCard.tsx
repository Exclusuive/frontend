import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import AddProductDialog from "./AddProductDialog";
import { Store } from "@/types/types";
import { useState } from "react";
import { Input } from "./ui/input";
import { useSendTransactions } from "@/hooks/useSendTransactions";
import { useGetCollection } from "@/hooks/useGetCollection";
import { useGetStore } from "@/hooks/useGetStore";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useSearchParams } from "react-router-dom";
// Define the props interface
interface SlotCardProps {
  selectedStore: Store;
  manage: boolean;
  setShowStoreContractDialog: (show: boolean) => void; // Function to show/hide the store contract dialog
  tickets?: Record<string, string[]>;
}

// Define a type for selection data
type SelectionData = {
  selectionType: string;
  newSelectionPrice: number;
  newTicketType: string;
  newRequirements: string;
};

// Update the component to accept props
export default function SlotCard({
  selectedStore,
  setShowStoreContractDialog,
  manage,
  tickets,
}: SlotCardProps) {
  const [selectionData, setSelectionData] = useState<SelectionData>({
    selectionType: "Item",
    newSelectionPrice: 0,
    newTicketType: "",
    newRequirements: "",
  });

  const account = useCurrentAccount();
  const [searchParams] = useSearchParams();
  const collectionId = searchParams.get("collection_id");

  const { store: store } = useGetStore(selectedStore.store_id);

  const { collection: collection } = useGetCollection(selectedStore.collection_id);

  const { addSlot, addCondition, buyProduct } = useSendTransactions();

  const handleSelectionTypeChange = (value: string) => {
    setSelectionData((prev) => ({ ...prev, selectionType: value }));
  };

  const handleSelectionPriceChange = (value: number) => {
    setSelectionData((prev) => ({ ...prev, newSelectionPrice: value }));
  };

  const handleTicketTypeChange = (value: string) => {
    setSelectionData((prev) => ({ ...prev, newTicketType: value }));
  };

  const handleRequirementsChange = (value: string) => {
    setSelectionData((prev) => ({ ...prev, newRequirements: value }));
  };

  const handleAddSelection = async (storeId: string) => {
    await addSlot({
      id: selectedStore.collection_id || "",
      storeId: storeId,
      price: selectionData.newSelectionPrice,
      storeCapId: selectedStore?.store_cap_id || "",
      selectionType: selectionData.selectionType,
    });
    setSelectionData((prev) => ({ ...prev, newSelectionPrice: 0 }));
  };

  const handleAddConditionToSelection = async (selectionId: number) => {
    if (!selectionData.newTicketType || !selectionData.newRequirements) {
      return;
    }

    try {
      await addCondition({
        id: selectedStore.collection_id || "",
        storeId: selectedStore?.store_id || "",
        storeCapId: selectedStore?.store_cap_id || "",
        ticketType: selectionData.newTicketType,
        requirements: Number(selectionData.newRequirements),
        selectionNumber: selectionId,
      });

      setSelectionData((prev) => ({ ...prev, newTicketType: "", newRequirements: "" }));
    } catch (error) {
      console.error("Failed to add condition:", error);
    }
  };

  const handleBuyProduct = async (
    selectionNumber: number,
    selectionType: string,
    conditions: any,
    tickets: Record<string, string[]>
  ) => {
    if (!conditions) {
      await buyProduct({
        id: collectionId || "",
        storeId: selectedStore?.store_id || "",
        selectionNumber: selectionNumber,
        selectionType: selectionType,
        toAddress: account?.address || "",
      });
      return;
    } else {
      if (!tickets) {
        window.alert("No tickets found");
        return;
      } else {
        await buyProduct({
          id: collectionId || "",
          storeId: selectedStore?.store_id || "",
          selectionNumber: selectionNumber,
          selectionType: selectionType,
          toAddress: account?.address || "",
          conditions: conditions,
          tickets: tickets,
        });
      }
    }
  };

  if (!selectedStore) {
    <div className="py-8 text-center">
      <p>No store contract selected. Please select a store contract to continue.</p>
      <Button className="mt-4" onClick={() => setShowStoreContractDialog(true)}>
        Select Store Contract
      </Button>
    </div>;
  }

  return (
    <>
      {selectedStore && (
        // Selections Section
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">{selectedStore.name} slots</h2>
              <p className="text-muted-foreground text-sm">
                ID: {selectedStore.store_id.slice(0, 8)}...
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowStoreContractDialog(true)}>
                Change Store Contract
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Add New Slot</Button>
                </DialogTrigger>
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
                      <Select
                        value={selectionData.selectionType}
                        onValueChange={handleSelectionTypeChange}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Item">Item</SelectItem>
                          <SelectItem value="Property">Property</SelectItem>
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
                        value={selectionData.newSelectionPrice}
                        onChange={(e) => handleSelectionPriceChange(Number(e.target.value))}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={() => selectedStore && handleAddSelection(selectedStore.store_id)}
                    >
                      Add Selection
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {store?.slots?.map((slot) => (
              <Card key={slot.fields.number}>
                <CardHeader>
                  <CardTitle>Slot {slot.fields.number}</CardTitle>
                  <CardDescription>Price: {slot.fields.price} SUI</CardDescription>
                  <CardDescription>
                    <p>Requirement</p>
                    {slot.fields.conditions?.map((condition: any, idx: number) => (
                      <li key={idx}>
                        <span className="font-medium">
                          {condition.fields.ticket_type.fields.type} {condition.fields.requirement}{" "}
                          ticket
                        </span>
                      </li>
                    ))}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>SelectionType : {slot.fields.type}</p>

                  <div className="grid grid-cols-1 gap-4">
                    {slot.fields.products?.map((product: any, idx: number) => (
                      <Card key={idx} className="my-4 flex flex-col rounded-lg border p-4">
                        <CardHeader>
                          <div className="flex items-center gap-4">
                            {product.type === "Item" && (
                              <>
                                <div className="h-16 w-16 overflow-hidden rounded-md">
                                  <img
                                    src={product.img_url}
                                    alt={product.item_type}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <h3 className="font-medium">{product.item_type}</h3>
                                  <p className="text-sm text-gray-500">
                                    Remaining: {product.amount}
                                  </p>
                                </div>
                              </>
                            )}

                            {product.type === "Property" && (
                              <div className="flex flex-col">
                                <p className="font-medium">
                                  <strong>Property Type:</strong> {product.property_type}
                                </p>
                                <p className="text-sm text-gray-500">
                                  <strong>Value:</strong> {product.value}
                                </p>
                                <p className="text-sm text-gray-500">Remaining: {product.amount}</p>
                              </div>
                            )}

                            {product.type === "Ticket" && (
                              <div className="flex flex-col">
                                <p className="font-medium">
                                  <strong>Ticket Type:</strong> {product.ticket_type}
                                </p>
                                <p className="text-sm text-gray-500">Remaining: {product.amount}</p>
                              </div>
                            )}
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </CardContent>

                {manage ? (
                  <CardFooter className="flex flex-col gap-2">
                    <div className="flex w-full justify-between">
                      <AddProductDialog
                        collection={collection}
                        selectionNumber={slot.fields.number}
                        storeId={selectedStore.store_id}
                        selectionType={slot.fields.type}
                      />
                    </div>
                    <div className="flex w-full justify-between">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full">
                            Add Condition
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Add Condition to Selection {slot.fields.number}
                            </DialogTitle>
                            <DialogDescription>
                              Enter the details for the new condition.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="ticketType" className="text-right">
                                Ticket Type
                              </Label>
                              <Select
                                value={selectionData.newTicketType}
                                onValueChange={handleTicketTypeChange}
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Select ticket type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {collection?.ticket_types?.map((ticketType) => (
                                    <SelectItem key={ticketType} value={ticketType}>
                                      {ticketType}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="requirements" className="text-right">
                                Requirements
                              </Label>
                              <Input
                                id="requirements"
                                value={selectionData.newRequirements}
                                onChange={(e) => handleRequirementsChange(e.target.value)}
                                className="col-span-3"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              onClick={() => handleAddConditionToSelection(slot.fields.number)}
                            >
                              Add Condition
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardFooter>
                ) : (
                  <CardFooter className="flex flex-col gap-2">
                    <div className="flex w-full justify-between">
                      <Button
                        className="w-full"
                        onClick={() =>
                          handleBuyProduct(
                            slot.fields.number,
                            slot.fields.type,
                            slot.fields.conditions,
                            tickets || {}
                          )
                        }
                      >
                        Buy
                      </Button>
                    </div>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
