import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList } from "@/components/ui/tabs";
import { TabsTrigger } from "@radix-ui/react-tabs";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useGetMyCollections } from "@/hooks/collection";
import { CollectionData } from "@/types/collection";

export default function Collection() {
  const [currentCollection, setCurrentCollection] = useState<CollectionData>();
  // const [activeTab, setActiveTab] = useState(currentCollection?.objectData.content.fields.layer_types.fields.contents[0] || "");

  const { collections, isPending } = useGetMyCollections({
    owner: "0x23c11df86fad8d628fe9b7fb6bf0b27be231f995b476ae1cff2a227575e96fad",
  });

  useEffect(() => {
    // collections.forEach((c) => console.log("collection", c));
    if (collections) {
      setCurrentCollection(collections[0]);
    }
  }, [collections, isPending]);

  // Sample data for the chart - replace with actual data
  const chartData = [
    { name: "Layer 1", value: 400 },
    { name: "Layer 2", value: 300 },
    { name: "Layer 3", value: 200 },
    { name: "Layer 4", value: 278 },
    { name: "Layer 5", value: 189 },
  ];

  return (
    <div className="flex flex-col gap-4 p-4">
      <section className="flex gap-4">
        <Card
          className={
            "flex h-auto w-[150px] cursor-pointer items-center justify-center border-2 transition-all hover:shadow-lg"
          }
        >
          <CardContent>
            <CardTitle className="text-center text-lg">Create</CardTitle>
            <CardTitle className="text-center text-lg">Collection</CardTitle>
          </CardContent>
        </Card>

        {/* Collection List */}
        <div className="scrollbar-hide overflow-x-auto">
          <div className="grid auto-cols-[minmax(150px,1fr)] grid-flow-col gap-4">
            {collections.map((col, i) => (
              <Card
                key={i}
                className={"cursor-pointer border-2 transition-all hover:shadow-lg"}
                onClick={() => {
                  setCurrentCollection(collections[i]);
                }}
              >
                <CardHeader>
                  <img
                    src={"/DOKPAMI.png"}
                    alt={col.id}
                    className="aspect-video w-full rounded-md object-cover"
                  />
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-lg">
                    {col.id.slice(0, 5)}...{col.id.slice(-5)}
                  </CardTitle>
                  <p className="text-muted-foreground line-clamp-2 text-sm">
                    {col.id.slice(0, 5)}...{col.id.slice(-5)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Left Column - Collection Image and Information */}

        {/* Collection Card */}
        {currentCollection && (
          <div className="flex flex-col gap-4">
            {/* Collection Image */}
            <Card>
              <CardHeader>
                <CardTitle>Collection Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video w-full overflow-hidden rounded-md">
                  <img className="h-full w-full object-cover" src="/DOKPAMI.png" />
                </div>
                <div className="mt-4 space-y-2 overflow-auto">
                  <h1 className="text-xl font-bold">
                    {JSON.stringify(
                      currentCollection.objectData.content.fields.base_type.fields.type
                    )}
                  </h1>
                  {currentCollection.dynamicFieldData.map((data) => {
                    return (
                      <div>
                        <p>{JSON.stringify(data.content.fields.name.fields)}</p>
                        <p>{JSON.stringify(data.content.fields.value.fields)}</p>
                      </div>
                    );
                  })}
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
                  <div className="overflow-auto">
                    <h3 className="font-medium">Property Types</h3>
                    {currentCollection.objectData.content.fields.property_types.fields.contents.map(
                      (data) => (
                        <p className="text-muted-foreground text-sm">
                          {JSON.stringify(data.fields.type)}
                        </p>
                      )
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">Layer Types</h3>
                    {currentCollection.objectData.content.fields.layer_types.fields.contents.map(
                      (data) => (
                        <p className="text-muted-foreground text-sm">
                          {JSON.stringify(data.fields.type)}
                        </p>
                      )
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">Ticket Types</h3>
                    {currentCollection.objectData.content.fields.ticket_types.fields.contents.map(
                      (data) => (
                        <p className="text-muted-foreground text-sm">
                          {JSON.stringify(data.fields.type)}
                        </p>
                      )
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Right Column - Layer Items and Chart */}
        {currentCollection && (
          <div className="flex flex-col gap-4">
            {/* Layer Items */}
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Layer Items</CardTitle>
                <CardDescription>Items by layer</CardDescription>
              </CardHeader>
              <CardContent>
                {/* <Tabs defaultValue={"layers"} className="w-full" onValueChange={setActiveTab}> */}
                <Tabs defaultValue={"layers"} className="w-full">
                  <TabsList className="w-full">
                    {/* <TabsTrigger value="no-layers">No Layers</TabsTrigger> */}
                    {currentCollection.objectData.content.fields.layer_types.fields.contents
                      .length > 0 ? (
                      currentCollection.objectData.content.fields.layer_types.fields.contents.map(
                        (l) => (
                          <TabsTrigger key={l.fields.type} value={l.fields.type}>
                            {l.fields.type}
                          </TabsTrigger>
                        )
                      )
                    ) : (
                      <TabsTrigger value="no-layers">No Layers</TabsTrigger>
                    )}
                  </TabsList>
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
        )}
      </section>
    </div>
  );
}
