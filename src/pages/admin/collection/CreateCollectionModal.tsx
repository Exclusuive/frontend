import { useEffect, useId, useState } from "react";
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
import { useCreateCollection } from "@/hooks/moveCall/collection";
import { DialogClose } from "@radix-ui/react-dialog";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateCollectionModal = ({ isOpen, onOpenChange }: Props) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [imageFile, setImageFile] = useState<File>();
  const [layers, setLayers] = useState<string[]>([]);

  const { createCollection } = useCreateCollection();

  const inputId = useId();

  useEffect(() => {
    resetForm();
  }, [isOpen]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setImageFile(undefined);
    setLayers([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImageFile(file);
    }
  };

  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto p-6 sm:max-w-[600px]">
      <DialogHeader className="pb-4">
        <DialogTitle>Create Collection</DialogTitle>
        <DialogDescription>Create a new collection with layers.</DialogDescription>
      </DialogHeader>

      <form
        // onSubmit={(e) => {
        //   e.preventDefault();
        //   try {
        //     createCollection({ collectionName: name, description: "", bannerImgURL: "", layers });
        //   } catch (err) {
        //     console.error("Failed to create collection:", err);
        //   } finally {
        //     resetForm();
        //   }
        // }}
        className="max-h-[500px] space-y-6 overflow-auto pr-4 pl-2"
      >
        {/* Collection Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Collection Name</Label>
          <Input
            id="name"
            name="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="My Collection"
            required
          />
        </div>

        {/* Banner Image */}
        <div className="space-y-2">
          <Label htmlFor={`bannerImg` + inputId}>Banner Image</Label>
          <div className="flex flex-col items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => document.getElementById("bannerImg" + inputId)?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
            <Input
              id={`bannerImg` + inputId}
              name="bannerImg"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          {imageFile && (
            <div className="mt-2 aspect-video h-52 w-full overflow-hidden rounded-md border">
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Banner preview"
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
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
          <div className="space-y-2">
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
          <DialogClose>
            <Button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                try {
                  createCollection({
                    collectionName: name,
                    description: description,
                    bannerImgURL: "",
                    layers,
                  });
                  onOpenChange(false);
                } catch (err) {
                  console.error("Failed to create collection:", err);
                } finally {
                  resetForm();
                }
              }}
            >
              Create Collection
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
