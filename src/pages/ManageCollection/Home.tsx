import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useGetCollection } from "@/hooks/useGetCollection";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSendTransactions } from "@/hooks/useSendTransactions";
import { CollectionItem } from "@/types/types";

export default function Home() {
  const [searchParams] = useSearchParams();
  const collectionId = searchParams.get("collection_id");
  const capId = searchParams.get("cap_id");
  const { collection } = useGetCollection(collectionId || "", capId || "");
  const [activeTab, setActiveTab] = useState(collection?.layer_types?.[0] || "");
  const [selectedItem, setSelectedItem] = useState<CollectionItem | null>(null);
  const [recipient, setRecipient] = useState<string>("");
  const { mintItem } = useSendTransactions();

  // Sample data for the chart - replace with actual data
  const chartData = [
    { name: "Layer 1", value: 400 },
    { name: "Layer 2", value: 300 },
    { name: "Layer 3", value: 200 },
    { name: "Layer 4", value: 278 },
    { name: "Layer 5", value: 189 },
  ];

  const handleMintItem = async (item: CollectionItem) => {
    if (!recipient) return;

    try {
      await mintItem({
        id: collectionId || "",
        capId: capId || "",
        layer: item.layer,
        itemName: item.name,
        itemImageUrl: item.img_url,
        itemImg: null,
        toAddress: recipient,
      });
      setRecipient("");
      setSelectedItem(null);
    } catch (error) {
      console.error("Error minting item:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Left Column - Collection Image and Information */}
        <div className="flex flex-col gap-4">
          {/* Collection Image */}
          <Card>
            <CardHeader>
              <CardTitle>Collection Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video w-full overflow-hidden rounded-md">
                <img
                  src={collection?.img_url}
                  alt={collection?.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-4 space-y-2">
                <h1 className="text-xl font-bold">{collection?.name}</h1>
                <p className="text-muted-foreground text-sm">{collection?.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Collection Information */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Property Types</h3>
                  <p className="text-muted-foreground text-sm">
                    {collection?.property_types?.join(", ") || "No property types defined"}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Layer Types</h3>
                  <p className="text-muted-foreground text-sm">
                    {collection?.layer_types?.join(", ") || "No layer types defined"}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Supplier Type</h3>
                  <p className="text-muted-foreground text-sm">
                    {collection?.supplier_type || "No supplier type defined"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Layer Items and Chart */}
        <div className="flex flex-col gap-4">
          {/* Layer Items */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Layer Items</CardTitle>
              <CardDescription>Items by layer</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={"layers"} className="w-full" onValueChange={setActiveTab}>
                <TabsList className="w-full">
                  {collection?.layer_types && collection.layer_types.length > 0 ? (
                    collection.layer_types.map((layer: string) => (
                      <TabsTrigger key={layer} value={layer}>
                        {layer}
                      </TabsTrigger>
                    ))
                  ) : (
                    <TabsTrigger value="no-layers">No Layers</TabsTrigger>
                  )}
                </TabsList>
                <TabsContent value={activeTab}>
                  <div className="space-y-4">
                    {collection?.items
                      ?.filter((item) => item.layer === activeTab)
                      .map((item, index: number) => (
                        <div key={index}>
                          <div
                            className={`flex cursor-pointer items-center gap-4 rounded-lg border p-2 hover:bg-gray-100 ${selectedItem?.name === item.name ? "border-2 border-blue-500" : "border-gray-200"}`}
                            onClick={() => setSelectedItem(item)}
                          >
                            <div className="h-16 w-16 overflow-hidden rounded-md">
                              <img
                                src={item.img_url}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <h3 className="font-medium">{item.name}</h3>
                          </div>

                          {selectedItem?.name === item.name && (
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
                      ))}
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

          {/* Chart */}
          <Card>
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
      </div>
    </div>
  );
}
