import { CollectionData } from "@/types/collection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDown, ArrowUp, Plus } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import SortableList from "./Test2";

interface Props {
  collection: CollectionData;
}
export default function LayerInfo({ collection }: Props) {
  const [newLayerName, setNewLayerName] = useState("");

  const handleAddLayer = async () => {};

  return (
    <TabsContent value="layers" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Layer Management</CardTitle>
          <CardDescription>Add and reorder layers for your collection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={newLayerName}
              onChange={(e) => setNewLayerName(e.target.value)}
              placeholder="Enter new layer name"
              className="flex-1"
            />
            <Button onClick={handleAddLayer} disabled={!newLayerName.trim()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Layer
            </Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="font-medium">Existing Layers</h3>
            {collection.objectData.content.fields.layer_types.fields.contents.length === 0 ? (
              <p className="text-muted-foreground text-sm">No layers added yet</p>
            ) : (
              <div className="space-y-2">
                {collection.objectData.content.fields.layer_types.fields.contents.map(
                  (layer, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-md border p-2"
                    >
                      <span>{layer.fields.type}</span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          // onClick={() => handleMoveLayer(index, "up")}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          // onClick={() => handleMoveLayer(index, "down")}
                          // disabled={index === layers.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
            {/* <SortableList></SortableList> */}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
