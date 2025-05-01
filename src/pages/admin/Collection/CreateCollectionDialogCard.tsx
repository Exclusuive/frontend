import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";

interface CreateCollectionForm {
  name: string;
  description: string;
  bannerImg: File | null;
}

interface Props {
  isOpen: boolean;
}

export const CreateCollectionDialogCard = ({ isOpen }: Props) => {
  const [formData, setFormData] = useState<CreateCollectionForm>({
    name: "",
    description: "",
    bannerImg: null,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [layers, setLayers] = useState<string[]>([]);

  useEffect(() => {
    resetForm();
  }, [isOpen]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      bannerImg: null,
    });
    setPreviewUrl(null);
    setLayers([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFormData((prev) => ({ ...prev, bannerImg: file }));

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Handle form submission
  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // const { success, result, error } = await newCollection(formData);
      // if (!success) {
      //   throw error;
      // }
      // setOpen(false);
      // const { collection, collectionCap } = parseCreateCollectionFromCreatedObject(result);
      // onSuccess(collection, collectionCap);
      resetForm();
    } catch (error) {
      console.error("Failed to create collection:", error);
    }
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Create Collection</DialogTitle>
        <DialogDescription>Create a new collection with layers.</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleCreateCollection} className="space-y-4">
        {/* Collection Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Collection Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="My Collection"
            required
          />
        </div>

        {/* Banner Image */}
        <div className="space-y-2">
          <Label htmlFor="bannerImg">Banner Image</Label>
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
          {previewUrl && (
            <div className="mt-2 aspect-video h-52 w-full overflow-hidden rounded-md border">
              <img src={previewUrl} alt="Banner preview" className="h-full w-full object-cover" />
            </div>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="A collection of my awesome items"
            className="resize-none"
            rows={3}
          />
        </div>

        {/* Layer Options */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Layer Options</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setLayers((prev) => [...prev, ""])}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Layer
            </Button>
          </div>
          <div className="max-h-48 space-y-2 overflow-auto">
            {layers.map((layer, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  value={layer}
                  onChange={(e) => {
                    setLayers((prev) => [
                      ...prev.slice(0, i),
                      e.target.value,
                      ...prev.slice(i + 1),
                    ]);
                  }}
                  placeholder="Layer name"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setLayers((prev) => [...prev.slice(0, i), ...prev.slice(i + 1)])}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {layers.length === 0 && (
              <p className="text-muted-foreground text-sm">
                No layers added yet. Click "Add Layer" to create one.
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button type="submit">Create Collection</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
