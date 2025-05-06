import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CollectionContext } from "@/context/CollectionContext";
import { CollectionData, ItemType } from "@/types/collection";
import { useContext, useEffect, useState } from "react";

export default function MintExistingItem() {
  const [currentCollection, setCurrentCollection] = useState<CollectionData>();
  const [selectedLayer, setSelectedLayer] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<ItemType>();
  const [recipient, setRecipient] = useState<string>("");

  const {
    collection: { collections, index: cIndex },
  } = useContext(CollectionContext);

  useEffect(() => {
    if (collections && cIndex !== -1) {
      setCurrentCollection(collections[cIndex]);
    }
  }, [collections, cIndex]);

  return (
    <Card title="Items by Layer" className="flex-1">
      <CardHeader>
        <CardTitle>Mint Existing Item</CardTitle>
        <CardDescription>Items by layer</CardDescription>
      </CardHeader>

      {currentCollection && (
        <CardContent>
          <Tabs defaultValue={"layers"} className="w-full" onValueChange={setSelectedLayer}>
            <TabsList className="w-full">
              {currentCollection.objectData.content.fields.layer_types.fields.contents.length >
              0 ? (
                currentCollection.objectData.content.fields.layer_types.fields.contents.map((l) => (
                  <TabsTrigger key={l.fields.type} value={l.fields.type}>
                    {l.fields.type}
                  </TabsTrigger>
                ))
              ) : (
                <TabsTrigger value="no-layers">No Layers</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value={selectedLayer}>
              <div className="space-y-4 overflow-auto">
                {currentCollection.objectData.content.fields.item_types.fields.contents
                  .filter((d) => d.fields.type.fields.type === selectedLayer)
                  .map((d, i) => {
                    const item = d;
                    return (
                      <div key={i}>
                        <div
                          className={`flex cursor-pointer items-center gap-4 rounded-lg border p-2 hover:bg-gray-100 ${selectedItem?.fields.item_type === item.fields.item_type ? "border-2 border-blue-500" : "border-gray-200"}`}
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

                        {selectedItem?.fields.item_type === item.fields.item_type && (
                          <div className="mt-4 space-y-4">
                            <div className="flex gap-4">
                              <Input
                                placeholder="Enter recipient address"
                                value={recipient}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                  setRecipient(e.target.value)
                                }
                                className="flex-1"
                              />
                              <Button onClick={() => {}} disabled={!recipient}>
                                Mint
                              </Button>
                            </div>
                          </div>
                        )}
                        <div className="space-y-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="propertyType" className="text-right">
                              Property Type
                            </Label>
                            <Select
                            // value={state.selectedPropertyType}
                            // onValueChange={(value) =>
                            //   setState((prev) => ({ ...prev, selectedPropertyType: value }))
                            // }
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a property type" />
                              </SelectTrigger>
                              <SelectContent>
                                {/* {propertyTypes.map((propertyType) => (
                      <SelectItem key={propertyType} value={propertyType}>
                        {propertyType}
                      </SelectItem>
                    ))} */}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="propertyValue" className="text-right">
                              Property Value
                            </Label>
                            <div className="col-span-3 flex gap-2">
                              <Input
                                id="propertyValue"
                                // value={state.propertyValue}
                                // onChange={(e) =>
                                //   setState((prev) => ({ ...prev, propertyValue: e.target.value }))
                                // }
                                className="flex-1"
                                placeholder="Enter property value"
                              />
                              <Button
                                type="button"
                                // onClick={handleAddProperty}
                                // disabled={!state.selectedPropertyType || !state.propertyValue}
                              >
                                Add
                              </Button>
                            </div>
                          </div>

                          {/* Display added properties */}
                          {/* {state.properties.length > 0 && ( */}
                          {true && (
                            <div className="col-span-4 space-y-2">
                              <Label className="block text-right">Added Properties</Label>
                              <div className="space-y-2">
                                {/* {state.properties.map((property, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-md border p-2"
                      >
                        <div>
                          <span className="font-medium">{property.type}:</span> {property.value}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveProperty(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))} */}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </TabsContent>
            <TabsContent value="combinations">
              <div className="space-y-4">
                <p>Combination information will be displayed here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
}
