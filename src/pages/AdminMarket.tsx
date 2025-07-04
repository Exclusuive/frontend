import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useCollectionStore } from "@/stores/useCollectionStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import ItemsbyCategory from "@/components/ItemsbyCategory";
import { Item, Slot } from "@/types/collection";
import DisplayItem from "@/components/DisplayItem";
import AddCondition from "@/components/AddCondition";
import AddProduct, { ProductFormData } from "@/components/AddProduct";
import { EditConditionFormData } from "@/components/AddCondition";

const AdminMarket = () => {
  const { collection, setCollection } = useCollectionStore();

  if (!collection) {
    return (
      <div className="flex flex-col gap-4 p-10">
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <p className="mb-2 text-lg font-medium text-gray-600">No Collection Selected</p>
              <p className="text-sm text-gray-500">
                Please select a collection to view its items by layers.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const markets = (collection.market || []).map((market) => market.name);
  // Flatten all items from all slots in all markets into a 1D array
  const items = (collection.market || [])
    .flatMap((market) => market.slots)
    .flatMap((slot) => slot.items);

  const [open, setOpen] = useState(false);
  const [conditionOpen, setConditionOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<string>("");

  console.log(collection);

  const getSlotsByMarket = (_items: Item[], marketName: string) => {
    const market = (collection.market || []).find((m) => m.name === marketName);
    if (!market) return [];
    return market.slots;
  };

  const onAddCondition = (data: EditConditionFormData, slot: Slot) => {
    if (collection) {
      const updatedMarket =
        collection.market?.map((market) => ({
          ...market,
          slots: market.slots.map((s) => {
            if (s === slot) {
              const mergedConditions = data.conditions.map((newCondition) => {
                const existingCondition = s.conditions?.find(
                  (existing) => existing.name === newCondition.name,
                );
                return existingCondition
                  ? { ...existingCondition, value: newCondition.value }
                  : newCondition;
              });

              return { ...s, conditions: mergedConditions };
            }
            return s;
          }),
        })) || [];

      setCollection({
        ...collection,
        market: updatedMarket,
      });
    }
    setConditionOpen(false);
  };

  const onAddProduct = (data: ProductFormData, targetSlot: Slot | null) => {
    if (!collection) return;

    const updatedMarket = collection.market ? [...collection.market] : [];

    // Find the target market using selectedMarket instead of markets[0]
    const targetMarketIndex = updatedMarket.findIndex((market) => market.name === selectedMarket);

    if (targetMarketIndex === -1) {
      console.error("Target market not found");
      setProductOpen(false);
      return;
    }

    if (data.selectedItem && data.selectedLayer) {
      // Adding new product - create new slot
      const newSlot: Slot = {
        items: Array(parseInt(data?.itemAmount || "0")).fill({
          ...data.selectedItem,
        }),
        price: parseInt(data.suiAmount || "0"),
        conditions: data.conditions || [],
      };

      updatedMarket[targetMarketIndex] = {
        ...updatedMarket[targetMarketIndex],
        slots: [...updatedMarket[targetMarketIndex].slots, newSlot],
      };
    } else if (targetSlot) {
      // Adding to existing slot - increase quantity
      const additionalItems = Array(parseInt(data?.itemAmount || "0")).fill(targetSlot.items[0]);

      updatedMarket[targetMarketIndex] = {
        ...updatedMarket[targetMarketIndex],
        slots: updatedMarket[targetMarketIndex].slots.map((slot) =>
          slot === targetSlot ? { ...slot, items: [...slot.items, ...additionalItems] } : slot,
        ),
      };
    }

    setCollection({
      ...collection,
      market: updatedMarket,
    });

    setProductOpen(false);
    setOpen(false);
  };

  // Render items grid component
  const renderItemsGrid = (marketName: string, items: Item[]) => {
    setSelectedMarket(marketName);
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{marketName}</h3>
          <Badge variant="secondary"> {getSlotsByMarket(items, marketName).length} items</Badge>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {getSlotsByMarket(items, marketName).length > 0 &&
            getSlotsByMarket(items, marketName).map((slot: Slot, index: number) => (
              <div key={`${index}`} className="rounded-lg border p-4">
                <div className="mb-3 aspect-square">
                  <img
                    src={slot.items[0].imgUrl}
                    alt={slot.items[0].name}
                    className="h-full w-full rounded-md object-cover"
                  />
                </div>
                <h4 className="mb-1 flex items-center justify-between text-sm font-medium">
                  <div>
                    {slot.items[0].name}{" "}
                    <a
                      href={`https://suiscan.xyz/address/${slot.items[0].address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:text-blue-600"
                    >
                      view on Explorer
                    </a>
                  </div>
                  <span className="text-end text-xs text-gray-500">{slot.items.length} Left</span>
                </h4>
                <p className="mb-1 truncate text-xs text-gray-500">{slot.items[0].description}</p>
                <p className="my-2 flex flex-wrap gap-2 border-b pb-2">
                  {slot.items[0].attributes?.map((attribute) => (
                    <Badge key={attribute.name} variant="secondary">
                      {attribute.name}: {attribute.value}
                    </Badge>
                  ))}
                </p>

                {slot.price > 0 && (
                  <div>
                    <p>Price : {slot.price} SUI</p>
                  </div>
                )}

                {slot.conditions && slot.conditions.length > 0 && (
                  <div>
                    <p>Requirements : </p>

                    <div className="mt-2 flex flex-wrap items-center gap-x-2">
                      {slot.conditions?.map((condition) => (
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{condition.name}</Badge>
                          <span className="text-xs text-gray-500">: {condition.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 flex flex-col gap-2">
                  <Dialog open={conditionOpen} onOpenChange={setConditionOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Edit Condition
                      </Button>
                    </DialogTrigger>
                    <AddCondition
                      attributes={collection.tickets || []}
                      slot={slot}
                      onSubmit={(data) => onAddCondition(data, slot)}
                    />
                  </Dialog>
                  <Dialog
                    open={productOpen}
                    onOpenChange={(open) => {
                      setProductOpen(open);
                      if (!open) setSelectedSlot(null);
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => setSelectedSlot(slot)}
                      >
                        Add Product
                      </Button>
                    </DialogTrigger>
                    <AddProduct
                      items={collection.items || []}
                      layers={collection.layers || []}
                      isNew={slot.items.length === 0}
                      onSubmit={(data) => onAddProduct(data, selectedSlot)}
                    />
                  </Dialog>
                </div>
              </div>
            ))}

          {/* Add New Item Button */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <div className="flex min-h-[300px] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-blue-300 p-4 transition-colors hover:border-blue-400 hover:bg-blue-50">
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-blue-600 hover:text-blue-800">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-2xl font-light text-blue-500">
                    +
                  </div>
                  <span className="text-sm font-medium">Add New Item</span>
                </div>
              </div>
            </DialogTrigger>
            <DisplayItem
              items={collection.items || []}
              categories={collection.layers || []}
              attributes={collection.tickets || []}
              onSubmit={(data) => onAddProduct(data, null)}
            />
          </Dialog>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 p-10">
      <Card className="mx-auto w-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Market</CardTitle>
          <p className="text-sm text-gray-600">Collection: {collection.name}</p>
        </CardHeader>
        <ItemsbyCategory
          categories={markets}
          items={items}
          getItemsByCategory={getSlotsByMarket}
          renderItemsGrid={renderItemsGrid}
        />
      </Card>
    </div>
  );
};

export default AdminMarket;
