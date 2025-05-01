import { CollectionData } from "@/types/collection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import SortableItem from "./SortableItem";

type Props = {
  collection: CollectionData;
} & React.ComponentProps<typeof TabsPrimitive.Content>;

export default function LayerInfo({ collection, ...props }: Props) {
  const [newLayerName, setNewLayerName] = useState("");
  const [layers, setLayers] = useState(
    collection.objectData.content.fields.layer_types.fields.contents.map((l) => l.fields.type)
  );

  const handleAddLayer = async () => {};

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id && over) {
      const oldIndex = layers.indexOf(active.id.toString());
      const newIndex = layers.indexOf(over.id.toString());
      setLayers(arrayMove(layers, oldIndex, newIndex));
      console.log("Tx!!", `swap from ${oldIndex} to ${newIndex}`);
    }
  };

  return (
    <TabsContent {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Layer Management</CardTitle>
          <CardDescription>Add and reorder layers for your collection</CardDescription>
        </CardHeader>

        <CardContent className="flex gap-2">
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
        </CardContent>

        <CardHeader>
          <CardTitle>Existing Layers</CardTitle>
        </CardHeader>

        <CardContent>
          {collection.objectData.content.fields.layer_types.fields.contents.length === 0 ? (
            <CardDescription>No layers added yet</CardDescription>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={layers} strategy={verticalListSortingStrategy}>
                <div className="flex w-full flex-col space-y-2">
                  {layers.map((layer) => (
                    <SortableItem key={layer} name={layer} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
