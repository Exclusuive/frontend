import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CollectionData } from "@/types/collection";

interface Props {
  collection: CollectionData;
}

export default function TicketInfo({ collection }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ticket</CardTitle>
        <CardDescription>Ticket Description</CardDescription>
      </CardHeader>
      <CardContent>
        <Label htmlFor="collection-image">Collection Image</Label>
      </CardContent>
    </Card>
  );
}
