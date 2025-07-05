import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ItemsbyCategory from "@/components/ItemsbyCategory";
import { Item, Slot } from "@/types/collection";
import { useMembershipStore } from "@/stores/useMembershipStore";
import { Button } from "@/components/ui/button";

const MemberMarket = () => {
  const { membership, updateMembership } = useMembershipStore();

  if (!membership?.collection) {
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

  const markets = (membership.collection.market || []).map((market) => market.name);
  // Flatten all items from all slots in all markets into a 1D array
  const items = (membership.collection.market || [])
    .flatMap((market) => market.slots)
    .flatMap((slot) => slot.items);

  const getSlotsByMarket = (_items: Item[], marketName: string) => {
    const market = (membership.collection.market || []).find((m) => m.name === marketName);
    if (!market) return [];
    return market.slots;
  };

  const handleBuyProduct = async (slot: Slot, quantity: number) => {
    if (!membership.collection) return;

    try {
      // Here you would typically make an API call to process the purchase
      // For now, we'll simulate the purchase by updating the local state
      const updatedMarket = membership.collection.market ? [...membership.collection.market] : [];

      // Find the market containing this slot
      const marketIndex = updatedMarket.findIndex((market) => market.slots.some((s) => s === slot));

      if (marketIndex !== -1) {
        updatedMarket[marketIndex] = {
          ...updatedMarket[marketIndex],
          slots: updatedMarket[marketIndex].slots.map((s) => {
            if (s === slot) {
              return {
                ...s,
                items: s.items.slice(quantity),
              };
            }
            return s;
          }),
        };

        updateMembership({
          ...membership,
          collection: {
            ...membership.collection,
            market: updatedMarket,
          },
        });
      }
    } catch (error) {
      console.error("Purchase failed:", error);
    }
  };

  // Render items grid component
  const renderItemsGrid = (marketName: string, items: Item[]) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{marketName}</h3>
          <Badge variant="secondary"> {getSlotsByMarket(items, marketName).length} items</Badge>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {getSlotsByMarket(items, marketName).length > 0 &&
            getSlotsByMarket(items, marketName).map((slot: Slot, index: number) =>
              slot.items.length > 0 ? (
                <div key={`${index}`} className="rounded-lg border p-4">
                  <div className="mb-3 aspect-square">
                    <img
                      src={slot.items[0]?.imgUrl}
                      alt={slot.items[0]?.name}
                      className="h-full w-full rounded-md object-cover"
                    />
                  </div>
                  <h4 className="mb-1 flex items-center justify-between text-sm font-medium">
                    <div>
                      {slot.items[0]?.name}{" "}
                      <a
                        href={`https://suiscan.xyz/address/${slot.items[0]?.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:text-blue-600"
                      >
                        view on Explorer
                      </a>
                    </div>
                    <span className="text-end text-xs text-gray-500">{slot.items.length} Left</span>
                  </h4>
                  <p className="mb-1 truncate text-xs text-gray-500">
                    {slot.items[0]?.description}
                  </p>
                  <p className="my-2 flex flex-wrap gap-2 border-b pb-2">
                    {slot.items[0]?.attributes?.map((attribute) => (
                      <Badge key={attribute?.name} variant="secondary">
                        {attribute?.name}: {attribute?.value}
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
                    onClick={() => handleBuyProduct(slot, 1)}
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
          <p className="text-sm text-gray-600">Collection: {membership.collection.name}</p>
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

export default MemberMarket;
