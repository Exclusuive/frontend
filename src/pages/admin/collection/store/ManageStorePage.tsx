import { Button } from "@/components/ui/button";
import SelectCollectionModal from "../SelectCollectionModal";
import { useContext, useEffect, useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CollectionContext } from "@/context/CollectionContext";
import { useCurrentAccount } from "@mysten/dapp-kit";
import SelectStoreModal from "./SelectStoreModal";
import { StoreData } from "@/types/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {}

export default function ManageStorePage({}: Props) {
  const [isCOpen, setIsCOpen] = useState(false);
  const [isSOpen, setIsSOpen] = useState(false);
  const [currentStore, setCurrentStore] = useState<StoreData>();

  const account = useCurrentAccount();

  const {
    collection: { index: cIndex },
    store: { stores, index: sIndex },
  } = useContext(CollectionContext);

  useEffect(() => {
    if (stores) {
      setCurrentStore(stores[sIndex]);
    }
  }, [stores, sIndex]);

  useEffect(() => {
    if (cIndex === -1) {
      setIsCOpen(true);
    }
  }, [cIndex]);

  useEffect(() => {
    if (!isCOpen && cIndex !== -1 && sIndex === -1) {
      setIsSOpen(true);
    }
  }, [isCOpen]);

  if (!account) {
    return <div className="flex items-center justify-center p-8">Please Connect Wallet</div>;
  }

  return (
    <div className="container w-full space-y-6 p-4">
      <h1 className="text-2xl font-bold">Manage Collection Store</h1>
      <Dialog open={isCOpen} onOpenChange={setIsCOpen}>
        <DialogTrigger>
          <Button>Select Collection</Button>
        </DialogTrigger>
        <SelectCollectionModal />
      </Dialog>
      {cIndex !== -1 && (
        <Dialog open={isSOpen} onOpenChange={setIsSOpen}>
          <DialogTrigger>
            <Button>Select Store</Button>
          </DialogTrigger>
          <SelectStoreModal />
        </Dialog>
      )}

      {currentStore && (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">
                {currentStore.objectData.content.fields.name} slots
              </h2>
              <p className="text-muted-foreground truncate text-sm">ID: {currentStore.id}</p>
            </div>
            <div className="flex gap-2">
              {/* <Button onClick={() => setShowStoreContractDialog(true)}> */}
              <Button onClick={() => {}}>Change Store Contract</Button>
              <Button>Add New Slot</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {currentStore.objectData.content.fields.slots.map((slot) => (
              <Card key={slot.fields.number} className="overflow-auto">
                <CardHeader>
                  <CardTitle>Slot {slot.fields.number}</CardTitle>
                  <CardDescription>
                    Product Type : {slot.fields.product.fields.name.split("::")[2]}&lt;type&gt;
                  </CardDescription>
                  <CardDescription>Price: {slot.fields.price} MIST</CardDescription>
                  <CardDescription>
                    <p>Requirement</p>
                    {slot.fields.conditions.map((condition, idx) => (
                      <li key={idx}>
                        <span className="font-medium">
                          {condition.fields.requirement} {condition.fields.ticket_type.fields.type}
                        </span>
                      </li>
                    ))}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {currentStore.dynamicFieldData
                    .filter(
                      (data) => data.content.fields.name.fields.slot_number === slot.fields.number
                    )
                    .map((data) => (
                      <div>
                        {!("type" in data.content.fields.value) && (
                          <div>
                            <div className="py-2">
                              <span>Remaing: </span>
                              <span className="font-semibold">
                                {data.content.fields.value[0].type.split("::")[2]}{" "}
                                {data.content.fields.value.length}{" "}
                              </span>
                            </div>
                            <div className="grid grid-cols-2">
                              {data.content.fields.value.map((v) => {
                                const typeName = v.type.split("::")[2];

                                return Object.values(v.fields).map((val: any) => {
                                  return Object.entries(val)
                                    .filter(([k, _]) => k === "fields")
                                    .map(([k, v]: [k: string, v: any]) => {
                                      if (typeName === "Base") {
                                        return (
                                          <Card>
                                            <CardContent>
                                              {k}: {JSON.stringify(v)}
                                            </CardContent>
                                          </Card>
                                        );
                                      } else if (typeName === "Item") {
                                        return (
                                          <Card>
                                            <CardContent>
                                              {k}: {JSON.stringify(v)}
                                            </CardContent>
                                          </Card>
                                        );
                                      } else if (typeName === "Ticket") {
                                        return (
                                          <Card className="p-2">
                                            <CardContent>
                                              {k}: {v.type}
                                            </CardContent>
                                          </Card>
                                        );
                                      } else if (typeName === "PropertyScroll") {
                                        return (
                                          <Card className="p-2">
                                            <CardContent>
                                              <div>
                                                {k}: {v.type.fields.type}
                                              </div>
                                              <div>value: {v.value}</div>
                                            </CardContent>
                                          </Card>
                                        );
                                      }

                                      return (
                                        <Card>
                                          <CardContent>
                                            {k}
                                            {JSON.stringify(v)}
                                          </CardContent>
                                        </Card>
                                      );
                                    });
                                });
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </CardContent>

                <Button variant="outline" className="w-full">
                  Add Condition
                </Button>
                <Button variant="outline" className="w-full">
                  Add Product
                </Button>

                {/* {manage ? (
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
                            tickets || {},
                            slot.fields.price
                          )
                        }
                      >
                        Buy
                      </Button>
                    </div>
                  </CardFooter>
                )} */}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
