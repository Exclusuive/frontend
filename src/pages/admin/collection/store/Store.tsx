import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import AddNewSlotModal from "./AddNewSlotModal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StoreData } from "@/types/store";
import AddProductModal from "./AddProductModal";

export default function Store({ store }: { store: StoreData }) {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{store.objectData.content.fields.name} Store</h2>
          <p className="text-muted-foreground truncate text-sm">ID: {store.id}</p>
          <p className="text-muted-foreground truncate text-sm">
            Collection ID: {store.objectData.content.fields.collection_id}
          </p>
          <p className="text-muted-foreground truncate text-sm">
            Balance: {store.objectData.content.fields.balance} MIST
          </p>
        </div>
        <div className="flex gap-2">
          <DialogTrigger>
            <Button>Select Store</Button>
          </DialogTrigger>
          <Dialog>
            <DialogTrigger>
              <Button>Add New Slot</Button>
            </DialogTrigger>
            <AddNewSlotModal></AddNewSlotModal>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {store.objectData.content.fields.slots.map((slot) => (
          <Card key={slot.fields.number} className="overflow-auto">
            <CardHeader>
              <CardTitle>Slot {slot.fields.number}</CardTitle>
              <CardDescription>
                Product Type : {slot.fields.product.fields.name.split("::")[2]}
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
              {store.dynamicFieldData
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
                            const product = v.fields;

                            if (typeName === "Base") {
                              return (
                                <Card className="cursor-default">
                                  <CardContent>
                                    <p className="truncate">{product.id.id}</p>
                                    <p>{product.type.fields.type}</p>
                                    <img className="h-5 w-5" src={product.img_url} />
                                  </CardContent>
                                </Card>
                              );
                            } else if (typeName === "Item") {
                              return (
                                <Card className="cursor-default">
                                  <CardContent>
                                    <p className="truncate">{product.id.id}</p>
                                    <p>Layer: {product.type.fields.type}</p>
                                    <p>{product.item_type}</p>
                                    <img className="h-5 w-5" src={product.img_url} />
                                  </CardContent>
                                </Card>
                              );
                            } else if (typeName === "Ticket") {
                              return (
                                <Card className="cursor-default">
                                  <CardContent>
                                    <p className="truncate">{product.id.id}</p>
                                    <p>{product.type.fields.type}</p>
                                  </CardContent>
                                </Card>
                              );
                            } else if (typeName === "PropertyScroll") {
                              return (
                                <Card className="cursor-default">
                                  <CardContent>
                                    <p className="truncate">{product.id.id}</p>
                                    <p>{product.property.fields.type.fields.type}</p>
                                    <p>Value: {product.property.fields.value}</p>
                                  </CardContent>
                                </Card>
                              );
                            }
                            return (
                              <Card className="cursor-default">
                                <CardContent>
                                  <p>{typeName}</p>
                                  <p>{JSON.stringify(product)}</p>
                                </CardContent>
                              </Card>
                            );
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
            <Dialog>
              <DialogTrigger>
                <Button variant="outline" className="w-full">
                  Add Product
                </Button>
              </DialogTrigger>
              <AddProductModal></AddProductModal>
            </Dialog>

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
  );
}
