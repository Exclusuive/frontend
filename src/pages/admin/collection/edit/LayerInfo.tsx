import { CollectionData } from "@/types/collection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useContext, useEffect, useState } from "react";
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
import SortableItem from "./SortableItem";
import { useAddLayerType } from "@/hooks/moveCall/collection";
import { CollectionContext } from "@/context/CollectionContext";

export default function LayerInfo() {
  const [newLayerName, setNewLayerName] = useState("");
  const [currentCollection, setCurrentCollection] = useState<CollectionData>();
  const [layers, setLayers] = useState<string[]>();

  const {
    collection: { collections, index },
  } = useContext(CollectionContext);
  const { addLayerType } = useAddLayerType();

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    if (collections && index !== -1) {
      setCurrentCollection(collections[index]);
    }
  }, [collections, index]);

  useEffect(() => {
    if (currentCollection) {
      setLayers(
        currentCollection.objectData.content.fields.layer_types.fields.contents.map(
          (l) => l.fields.type
        )
      );
    }
  }, [currentCollection]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id && over && layers) {
      const oldIndex = layers.indexOf(active.id.toString());
      const newIndex = layers.indexOf(over.id.toString());
      setLayers(arrayMove(layers, oldIndex, newIndex));
      console.log("Tx!!", `swap from ${oldIndex} to ${newIndex}`);
    }
  };

  return (
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
        <Button
          onClick={() => {
            addLayerType({ typeName: newLayerName });
            setNewLayerName("");
          }}
          disabled={!newLayerName.trim()}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Layer Type
        </Button>
      </CardContent>

      <CardHeader>
        <CardTitle>Existing Layers</CardTitle>
      </CardHeader>

      <CardContent>
        {currentCollection &&
        currentCollection.objectData.content.fields.layer_types.fields.contents.length === 0 ? (
          <CardDescription>No layers added yet</CardDescription>
        ) : (
          layers && (
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
          )
        )}
      </CardContent>
    </Card>
  );
}
