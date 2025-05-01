import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload } from "lucide-react";
import SelectCollectionModal from "../SelectCollectionModal";
import { useContext, useEffect, useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CreateCollectionModal } from "../CreateCollectionModal";
import { CollectionContext } from "@/context/CollectionContext";

interface Props {}

export default function EditCollection({}: Props) {
  const [isCreateCollectionOpen, setIsCreateCollectionOpen] = useState(false);
  const [isSelectCollectionOpen, setIsSelectCollectionOpen] = useState(false);

  const { collections, index } = useContext(CollectionContext);

  useEffect(() => {
    console.log("finally", collections);
    console.log("finally index", index);
  }, [collections, index]);

  return (
    <div className="container w-full space-y-6 p-4">
      <h1 className="text-2xl font-bold">Edit Collection Information</h1>
      <Dialog open={isSelectCollectionOpen} onOpenChange={setIsSelectCollectionOpen}>
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
                      // src={imagePreview || collection.img_url}
                      src={""}
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
                          // onChange={handleImageChange}
                        />
                      </label>
                    </Button>
                    {/* {imageFile && (
                      <p className="text-muted-foreground text-sm">Selected: {imageFile.name}</p>
                    )} */}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  // value={description}
                  value={""}
                  // onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter collection description"
                  className="min-h-[100px]"
                />
              </div>

              {/* <Button onClick={handleUpdateCollectionInfo} className="w-full"> */}
              <Button onClick={() => {}} className="w-full">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

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
      <Dialog open={isCreateCollectionOpen} onOpenChange={setIsCreateCollectionOpen}>
        <DialogTrigger>Create</DialogTrigger>
        <CreateCollectionModal isOpen={isCreateCollectionOpen} />
      </Dialog>
    </div>
  );
}
