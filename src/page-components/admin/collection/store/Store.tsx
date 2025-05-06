import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CollectionContext } from "@/context/CollectionContext";
import { StoreData } from "@/types/store";
import AddNewSlotModal from "./AddNewSlotModal";
import AddConditionModal from "./AddConditionModal";
import AddProductToSlotModal from "./AddProductToSlotModal";

export default function Store() {
  const [currentStore, setCurrentStore] = useState<StoreData>();
  const [filterdStores, setFilteredStores] = useState<StoreData[]>();
  const {
    collection: { collections, index: cIndex },
    store: { stores, index: sIndex },
  } = useContext(CollectionContext);

  useEffect(() => {
    if (stores && collections && collections.length > 0 && cIndex !== -1) {
      setFilteredStores(
        stores.filter(
          (store) => store.objectData.content.fields.collection_id === collections[cIndex].id
        )
      );
    }
  }, [stores, cIndex]);

  useEffect(() => {
    if (filterdStores) {
      setCurrentStore(filterdStores[sIndex]);
    }
  }, [filterdStores, sIndex]);

  return (
    <div>
      {currentStore && (
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">
              {currentStore.objectData.content.fields.name} Store
            </h2>
            <p className="text-muted-foreground truncate text-sm">ID: {currentStore.id}</p>
            <p className="text-muted-foreground truncate text-sm">
              Collection ID: {currentStore.objectData.content.fields.collection_id}
            </p>
            <p className="text-muted-foreground truncate text-sm">
              Balance: {currentStore.objectData.content.fields.balance} MIST
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
            <Dialog>
              <DialogTrigger>
                <Button>Add Product to Slot</Button>
              </DialogTrigger>
              <AddProductToSlotModal />
              {/* <AddNewSlotModal></AddNewSlotModal> */}
            </Dialog>
          </div>
        </div>
      )}

      {currentStore && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {currentStore.objectData.content.fields.slots.map((slot) => (
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
                {currentStore.dynamicFieldData
                  .filter(
                    (data) => data.content.fields.name.fields.slot_number === slot.fields.number
                  )
                  .map((data, i) => (
                    <div>
                      {!("type" in data.content.fields.value) && (
                        <div>
                          <div className="py-2">
                            <span>Remaing: </span>
                            <span className="font-semibold">
                              {data.content.fields.value.length}{" "}
                            </span>
                          </div>
                          <div className="grid grid-cols-2">
                            {data.content.fields.value.slice(0, 4).map((v) => {
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

              <CardContent className="space-y-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      Add Condition
                    </Button>
                  </DialogTrigger>
                  <AddConditionModal></AddConditionModal>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
