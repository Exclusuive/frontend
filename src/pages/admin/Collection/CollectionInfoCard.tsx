import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList } from "@/components/ui/tabs";
import { TabsTrigger } from "@radix-ui/react-tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CollectionData } from "@/types/collection";
import { useEffect, useState } from "react";

interface Props {
  collection: CollectionData;
}
export default function CollectionInfoCard({ collection }: Props) {
  const [imgURL, setImgURL] = useState("");

  useEffect(() => {
    collection.dynamicFieldData.forEach((d) => {
      if (d.content.fields.value.fields.name === "img_url") {
        setImgURL(d.content.fields.value.fields.content);
      }
    });
  }, [collection]);

  // Sample data for the chart - replace with actual data
  const chartData = [
    { name: "Layer 1", value: 400 },
    { name: "Layer 2", value: 300 },
    { name: "Layer 3", value: 200 },
    { name: "Layer 4", value: 278 },
    { name: "Layer 5", value: 189 },
  ];
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Left Column - Collection Image and Information */}

      {/* Collection Card */}
      <div className="flex flex-col gap-4">
        {/* Collection Image */}
        <Card>
          <CardHeader>
            <CardTitle>Collection Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full overflow-hidden rounded-md">
              {/* <img className="h-full w-full object-cover" src={imgURL} /> */}
              <img
                src={imgURL}
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
                  <div>
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

        {/* Collection Information */}
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="overflow-auto">
                <h3 className="font-medium">Property Types</h3>
                {collection.objectData.content.fields.property_types.fields.contents.map((data) => (
                  <p className="text-muted-foreground text-sm">
                    {JSON.stringify(data.fields.type)}
                  </p>
                ))}
              </div>
              <div>
                <h3 className="font-medium">Layer Types</h3>
                {collection.objectData.content.fields.layer_types.fields.contents.map((data) => (
                  <p className="text-muted-foreground text-sm">
                    {JSON.stringify(data.fields.type)}
                  </p>
                ))}
              </div>
              <div>
                <h3 className="font-medium">Ticket Types</h3>
                {collection.objectData.content.fields.ticket_types.fields.contents.map((data) => (
                  <p className="text-muted-foreground text-sm">
                    {JSON.stringify(data.fields.type)}
                  </p>
                ))}
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
            {/* <Tabs defaultValue={"layers"} className="w-full" onValueChange={setActiveTab}> */}
            <Tabs defaultValue={"layers"} className="w-full">
              <TabsList className="w-full">
                {/* <TabsTrigger value="no-layers">No Layers</TabsTrigger> */}
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
    </section>
  );
}
