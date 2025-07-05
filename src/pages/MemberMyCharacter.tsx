import { useMembershipStore } from "@/stores/useMembershipStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ItemsbyLayer from "@/components/ItemsbyCategory";
import { Item } from "@/types/collection";
import { useAuthStore } from "@/stores/useAuthStore";

const MemberMyCharacter = () => {
  const { membership, updateItem } = useMembershipStore();
  const { user } = useAuthStore();

  if (!membership) return <div>No membership selected</div>;

  // Group items by layer
  const getItemsByCategory = (items: Item[], layer: string) => {
    return items.filter((item) => item.layer === layer);
  };

  // Render items grid for each layer
  const renderItemsGrid = (layer: string, items: Item[]) => {
    const layerItems = getItemsByCategory(items, layer);
    const isEquipped = (item: Item) =>
      membership.items.find((item) => item.layer === layer)?.address === item.address;

    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {layerItems.map((item) => (
          <div
            key={item.address}
            className={`relative cursor-pointer rounded-lg border-2 p-2 transition-all hover:scale-105 ${
              isEquipped(item)
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => handleEquipItem(item, layer)}
          >
            <div className="aspect-square w-full overflow-hidden rounded-md">
              <img src={item.imgUrl} alt={item.name} className="h-full w-full object-cover" />
            </div>
            <div className="mt-2 text-center">
              <p className="truncate text-xs font-medium text-gray-900">{item.name}</p>
              {isEquipped(item) && (
                <Badge variant="default" className="mt-1 text-xs">
                  Equipped
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleEquipItem = (item: Item, layer: string) => {
    console.log(item, layer);
  };

  const handleUnequipItem = (layer: string) => {
    console.log(layer);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Side - Character Preview */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-full">
                <img
                  src={membership.imgUrl || "/placeholder-avatar.png"}
                  alt={membership.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{membership.id}</h2>
                <p className="text-sm text-gray-500">{membership.collection.name}</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Character Image */}
            <div className="relative mb-6">
              <div className="mx-auto aspect-square w-full max-w-md overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={membership.imgUrl || "/placeholder-character.png"}
                  alt="Character"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Equipped Items */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Equipped Items</h3>
              {membership.collection?.layers?.length === 0 ? (
                <p className="py-4 text-center text-gray-500">No items available</p>
              ) : (
                <div className="space-y-3">
                  {membership.collection?.layers?.map((layer) => {
                    const equippedItem = membership.items.find((item) => item.layer === layer);
                    return (
                      <div
                        key={layer}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 overflow-hidden rounded bg-gray-100">
                            {equippedItem ? (
                              <img
                                src={equippedItem.imgUrl}
                                alt={equippedItem.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-gray-400">
                                <span className="text-xs">?</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium capitalize">{layer}</p>
                            <p className="text-xs text-gray-500">
                              {equippedItem ? equippedItem.name : "Not equipped"}
                            </p>
                          </div>
                        </div>
                        {equippedItem && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUnequipItem(layer)}
                            className="text-xs"
                          >
                            Unequip
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right Side - Item Inventory */}
        <Card>
          <CardHeader>
            <CardTitle>Item Inventory</CardTitle>
            <p className="text-sm text-gray-500">Click on items to equip them to your character</p>
          </CardHeader>
          <CardContent>
            <ItemsbyLayer
              categories={membership.collection?.layers || []}
              items={user?.itemsInWallet || []}
              getItemsByCategory={getItemsByCategory}
              renderItemsGrid={renderItemsGrid}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemberMyCharacter;
