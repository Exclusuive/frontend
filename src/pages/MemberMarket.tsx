import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ItemsbyCategory from "@/components/ItemsbyCategory";
import { CollectionItem, Listing } from "@/types/collection";
import { Button } from "@/components/ui/button";
import { useCollectionStore } from "@/stores/useCollectionStore";

const MemberMarket = () => {
  const { collection } = useCollectionStore();

  if (!collection) {
    return (
      <div className="flex flex-col gap-4 p-10">
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <p className="mb-2 text-lg font-medium text-gray-600">No Collection Selected</p>
              <p className="text-sm text-gray-500">
                Please select a collection to view its market items.
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
    .flatMap((listing) => listing?.item);

  const getListingsByMarket = (_items: CollectionItem[] | Listing[], marketName: string) => {
    const market = (collection.markets || []).find((m) => m.name === marketName);
    if (!market) return [];
    return market.listings;
  };

  const handleBuyProduct = async (_listing: Listing, _quantity: number) => {
    if (!collection) return;

    // try {
    //   // Here you would typically make an API call to process the purchase
    //   // For now, we'll simulate the purchase by updating the local state
    //   const updatedMarket = collection.markets ? [...collection.markets] : [];

    //   // Find the market containing this slot
    //   const marketIndex = updatedMarket.findIndex((market) => market.slots.some((s) => s === slot));

    //   if (marketIndex !== -1) {
    //     updatedMarket[marketIndex] = {
    //       ...updatedMarket[marketIndex],
    //       listings: updatedMarket[marketIndex].listings.map((s) => {
    //         if (s === listing) {
    //           return {
    //             ...s,
    //             items: s.items.slice(quantity),
    //           };
    //         }
    //         return s;
    //       }),
    //     };

    //     updateMembership({
    //       ...membership,
    //       collection: {
    //         ...membership.collection,
    //         market: updatedMarket,
    //       },
    //     });
    //   }
    // } catch (error) {
    //   console.error("Purchase failed:", error);
    // }
  };

  // Render items grid component
  const renderItemsGrid = (marketName: string, items: CollectionItem[] | Listing[]) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{marketName}</h3>
          <Badge variant="secondary"> {getListingsByMarket(items, marketName)?.length} items</Badge>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {getListingsByMarket(items, marketName)?.length &&
            getListingsByMarket(items, marketName)?.map((listing: Listing, index: number) =>
              listing.item ? (
                <div key={`${index}`} className="rounded-lg border p-4">
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
                      <Badge key={attribute?.name} variant="secondary">
                        {attribute?.name}: {attribute?.value}
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
                          <div key={condition?.name} className="flex items-center gap-2">
                            <Badge variant="secondary">{condition?.name}</Badge>
                            <span className="text-xs text-gray-500">: {condition?.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleBuyProduct(listing, 1)}
                  >
                    Buy Now
                  </Button>
                </div>
              ) : (
                <div key={`${index}`} className="rounded-lg border p-4">
                  <p>No items in this slot</p>
                </div>
              ),
            )}
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
          label="Market"
          collection={collection}
          categories={markets}
          items={items as CollectionItem[]}
          getItemsByCategory={(items, marketName) => getListingsByMarket(items, marketName) || []}
          renderItemsGrid={renderItemsGrid}
        />
      </Card>
    </div>
  );
};

export default MemberMarket;
