import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload } from "lucide-react";
import SelectCollectionModal from "../SelectCollectionModal";
import { useContext, useEffect, useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CollectionContext } from "@/context/CollectionContext";
import { CollectionData } from "@/types/collection";
import CollectionImg from "../CollectionImg";
import { Input } from "@/components/ui/input";

interface Props {}

export default function EditCollection({}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentCollection, setCurrentCollection] = useState<CollectionData>();
  const [imageFile, setImageFile] = useState<File>();
  const [description, setDescription] = useState("");

  const { collections, index } = useContext(CollectionContext);

  useEffect(() => {
    console.log("finally", collections);
    console.log("finally index", index);
    if (collections) {
      setCurrentCollection(collections[index]);
    }
  }, [collections, index]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImageFile(file);
    }
  };
  return (
    <div className="container w-full space-y-6 p-4">
      <h1 className="text-2xl font-bold">Edit Collection Information</h1>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>
          <Button>Select Collection</Button>
        </DialogTrigger>
        <SelectCollectionModal />
      </Dialog>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="info">Collection Info</TabsTrigger>
          <TabsTrigger value="layers">Layers</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
        </TabsList>

        {currentCollection && (
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
                      {imageFile ? (
                        <img
                          src={URL.createObjectURL(imageFile)}
                          alt="Banner preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <CollectionImg collection={currentCollection} alt="Collection Image" />
                      )}
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => document.getElementById("bannerImg")?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Image
                      </Button>
                      <Input
                        id="bannerImg"
                        name="bannerImg"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
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

                {/* <Button onClick={handleUpdateCollectionInfo} className="w-full"> */}
                <Button onClick={() => {}} className="w-full">
                  Update Collection Info
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="layers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Layers</CardTitle>
              <CardDescription>Layer Description</CardDescription>
            </CardHeader>
            <CardContent>
              <Label htmlFor="collection-image">Collection Image</Label>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="properties" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Property</CardTitle>
              <CardDescription>Property Description</CardDescription>
            </CardHeader>
            <CardContent>
              <Label htmlFor="collection-image">Collection Image</Label>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tickets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ticket</CardTitle>
              <CardDescription>Ticket Description</CardDescription>
            </CardHeader>
            <CardContent>
              <Label htmlFor="collection-image">Collection Image</Label>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
