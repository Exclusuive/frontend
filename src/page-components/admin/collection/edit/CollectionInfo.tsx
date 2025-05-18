import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { useContext, useState } from "react";
import CollectionImg from "@/page-components/admin/collection/CollectionImg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateCollection } from "@/hooks/moveCall/collection";
import { CollectionContext } from "@/context/CollectionContext";
import { uploadToS3 } from "@/lib/utils";

export default function CollectionInfo() {
  const [imageFile, setImageFile] = useState<File>();
  const [description, setDescription] = useState("");

  const {
    collection: { collections, index },
  } = useContext(CollectionContext);

  const { updateCollectionInfo } = useUpdateCollection();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImageFile(file);
    }
  };
  return (
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
                collections &&
                index !== -1 && (
                  <CollectionImg collection={collections[index]} alt="Collection Image" />
                )
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

        <Button
          onClick={() => {
            if (imageFile) {
              const url =
                (collections &&
                  index !== -1 &&
                  collections[index].dynamicFieldData.find(
                    (d) => d.content.fields.value.fields.name === "img_url"
                  )?.content.fields.value.fields.content) ||
                "";

              uploadToS3({
                type: "collections",
                id: url.split("/").pop(),
                file: imageFile || null,
              });
            }
            updateCollectionInfo({ description });

            setImageFile(undefined);
            setDescription("");
          }}
          className="w-full"
        >
          Update Collection Info
        </Button>
      </CardContent>
    </Card>
  );
}
