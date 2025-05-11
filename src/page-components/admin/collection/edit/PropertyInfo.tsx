import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CollectionContext } from "@/context/CollectionContext";
import { useAddPropertyType } from "@/hooks/moveCall/collection";
import { CollectionData } from "@/types/collection";
import { Plus } from "lucide-react";
import { useContext, useEffect, useState } from "react";

export default function PropertyInfo() {
  const [newPropertyType, setNewPropertyType] = useState("");
  const [currentCollection, setCurrentCollection] = useState<CollectionData>();
  const [propertyTypes, setProeprtyTypes] = useState<string[]>();

  const {
    collection: { collections, index },
  } = useContext(CollectionContext);

  const { addPropertyType } = useAddPropertyType();

  useEffect(() => {
    if (collections && index !== -1) {
      setCurrentCollection(collections[index]);
    }
  }, [collections, index]);

  useEffect(() => {
    if (currentCollection) {
      setProeprtyTypes(
        currentCollection.objectData.content.fields.property_types.fields.contents.map(
          (p) => p.fields.type
        )
      );
    }
  }, [currentCollection]);

  // const handleAddPropertyType = async () => {
  //   console.log("TX!");
  // };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Types</CardTitle>
        <CardDescription>Manage property types for your collection</CardDescription>
      </CardHeader>

      <CardContent className="flex gap-2">
        <Input
          value={newPropertyType}
          onChange={(e) => setNewPropertyType(e.target.value)}
          placeholder="Enter new property type"
          className="flex-1"
        />
        <Button
          onClick={() => {
            addPropertyType({ typeName: newPropertyType });
          }}
          disabled={!newPropertyType.trim()}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Property Type
        </Button>
      </CardContent>

      <CardHeader>
        <CardTitle>Existing Property Types</CardTitle>
      </CardHeader>

      <CardContent>
        {propertyTypes && propertyTypes.length === 0 ? (
          <p className="text-muted-foreground text-sm">No property types added yet</p>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
            {propertyTypes &&
              propertyTypes.map((property, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-md border p-2"
                >
                  <span>{property}</span>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
