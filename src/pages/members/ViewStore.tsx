import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CollectionContext } from "@/context/CollectionContext";
import { StoreData } from "@/types/store";
import {
  AddNewSlotModal,
  AddProductToSlotModal,
  AddConditionToSlotModal,
  SelectStoreModal,
} from "@/page-components/admin/collection/store";
import { useParams } from "react-router-dom";
import { useGetStoresByCollectionId } from "@/hooks/useGetData/store";
import clsx from "clsx";
export default function ViewStore() {
  const [currentStore, setCurrentStore] = useState<StoreData>();
  const { id } = useParams();

  const { stores, isPending, error, refetch } = useGetStoresByCollectionId({
    collectionId: id || "",
  });

  useEffect(() => {
    if (stores && stores.length > 0) {
      setCurrentStore(stores[0]);
    }
  }, [stores]);

  return (
    <div className="p-4">
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
            <Dialog>
              <DialogTrigger asChild>
                <Button>Select Store</Button>
              </DialogTrigger>
              <DialogContent className="max-h-[75vh] w-2/3 min-w-2/3 overflow-y-auto [&>button]:hidden">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Selet Store</DialogTitle>
                  <p className="text-muted-foreground text-md">Choose one of stores.</p>
                </DialogHeader>

                <div className="grid grid-cols-1 gap-4 overflow-y-auto pt-2 md:grid-cols-2 lg:grid-cols-3">
                  {stores &&
                    (stores.length === 0 ? (
                      <p>nothing</p>
                    ) : (
                      stores.map((store, i) => (
                        <DialogClose>
                          <Card
                            key={store.id}
                            onClick={() => {
                              setCurrentStore(store);
                            }}
                            className={clsx(
                              `${currentStore?.id === store.id ? "border-blue-400" : ""} cursor-pointer border-2 transition-all hover:border-4 hover:shadow-lg`
                            )}
                          >
                            <CardHeader>
                              <CardTitle className="text-lg">
                                {store.objectData.content.fields.name}
                              </CardTitle>
                              <p className="text-muted-foreground line-clamp-2 truncate text-sm">
                                ID: {store.objectData.content.fields.id.id}
                              </p>
                            </CardHeader>
                            <CardContent>
                              <p className="text-muted-foreground line-clamp-2 text-sm">
                                Slots: {store.objectData.content.fields.slots.length}
                              </p>
                            </CardContent>
                          </Card>
                        </DialogClose>
                      ))
                    ))}
                </div>
              </DialogContent>{" "}
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
                    <div key={i}>
                      {!("type" in data.content.fields.value) && (
                        <div>
                          <div className="py-2">
                            <span>Remaing: </span>
                            <span className="font-semibold">
                              {data.content.fields.value.length}{" "}
                            </span>
                          </div>
                          <div className="grid grid-cols-1">
                            {data.content.fields.value.slice(0, 1).map((v) => {
                              const typeName = v.type.split("::")[2];
                              const product = v.fields;

                              if (typeName === "Base") {
                                return (
                                  <Card className="cursor-default">
                                    <CardContent>
                                      <p className="truncate">{product.id.id}</p>
                                      <p>{product.type.fields.type}</p>
                                    </CardContent>
                                  </Card>
                                );
                              } else if (typeName === "Item") {
                                return (
                                  <Card className="cursor-default">
                                    <CardContent>
                                      <div className="flex items-center gap-2">
                                        <img className="h-20 w-20" src={product.img_url} />
                                        <div className="flex flex-col gap-2">
                                          <p>Layer: {product.type.fields.type}</p>
                                          <p>{product.item_type}</p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                );
                              } else if (typeName === "Ticket") {
                                return (
                                  <Card className="cursor-default">
                                    <CardContent>
                                      <p>{product.type.fields.type}</p>
                                    </CardContent>
                                  </Card>
                                );
                              } else if (typeName === "PropertyScroll") {
                                return (
                                  <Card className="cursor-default">
                                    <CardContent>
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
              <Button className="mx-5">Buy Product</Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
