import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CollectionData, ItemType } from "@/types/collection";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CollectionImg from "./CollectionImg";

interface Props {
  collection: CollectionData;
}
export default function CollectionOverview({ collection }: Props) {
  const [selectedLayer, setSelectedLayer] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<ItemType>();
  const [recipient, setRecipient] = useState<string>("");

  // useEffect(() => {
  //   console.log("active tab:", selectedLayer);
  // }, [selectedLayer]);

  // Sample data for the chart - replace with actual data
  const chartData = [
    { name: "Layer 1", value: 400 },
    { name: "Layer 2", value: 300 },
    { name: "Layer 3", value: 200 },
    { name: "Layer 4", value: 278 },
    { name: "Layer 5", value: 189 },
  ];

  const handleMintItem = async (item: ItemType) => {
    if (!recipient) return;

    try {
      // await mintItem({
      //   id: collectionId || "",
      //   capId: capId || "",
      //   layer: item.layer,
      //   itemName: item.name,
      //   itemImageUrl: item.img_url,
      //   itemImg: null,
      //   toAddress: recipient,
      // });
      setRecipient("");
      setSelectedItem(undefined);
    } catch (error) {
      console.error("Error minting item:", error);
    }
  };

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Left Column */}
      <div className="flex flex-col gap-4">
        {/* Top Left */}
        <Card title="Collection Overview Card">
          <CardHeader>
            <CardTitle>Collection Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full overflow-hidden rounded-md">
              <CollectionImg
                collection={collection}
                alt={collection.objectData.content.fields.base_type.fields.type}
                className="aspect-video w-full rounded-md object-cover"
              />
            </div>
            <div className="mt-4 space-y-2 overflow-auto">
              <h1 className="text-xl font-bold">
                {collection.objectData.content.fields.base_type.fields.type}
              </h1>
              <p className="font-semibold">Collection Configs</p>
              {collection.dynamicFieldData.map((data) => {
                if (!("name" in data.content.fields.value.fields)) return;
                return (
                  <div key={data.objectId}>
                    <p>
                      {data.content.fields.value.fields.name}:{" "}
                      {data.content.fields.value.fields.content}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Bottom Left */}
        <Card title="Collection Types List">
          <CardHeader>
            <CardTitle>Collection Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="overflow-auto">
                <h3 className="font-medium">Property Types</h3>
                {collection.objectData.content.fields.property_types.fields.contents.length > 0 ? (
                  collection.objectData.content.fields.property_types.fields.contents.map(
                    (data) => (
                      <span key={data.type}>
                        <p className="text-muted-foreground text-sm">{data.fields.type}</p>{" "}
                      </span>
                    )
                  )
                ) : (
                  <p className="text-muted-foreground text-sm">No property types defined</p>
                )}
              </div>
              <div>
                <h3 className="font-medium">Layer Types</h3>
                {collection.objectData.content.fields.layer_types.fields.contents.length > 0 ? (
                  collection.objectData.content.fields.layer_types.fields.contents.map((data) => (
                    <span key={data.type}>
                      <p className="text-muted-foreground text-sm">{data.fields.type}</p>{" "}
                    </span>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No layer types defined</p>
                )}
              </div>
              <div>
                <h3 className="font-medium">Ticket Types</h3>
                {collection.objectData.content.fields.ticket_types.fields.contents.length > 0 ? (
                  collection.objectData.content.fields.ticket_types.fields.contents.map((data) => (
                    <span key={data.type}>
                      <p className="text-muted-foreground text-sm">{data.fields.type}</p>{" "}
                    </span>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No ticket types defined</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Layer Items and Chart */}
      <div className="flex flex-col gap-4">
        {/* Top Right */}
        <Card title="Items by Layer" className="flex-1">
          <CardHeader>
            <CardTitle>Items by layer</CardTitle>
            <CardDescription>Items by layer</CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue={"layers"} className="w-full" onValueChange={setSelectedLayer}>
              <TabsList className="w-full">
                {collection.objectData.content.fields.layer_types.fields.contents.length > 0 ? (
                  collection.objectData.content.fields.layer_types.fields.contents.map((l) => (
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
                  {collection.objectData.content.fields.item_types.fields.contents
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
                                <Button onClick={() => handleMintItem(item)} disabled={!recipient}>
                                  Mint
                                </Button>
                              </div>
                            </div>
                          )}
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
        </Card>

        {/* Bottom Right */}
        <Card title="Chart">
          <CardHeader>
            <CardTitle>Distribution Chart</CardTitle>
            <CardDescription>Item distribution across layers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
