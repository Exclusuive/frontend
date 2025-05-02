import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CollectionData } from "@/types/collection";
import { Plus } from "lucide-react";
import { useState } from "react";

interface Props {
  collection: CollectionData;
}

export default function PropertyInfo({ collection }: Props) {
  const [newPropertyType, setNewPropertyType] = useState("");
  const [propertyTypes, setProeprtyTypes] = useState(
    collection.objectData.content.fields.property_types.fields.contents.map((l) => l.fields.type)
  );

  const handleAddPropertyType = async () => {
    console.log("TX!");
  };
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
        <Button onClick={handleAddPropertyType} disabled={!newPropertyType.trim()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Property Type
        </Button>
      </CardContent>

      <CardHeader>
        <CardTitle>Existing Property Types</CardTitle>
      </CardHeader>

      <CardContent>
        {propertyTypes.length === 0 ? (
          <p className="text-muted-foreground text-sm">No property types added yet</p>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
            {propertyTypes.map((property, index) => (
              <div key={index} className="flex items-center justify-between rounded-md border p-2">
                <span>{property}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
