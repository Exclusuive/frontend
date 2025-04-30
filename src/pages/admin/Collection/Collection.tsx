import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { TabsTrigger } from "@radix-ui/react-tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Collection() {
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
      <div className="flex gap-4">
        <Card
          // key={item.collection_id}
          // onClick={() => onClick(item.collection_id, item.cap_id || "")}
          className={"h-auto min-w-[150px] cursor-pointer border-2 transition-all hover:shadow-lg"}
        >
          <CardHeader>
            <img
              // src={item.img_url}
              alt={"sdfsd"}
              className="aspect-video w-full rounded-md object-cover"
            />
          </CardHeader>
          <CardContent>
            <CardTitle className="text-lg">{"create"}</CardTitle>
            <p className="text-muted-foreground line-clamp-2 text-sm">{"create"}</p>
          </CardContent>
        </Card>
        <div className="scrollbar-hide overflow-x-auto">
          <div className="grid auto-cols-[minmax(150px,1fr)] grid-flow-col gap-4">
            {["holy", "moly", "1", "2", "3", "4", "5", "6", "7", "8", "9"].map((item) => (
              <Card
                // key={item.collection_id}
                // onClick={() => onClick(item.collection_id, item.cap_id || "")}
                className={"cursor-pointer border-2 transition-all hover:shadow-lg"}
              >
                <CardHeader>
                  <img
                    // src={item.img_url}
                    alt={item}
                    className="aspect-video w-full rounded-md object-cover"
                  />
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-lg">{item}</CardTitle>
                  <p className="text-muted-foreground line-clamp-2 text-sm">{item}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
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
                <img className="h-full w-full object-cover" src="/DOKPAMI.png" />
              </div>
              <div className="mt-4 space-y-2">
                <h1 className="text-xl font-bold">{"collection name"}</h1>
                <p className="text-muted-foreground text-sm">{"collection description"}</p>
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
                    {/* {collection?.property_types?.join(", ") || "No property types defined"} */}
                    {"No property types defined"}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Layer Types</h3>
                  <p className="text-muted-foreground text-sm">
                    {/* {collection?.layer_types?.join(", ") || "No layer types defined"} */}
                    {"No layer types defined"}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Ticket Types</h3>
                  <p className="text-muted-foreground text-sm">
                    {/* {collection?.ticket_types?.join(", ") || "No ticket types defined"} */}
                    {"No ticket types defined"}
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
              {/* <Tabs defaultValue={"layers"} className="w-full" onValueChange={setActiveTab}> */}
              <Tabs defaultValue={"layers"} className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="no-layers">No Layers</TabsTrigger>
                  {/* {collection?.layer_types && collection.layer_types.length > 0 ? (
                    collection.layer_types.map((layer: string) => (
                      <TabsTrigger key={layer} value={layer}>
                        {layer}
                      </TabsTrigger>
                    ))
                  ) : (
                    <TabsTrigger value="no-layers">No Layers</TabsTrigger>
                  )} */}
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
      </div>
    </div>
  );
}
