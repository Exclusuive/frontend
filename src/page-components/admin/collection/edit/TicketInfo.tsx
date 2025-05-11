import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CollectionContext } from "@/context/CollectionContext";
import { useAddTicketType } from "@/hooks/moveCall/collection";
import { CollectionData } from "@/types/collection";
import { Plus } from "lucide-react";
import { useContext, useEffect, useState } from "react";

export default function TicketInfo() {
  const [newTicketType, setNewTicketType] = useState("");
  const [currentCollection, setCurrentCollection] = useState<CollectionData>();
  const [ticketTypes, setTicketTypes] = useState<string[]>();

  const {
    collection: { collections, index },
  } = useContext(CollectionContext);

  const { addTicketType } = useAddTicketType();

  useEffect(() => {
    if (collections && index !== -1) {
      setCurrentCollection(collections[index]);
    }
  }, [collections, index]);

  useEffect(() => {
    if (currentCollection) {
      setTicketTypes(
        currentCollection.objectData.content.fields.ticket_types.fields.contents.map(
          (t) => t.fields.type
        )
      );
    }
  }, [currentCollection]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ticket Types</CardTitle>
        <CardDescription>Manage ticket types for your collection</CardDescription>
      </CardHeader>

      <CardContent className="flex gap-2">
        <Input
          value={newTicketType}
          onChange={(e) => setNewTicketType(e.target.value)}
          placeholder="Enter new ticket type"
          className="flex-1"
        />
        <Button
          onClick={() => {
            addTicketType({ typeName: newTicketType });
          }}
          disabled={!newTicketType.trim()}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Ticket Type
        </Button>
      </CardContent>

      <CardHeader>
        <CardTitle>Existing Ticket Types</CardTitle>
      </CardHeader>

      <CardContent>
        {ticketTypes && ticketTypes.length === 0 ? (
          <p className="text-muted-foreground text-sm">No ticket types added yet</p>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
            {ticketTypes &&
              ticketTypes.map((ticket, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-md border p-2"
                >
                  <span>{ticket}</span>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
