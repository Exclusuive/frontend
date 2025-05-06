import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogClose,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CollectionContext } from "@/context/CollectionContext";
import { StoreData } from "@/types/store";
import { useContext, useEffect, useState } from "react";
import AddItemModal from "./AddItemModal";
import AddPropertyScrollModal from "./AddPropertyScrollModal";
import AddTicketModal from "./AddTicketModal";
import AddBaseModal from "./AddBaseModal";

export default function AddProductToSlotModal() {
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
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Add Product to Slot</DialogTitle>
        <DialogDescription>Select a slot to add product.</DialogDescription>
      </DialogHeader>
      {currentStore && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {currentStore.objectData.content.fields.slots.map((slot, i) => (
            <Dialog>
              <DialogTrigger>
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
                            {condition.fields.requirement}{" "}
                            {condition.fields.ticket_type.fields.type}
                          </span>
                        </li>
                      ))}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </DialogTrigger>
              <DialogContent>
                {slot.fields.product.fields.name.split("::")[2] === "Base" ? (
                  <AddBaseModal slotNumber={Number(slot.fields.number)} />
                ) : slot.fields.product.fields.name.split("::")[2] === "Item" ? (
                  <AddItemModal slotNumber={Number(slot.fields.number)} />
                ) : slot.fields.product.fields.name.split("::")[2] === "PropertyScroll" ? (
                  <AddPropertyScrollModal slotNumber={Number(slot.fields.number)} />
                ) : (
                  <AddTicketModal slotNumber={Number(slot.fields.number)} />
                )}
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}
    </DialogContent>
  );
}
