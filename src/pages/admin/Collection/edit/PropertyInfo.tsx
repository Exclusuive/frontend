import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CollectionData } from "@/types/collection";

interface Props {
  collection: CollectionData;
}

export default function PropertyInfo({ collection }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Property</CardTitle>
        <CardDescription>Property Description</CardDescription>
      </CardHeader>
      <CardContent>
        <Label htmlFor="collection-image">Collection Image</Label>
      </CardContent>
    </Card>
  );
}
