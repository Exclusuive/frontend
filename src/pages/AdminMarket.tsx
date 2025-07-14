import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useCollectionStore } from "@/stores/useCollectionStore";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import ItemsbyCategory from "@/components/ItemsbyCategory";
import { Item } from "@/types/collection";
import { Market, Listing } from "@/types/market";
import DisplayItem from "@/components/DisplayItem";
import AddCondition from "@/components/AddCondition";
import AddProduct, { ProductFormData } from "@/components/AddProduct";
import { formatItemAttributes } from "@/lib/items";
import { useGetMarketsByOwnerAdress, useAddListing } from "exclusuive-typescript-sdk";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMarketStore } from "@/stores/useMarketStore";
import { toast } from "sonner";

const AdminMarket = () => {
  const { collection } = useCollectionStore();
  const { user } = useAuthStore();
  const { markets } = useGetMarketsByOwnerAdress({ owner: user?.address });
  const { addListing, isPending, result, error } = useAddListing();
  const { market: selectedMarket, setMarket, updateMarket } = useMarketStore();
  // Market 선택 시 store에 저장하는 함수
  const handleMarketSelect = (marketName: string) => {
    const market = (markets || []).find((m: Market) => m.name === marketName);
    if (market) {
      setMarket(market);
    }
  };

  // 초기 market 설정
  useEffect(() => {
    if (markets && markets.length > 0 && !selectedMarket) {
      setMarket(markets[0]);
    }
  }, [markets, selectedMarket, setMarket]);

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

  const items = (markets || [])
    .flatMap((market: Market) => market.listings)
    .flatMap((listing: Listing) => listing?.items || []);

  const [open, setOpen] = useState(false);
  const [conditionOpen, setConditionOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);

  const getSlotsByMarket = (marketName: string) => {
    const market = (markets || []).find((m: Market) => m.name === marketName);
    if (!market) return [];
    return market.listings;
  };

  // const onAddCondition = (data: EditConditionFormData, slot: Slot) => {
  //   if (collection) {
  //     const updatedMarket =
  //       collection.markets?.map((market) => ({
  //         ...market,
  //         slots: market.slots?.map((s) => {
  //           if (s === slot) {
  //             const mergedConditions = data.conditions.map((newCondition) => {
  //               const existingCondition = s.conditions?.find(
  //                 (existing) => existing.name === newCondition.name,
  //               );
  //               return existingCondition
  //                 ? { ...existingCondition, value: newCondition.value }
  //                 : newCondition;
  //             });

  //             return { ...s, conditions: mergedConditions };
  //           }
  //           return s;
  //         }),
  //       })) || [];

  //     setCollection({
  //       ...collection,
  //       markets: updatedMarket,
  //     });
  //   }
  //   setConditionOpen(false);
  // };

  const onAddProduct = (data: ProductFormData, targetListing: Listing | null) => {
    if (!collection) return;

    if (targetListing) {
      // const updated_listing = {
      //   ...targetListing,
      //   items: [...targetListing.items, ...data.selectedItem],
      // };
    } else {
      const new_listing = {
        col: collection.id,
        col_cap: collection.cap,
        market: selectedMarket?.id,
        market_cap: selectedMarket?.cap,
        listing_id: selectedMarket?.listings?.length,
        price: parseInt(data.suiAmount || "0"),
        conditions: data.conditions,
        item: data.selectedItem,
        amount: parseInt(data.itemAmount || "0"),
      };

      addListing(new_listing);
    }

    // const updatedMarket = collection.markets ? [...collection.markets] : [];

    // // Find the target market using selectedMarket instead of markets[0]
    // const targetMarketIndex = updatedMarket.findIndex((market) => market.name === marketName);

    // if (targetMarketIndex === -1) {
    //   console.error("Target market not found");
    //   setProductOpen(false);
    //   return;
    // }

    // if (data.selectedItem && data.selectedLayer) {
    //   // Adding new product - create new slot
    //   const newSlot: Slot = {
    //     items: Array(parseInt(data?.itemAmount || "0")).fill({
    //       ...data.selectedItem,
    //     }),
    //     price: parseInt(data.suiAmount || "0"),
    //     conditions: data.conditions || [],
    //   };

    //   updatedMarket[targetMarketIndex] = {
    //     ...updatedMarket[targetMarketIndex],
    //     slots: [...(updatedMarket[targetMarketIndex].slots || []), newSlot],
    //   };
    // } else if (targetSlot) {
    //   // Adding to existing slot - increase quantity
    //   const additionalItems = Array(parseInt(data?.itemAmount || "0")).fill(targetSlot.items[0]);

    //   updatedMarket[targetMarketIndex] = {
    //     ...updatedMarket[targetMarketIndex],
    //     slots: updatedMarket[targetMarketIndex].slots?.map((slot) =>
    //       slot === targetSlot ? { ...slot, items: [...slot.items, ...additionalItems] } : slot,
    //     ),
    //   };
    // }

    // setCollection({
    //   ...collection,
    //   markets: updatedMarket,
    // });

    setProductOpen(false);
    setOpen(false);
  };

  useEffect(() => {
    if (isPending) {
      toast.loading("Listing is being updated...");
    }
    if (result) {
      toast.dismiss();
      toast.success("Listing updated successfully");

      updateMarket({
        ...selectedMarket,
        listings: [...(selectedMarket?.listings || []), result],
      });
    } else if (error) {
      toast.dismiss();
      toast.error("Failed to update listing");
    }
  }, [isPending, result, error]);

  // Render items grid component
  const renderItemsGrid = (marketName: string, _items: Item[]) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{marketName}</h3>
          <Badge variant="secondary"> {getSlotsByMarket(marketName)?.length} items</Badge>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {getSlotsByMarket(marketName)?.length &&
            getSlotsByMarket(marketName)?.map((listing: Listing, index: number) => (
              <div key={`${index}`} className="rounded-lg border p-4">
                <div className="mb-3 aspect-square">
                  <img
                    src={listing.items[0].img_url}
                    alt={listing.items[0].name}
                    className="h-full w-full rounded-md object-cover"
                  />
                </div>
                <h4 className="mb-1 flex items-center justify-between text-sm font-medium">
                  <div>
                    {listing.items[0].name}{" "}
                    <a
                      href={`https://suiscan.xyz/address/${listing.items[0].address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:text-blue-600"
                    >
                      view on Explorer
                    </a>
                  </div>
                  <span className="text-end text-xs text-gray-500">
                    {listing.items.length} Left
                  </span>
                </h4>
                <p className="mb-1 truncate text-xs text-gray-500">
                  {listing.items[0].description}
                </p>
                <p className="my-2 flex flex-wrap gap-2 border-b pb-2">
                  {formatItemAttributes(listing.items[0].attributes || [])?.map((attribute) => (
                    <Badge key={attribute.name} variant="secondary">
                      {attribute.name}: {attribute.value}
                    </Badge>
                  ))}
                </p>

                {listing.price > 0 && (
                  <div>
                    <p>Price : {listing.price} SUI</p>
                  </div>
                )}

                {listing.conditions && listing.conditions.length > 0 && (
                  <div>
                    <p>Requirements : </p>

                    <div className="mt-2 flex flex-wrap items-center gap-x-2">
                      {listing.conditions?.map((condition) => (
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
                      <div className="w-full bg-blue-600 hover:bg-blue-700">Edit Condition</div>
                    </DialogTrigger>
                    <AddCondition
                      attributes={collection.ticket_types || []}
                      listing={listing}
                      onSubmit={() => {}}
                      // onSubmit={(data) => onAddCondition(data, slot)}
                    />
                  </Dialog>
                  <Dialog
                    open={productOpen}
                    onOpenChange={(open) => {
                      setProductOpen(open);
                    }}
                  >
                    <DialogTrigger asChild>
                      <div className="w-full bg-blue-600 hover:bg-blue-700">Add Product</div>
                    </DialogTrigger>
                    <AddProduct
                      items={collection.item_types || []}
                      layers={collection.layer_types || []}
                      isNew={listing.items.length === 0}
                      onSubmit={(data) => onAddProduct(data, listing)}
                    />
                  </Dialog>
                </div>
              </div>
            ))}

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <div className="flex min-h-[300px] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-blue-300 p-4 transition-colors hover:border-blue-400 hover:bg-blue-50">
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-blue-600 hover:text-blue-800">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-2xl font-light text-blue-500">
                    +
                  </div>
                  <span className="text-sm font-medium">Add New Market</span>
                </div>
              </div>
            </DialogTrigger>
            <DisplayItem
              items={collection.item_types || []}
              categories={collection.layer_types || []}
              attributes={collection.ticket_types || []}
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
          {selectedMarket && (
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="outline">Selected Market: {selectedMarket.name}</Badge>
              <span className="text-xs text-gray-500">
                ({selectedMarket.listings?.length || 0} listings)
              </span>
            </div>
          )}
        </CardHeader>
        <ItemsbyCategory
          categories={markets?.map((market: Market) => market.name) || []}
          items={items}
          getItemsByCategory={getSlotsByMarket as any}
          renderItemsGrid={renderItemsGrid}
          onTabChange={handleMarketSelect}
        />
      </Card>
    </div>
  );
};

export default AdminMarket;
