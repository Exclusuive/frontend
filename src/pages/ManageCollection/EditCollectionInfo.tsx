import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetCollection } from "@/hooks/useGetCollection";
import { useSendTransactions } from "@/hooks/useSendTransactions";
import { CollectionWithDetails } from "@/types/types";

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Icons
import { ArrowUp, ArrowDown, Plus, Upload } from "lucide-react";

export default function EditCollectionInfo() {
  const [searchParams] = useSearchParams();
  const collectionId = searchParams.get("collection_id");
  const capId = searchParams.get("cap_id");
  const { collection, loading } = useGetCollection(collectionId || "", capId || "");
  const { updateCollectionInfo, addLayer, reorderLayers, addPropertyType, addTicketType } =
    useSendTransactions();

  // State for collection information
  const [collectionInfo, setCollectionInfo] = useState<CollectionWithDetails | null>(null);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  // State for layer management
  const [newLayerName, setNewLayerName] = useState("");
  const [layers, setLayers] = useState<string[]>([]);

  // State for property type management
  const [newPropertyType, setNewPropertyType] = useState("");
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);

  // State for ticket type management
  const [newTicketType, setNewTicketType] = useState("");
  const [ticketTypes, setTicketTypes] = useState<string[]>([]);

  // Initialize state when collection data is loaded
  useEffect(() => {
    if (collection) {
      setCollectionInfo(collection);
      setDescription(collection.description || "");
      setImagePreview(collection.img_url || "");
      setLayers(collection.layer_types || []);
      setPropertyTypes(collection.property_types || []);
      setTicketTypes(collection.ticket_types || []);
    }
  }, [collection]);

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle collection information update
  const handleUpdateCollectionInfo = async () => {
    if (!collectionId || !capId) {
      return;
    }

    try {
      await updateCollectionInfo({
        id: collectionId,
        capId: capId,
        collectionName: collectionInfo?.name || "",
        description: description,
        img: imageFile,
      });
    } catch (error) {
      console.error("Error updating collection info:", error);
    }
  };

  // Handle adding a new layer
  const handleAddLayer = async () => {
    if (!collectionId || !capId || !newLayerName.trim()) {
      return;
    }

    try {
      const res = await addLayer({
        id: collectionId,
        capId: capId,
        layerName: newLayerName.trim(),
      });

      if (res.success) {
        setLayers([...layers, newLayerName.trim()]);
        setNewLayerName("");
      }
    } catch (error) {
      console.error("Error adding layer:", error);
    }
  };

  // Handle reordering layers
  const handleMoveLayer = async (index: number, direction: "up" | "down") => {
    if (!collectionId || !capId) return;

    const newLayers = [...layers];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= layers.length) return;

    // Swap layers
    [newLayers[index], newLayers[newIndex]] = [newLayers[newIndex], newLayers[index]];

    try {
      const res = await reorderLayers({
        id: collectionId,
        capId: capId,
        layers: newLayers,
      });

      console.log(res);

      if (res.success) {
        setLayers(newLayers);
      }
    } catch (error) {
      console.error("Error reordering layers:", error);
    }
  };

  // Handle adding a new property type
  const handleAddPropertyType = async () => {
    if (!collectionId || !capId || !newPropertyType.trim()) {
      return;
    }

    try {
      const res = await addPropertyType({
        id: collectionId,
        capId: capId,
        propertyType: newPropertyType.trim(),
      });

      if (res.success) {
        setPropertyTypes([...propertyTypes, newPropertyType.trim()]);
        setNewPropertyType("");
      }
    } catch (error) {
      console.error("Error adding property type:", error);
    }
  };

  // Handle adding a new ticket type
  const handleAddTicketType = async () => {
    if (!collectionId || !capId || !newTicketType.trim()) {
      return;
    }

    try {
      const res = await addTicketType({
        id: collectionId,
        capId: capId,
        ticketType: newTicketType.trim(),
      });

      if (res.success) {
        setTicketTypes([...ticketTypes, newTicketType.trim()]);
        setNewTicketType("");
      }
    } catch (error) {
      console.error("Error adding ticket type:", error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  if (!collection) {
    return <div className="flex items-center justify-center p-8">Collection not found</div>;
  }

  return (
    <div className="container mx-auto space-y-6 p-4">
      <h1 className="text-2xl font-bold">Edit Collection Information</h1>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="info">Collection Info</TabsTrigger>
          <TabsTrigger value="layers">Layers</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
        </TabsList>

        {/* Collection Information Tab */}
        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Collection Information</CardTitle>
              <CardDescription>Update your collection's basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="collection-image">Collection Image</Label>
                <div className="flex items-center gap-4">
                  <div className="h-40 w-40 overflow-hidden rounded-md border">
                    <img
                      src={imagePreview || collection.img_url}
                      alt="Collection"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" className="w-fit">
                      <label
                        htmlFor="image-upload"
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Upload Image</span>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    </Button>
                    {imageFile && (
                      <p className="text-muted-foreground text-sm">Selected: {imageFile.name}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter collection description"
                  className="min-h-[100px]"
                />
              </div>

              <Button onClick={handleUpdateCollectionInfo} className="w-full">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Layers Tab */}
        <TabsContent value="layers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Layer Management</CardTitle>
              <CardDescription>Add and reorder layers for your collection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                {layers.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No layers added yet</p>
                ) : (
                  <div className="space-y-2">
                    {layers.map((layer, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-md border p-2"
                      >
                        <span>{layer}</span>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMoveLayer(index, "up")}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMoveLayer(index, "down")}
                            disabled={index === layers.length - 1}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Properties Tab */}
        <TabsContent value="properties" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Property Types</CardTitle>
              <CardDescription>Manage property types for your collection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newPropertyType}
                  onChange={(e) => setNewPropertyType(e.target.value)}
                  placeholder="Enter new property type"
                  className="flex-1"
                />
                <Button onClick={handleAddPropertyType} disabled={!newPropertyType.trim()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Property
                </Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-medium">Existing Property Types</h3>
                {propertyTypes.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No property types added yet</p>
                ) : (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                    {propertyTypes.map((property, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-md border p-2"
                      >
                        <span>{property}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tickets Tab */}
        <TabsContent value="tickets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Types</CardTitle>
              <CardDescription>Manage ticket types for your collection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newTicketType}
                  onChange={(e) => setNewTicketType(e.target.value)}
                  placeholder="Enter new ticket type"
                  className="flex-1"
                />
                <Button onClick={handleAddTicketType} disabled={!newTicketType.trim()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Ticket
                </Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-medium">Existing Ticket Types</h3>
                {ticketTypes.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No ticket types added yet</p>
                ) : (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                    {ticketTypes.map((ticket, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-md border p-2"
                      >
                        <span>{ticket}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
