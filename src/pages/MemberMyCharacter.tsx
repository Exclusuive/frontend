import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ItemsbyLayer from "@/components/ItemsbyCategory";
import { CollectionItem } from "@/types/collection";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCollectionStore } from "@/stores/useCollectionStore";
import { Button } from "@/components/ui/button";
import { useGetMemberItems } from "@/hooks/useGetMemberItems";
import { useEquipItem } from "@/hooks/moveCall/useEquipItem";
import { useEffect } from "react";
import CharacterImage from "@/components/CharacterImage";

const MemberMyCharacter = () => {
  const { user } = useAuthStore();
  const { collection, equipItemToMembership } = useCollectionStore();
  const membership = collection?.selected_membership;
  const { items } = useGetMemberItems({ owner: user?.address || "" });
  const { equipItem, result } = useEquipItem();
  if (!membership) return <div>No membership selected</div>;

  // Group items by layer
  const getItemsByCategory = (items: CollectionItem[], layer: string) => {
    return items.filter((item) => item.layer === layer);
  };

  const handleEquipItem = (item: CollectionItem) => {
    equipItem({
      collection_id: collection?.collection_id || "",
      membership: membership,
      item: item,
    });
  };

  console.log(collection);

  useEffect(() => {
    if (result) {
      equipItemToMembership(result);
    }
  }, [result]);

  const renderItemsGrid = (layer: string, items: CollectionItem[]) => {
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-4 overflow-y-auto">
          {getItemsByCategory(items, layer).length > 0 &&
            getItemsByCategory(items, layer).map((item) => (
              <div key={`${item.name}`} className="flex items-center gap-3 rounded-md border p-3">
                <div className="flex-shrink-0">
                  <img
                    src={item.img_url}
                    alt={item.name}
                    className="h-9 w-9 rounded object-cover md:h-20 md:w-20"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-semibold">{item.name}</h4>
                  </div>
                  {item.description && (
                    <p className="truncate text-xs text-gray-500">{item.description}</p>
                  )}
                  {item.attributes && item.attributes.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.attributes.map((attribute) => (
                        <Badge
                          key={attribute.name}
                          variant="secondary"
                          className="px-1.5 py-0.5 text-[11px]"
                        >
                          {attribute.name}: {attribute.value}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <Button variant="outline" size="sm" onClick={() => handleEquipItem(item)}>
                  Equip
                </Button>
              </div>
            ))}
        </div>
      </div>
    );
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
                  src={collection?.img_url || "/placeholder-avatar.png"}
                  alt={collection?.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm text-gray-500">Collection: {collection?.name}</p>
                <h2 className="text-xl font-semibold">
                  {membership?.address.slice(0, 10)}...
                  {membership?.address.slice(-10)}
                </h2>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Character Image */}
            <div className="relative mb-6">
              <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-lg border">
                <CharacterImage membership={membership} />
              </div>
            </div>

            {/* Equipped Items */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Equipped Items</h3>
              {collection?.layers?.length === 0 ? (
                <p className="py-4 text-center text-gray-500">No items available</p>
              ) : (
                <div className="space-y-3">
                  {collection?.layers?.map((layer) => {
                    const equippedItem = membership.equipped_items?.find(
                      (item) => item.layer === layer,
                    );

                    return (
                      <div
                        key={layer}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 overflow-hidden rounded bg-gray-100">
                            {equippedItem ? (
                              <img
                                src={equippedItem.img_url}
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
                          <div>
                            {equippedItem?.attributes?.map((attribute) => (
                              <Badge variant="secondary" className="text-xs">
                                {attribute.name} : {attribute.value}
                              </Badge>
                            ))}
                          </div>
                        </div>
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
              categories={collection?.layers || []}
              items={items || []}
              getItemsByCategory={(items, layer) =>
                getItemsByCategory(items as CollectionItem[], layer)
              }
              renderItemsGrid={(layer, items) => renderItemsGrid(layer, items as CollectionItem[])}
              label={collection?.name || ""}
              collection={collection}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemberMyCharacter;
