import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useCollectionStore } from "@/stores/useCollectionStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import ItemsbyCategory from "@/components/ItemsbyCategory";
import { CollectionItem, Listing } from "@/types/collection";
import DisplayItem from "@/components/DisplayItem";
import AddCondition from "@/components/AddCondition";
import AddProduct, { ProductFormData } from "@/components/AddProduct";
import { useAddListing } from "@/hooks/moveCall/useAddListing";
import { useAddProduct } from "@/hooks/moveCall/useAddProduct";

const AdminMarket = () => {
  const { collection, addListingToCollection, addProductToCollection } = useCollectionStore();

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

  const markets = (collection.markets || []).map((market) => market.name);
  // Flatten all items from all slots in all markets into a 1D array
  const items = (collection.markets || [])
    .flatMap((market) => market.listings)
    .flatMap((listing) => listing?.item || []);

  const [open, setOpen] = useState(false);
  const [conditionOpen, setConditionOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const { addListing, result: addListingResult } = useAddListing();
  const { addProduct, result: addProductResult, error } = useAddProduct();

  const getListingsByMarket = (_items: CollectionItem[] | Listing[], marketName: string) => {
    const market = (collection.markets || []).find((m) => m.name === marketName);
    if (!market) return [];
    return market.listings;
  };

  const onAddCondition = () => {
    window.alert("We're working on it");
    setConditionOpen(false);
  };

  const onAddProduct = (
    data: ProductFormData,
    marketName: string,
    targetListing: Listing | null,
  ) => {
    if (!collection) return;

    const selectedMarket = collection.markets?.find((market) => market.name === marketName);

    if (!targetListing) {
      addListing({
        collection_id: collection.collection_id,
        collection_cap_id: collection.collection_cap_id,
        market_id: selectedMarket?.market_id || "",
        market_cap_id: selectedMarket?.market_cap_id || "",
        listing_number: selectedMarket?.listings?.length || 0,
        item: data.selectedItem,
        value: parseInt(data.itemAmount || "0"),
        price: parseInt(data.suiAmount || "0"),
        conditions: data.conditions || [],
      });
    } else {
      console.log(targetListing);
      addProduct({
        collection_id: collection.collection_id,
        collection_cap_id: collection.collection_cap_id,
        market_id: selectedMarket?.market_id || "",
        market_cap_id: selectedMarket?.market_cap_id || "",
        listing_number: targetListing.listing_number,
        item: targetListing.item,
        value: parseInt(data.itemAmount || "0"),
      });
    }
  };

  useEffect(() => {
    if (addListingResult) {
      addListingToCollection(addListingResult);
      setOpen(false);
      setProductOpen(false);
      setConditionOpen(false);
      setSelectedListing(null);
    }
  }, [addListingResult]);

  useEffect(() => {
    if (addProductResult) {
      addProductToCollection(addProductResult);
      setProductOpen(false);
      setOpen(false);
    }
    console.log(error);
  }, [addProductResult, error]);

  // Render items grid component
  const renderItemsGrid = (marketName: string, items: CollectionItem[] | Listing[]) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{marketName}</h3>
          <Badge variant="secondary"> {getListingsByMarket(items, marketName)?.length} items</Badge>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {Array.isArray(getListingsByMarket(items, marketName)) &&
            getListingsByMarket(items, marketName)!.length > 0 &&
            getListingsByMarket(items, marketName)!.map((listing: Listing, index: number) => (
              <div key={index} className="rounded-lg border p-4">
                <div className="mb-3 aspect-square">
                  <img
                    src={listing.item?.img_url}
                    alt={listing.item?.name}
                    className="h-full w-full rounded-md object-cover"
                  />
                </div>
                <h4 className="mb-1 flex items-center justify-between text-sm font-medium">
                  <div>
                    {listing.item?.name}{" "}
                    <a
                      href={`https://suiscan.xyz/address/${listing.item?.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:text-blue-600"
                    >
                      view on Explorer
                    </a>
                  </div>
                  <span className="text-end text-xs text-gray-500">{listing.value} Left</span>
                </h4>
                <p className="mb-1 truncate text-xs text-gray-500">{listing.item?.description}</p>
                <p className="my-2 flex flex-wrap gap-2 border-b pb-2">
                  {listing.item?.attributes?.map((attribute) => (
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
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Edit Condition
                      </Button>
                    </DialogTrigger>
                    <AddCondition
                      attributes={collection.tickets || []}
                      listing={listing}
                      onSubmit={onAddCondition}
                    />
                  </Dialog>
                  <Dialog
                    open={productOpen}
                    onOpenChange={(open) => {
                      setProductOpen(open);
                      if (!open) setSelectedListing(null);
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => setSelectedListing(listing)}
                      >
                        Add Product
                      </Button>
                    </DialogTrigger>
                    <AddProduct
                      items={collection.items || []}
                      layers={collection.layers || []}
                      isNew={listing.value === 0}
                      onSubmit={(data) => {
                        onAddProduct(data, marketName, selectedListing);
                      }}
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
                  <span className="text-sm font-medium">Add New Item</span>
                </div>
              </div>
            </DialogTrigger>
            <DisplayItem
              items={collection.items || []}
              categories={collection.layers || []}
              attributes={collection.tickets || []}
              onSubmit={(data) => onAddProduct(data, marketName, null)}
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
          collection={collection}
          label="markets"
          categories={markets}
          items={items}
          getItemsByCategory={(items, marketName) => getListingsByMarket(items, marketName) || []}
          renderItemsGrid={renderItemsGrid}
        />
      </Card>
    </div>
  );
};

export default AdminMarket;
