import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEquipBase, usePopFromItembag } from "@/hooks/moveCall/member";
import { useGetMyItems } from "@/hooks/useGetData/collection";
import { ItemType } from "@/types/collection";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useState } from "react";
export default function ItemCard({
  selectedBase,
  selectedCollection,
}: {
  selectedBase: any;
  selectedCollection: any;
}) {
  const account = useCurrentAccount();
  const [activeTab, setActiveTab] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<ItemType>();
  const { equipBase } = useEquipBase();
  const { popFromItembag } = usePopFromItembag();

  const { items, refetch } = useGetMyItems({ owner: account?.address || "" });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Items you have</CardTitle>
        <CardContent className="flex-grow">
          <Tabs className="w-full" onValueChange={setActiveTab}>
            <TabsList className="w-full">
              {selectedCollection.objectData.content.fields.layer_types.fields.contents.length >
              0 ? (
                selectedCollection.objectData.content.fields.layer_types.fields.contents.map(
                  (l: any) => (
                    <TabsTrigger key={l.fields.type} value={l.fields.type}>
                      {l.fields.type}
                    </TabsTrigger>
                  )
                )
              ) : (
                <TabsTrigger value="no-layers">No Layers</TabsTrigger>
              )}
            </TabsList>{" "}
            <TabsContent value={activeTab}>
              <Label className="mb-4 text-sm font-bold">Items in your wallet</Label>
              <div className="space-y-4 overflow-auto">
                {items
                  .filter((d: any) => d.fields.type.fields.type === activeTab)
                  .map((d: any, i: number) => {
                    const item = d;
                    return (
                      <div key={i}>
                        <div
                          className={`flex cursor-pointer items-center gap-4 rounded-lg border p-2 hover:bg-gray-100 ${selectedItem?.fields.id.id === item.fields.id.id ? "border-2 border-blue-500" : "border-gray-200"}`}
                          onClick={() => setSelectedItem(item)}
                        >
                          <div className="h-16 w-16 overflow-hidden rounded-md">
                            <img
                              src={item.fields.img_url}
                              alt={item.fields.item_type}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <h3 className="font-medium">{item.fields.item_type}</h3>
                        </div>

                        {selectedItem?.fields.id.id === item.fields.id.id && (
                          <div className="mt-4 space-y-4">
                            <div className="flex gap-4">
                              <Button
                                onClick={() => {
                                  equipBase({
                                    collectionId: selectedCollection.id,
                                    baseId: selectedBase.id,
                                    itemId: item.fields.id.id,
                                  });
                                  refetch();
                                }}
                                disabled={!selectedItem}
                              >
                                Equip
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
              <Label className="mb-4 text-sm font-bold">Items in base object</Label>
              <div className="space-y-4 overflow-auto">
                {selectedBase?.dynamicFieldData?.length > 0 &&
                  selectedBase.dynamicFieldData
                    .filter((item: any) => item.type.includes("ItemBagKey"))
                    .map((d: any, index: number) => {
                      const items = d.content.fields.value;
                      return (
                        <div key={index}>
                          {items
                            .filter((d: any) => d.fields.type.fields.type === activeTab)
                            .map((item: any, index: number) => {
                              return (
                                <div key={index}>
                                  <div
                                    className={`flex cursor-pointer items-center gap-4 rounded-lg border p-2 hover:bg-gray-100 ${selectedItem?.fields.id.id === item.fields.id.id ? "border-2 border-blue-500" : "border-gray-200"}`}
                                    onClick={() => setSelectedItem(item)}
                                  >
                                    <div className="h-16 w-16 overflow-hidden rounded-md">
                                      <img
                                        src={item.fields.img_url}
                                        alt={item.fields.item_type}
                                        className="h-full w-full object-cover"
                                      />
                                    </div>
                                    <h3 className="font-medium">{item.fields.item_type}</h3>
                                  </div>

                                  {selectedItem?.fields.id.id === item.fields.id.id && (
                                    <div className="mt-4 space-y-4">
                                      <div className="flex gap-4">
                                        <Button
                                          onClick={() => {
                                            popFromItembag({
                                              baseId: selectedBase.id,
                                              itemtype: items[0].fields.type.fields.type,
                                            });
                                            refetch();
                                          }}
                                          disabled={!selectedItem}
                                        >
                                          Pop from Itembag
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                        </div>
                      );
                    })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </CardHeader>
    </Card>
  );
}
