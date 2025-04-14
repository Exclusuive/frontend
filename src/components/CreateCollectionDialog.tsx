import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { CollectionFormData, Layer } from "@/types/contract";
import { useSendTransactions } from "@/hooks/useSendTransactions";

interface CreateCollectionDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const CreateCollectionDialog = ({
  trigger,
  open: controlledOpen,
  onOpenChange,
}: CreateCollectionDialogProps) => {
  // State management
  const [internalOpen, setInternalOpen] = useState(false);
  const [formData, setFormData] = useState<CollectionFormData>({
    name: "",
    img_url: null,
    description: "",
    layers: [],
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { newCollection } = useSendTransactions();

  // Use controlled or uncontrolled state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: "",
      img_url: null,
      description: "",
      layers: [],
    });
    setPreviewUrl(null);
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFormData((prev) => ({ ...prev, img_url: file }));

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Layer management
  const handleAddLayer = () => {
    const newLayer: Layer = {
      id: Date.now().toString(),
      name: "",
    };
    setFormData((prev) => ({
      ...prev,
      layers: [...prev.layers, newLayer],
    }));
  };

  const handleRemoveLayer = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      layers: prev.layers.filter((layer) => layer.id !== id),
    }));
  };

  const handleLayerNameChange = (id: string, name: string) => {
    setFormData((prev) => ({
      ...prev,
      layers: prev.layers.map((layer) => (layer.id === id ? { ...layer, name } : layer)),
    }));
  };

  // Handle form submission
  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await newCollection(formData);
      if (!result.success) {
        throw result.error;
      }
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to create collection:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Collection
          </Button>
        )}
      </DialogTrigger> */}
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
              placeholder="A collection of my favorite items"
              className="resize-none"
              rows={3}
            />
          </div>

          {/* Layer Options */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Layer Options</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddLayer}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Layer
              </Button>
            </div>
            <div className="space-y-2">
              {formData.layers.map((layer) => (
                <div key={layer.id} className="flex items-center gap-2">
                  <Input
                    value={layer.name}
                    onChange={(e) => handleLayerNameChange(layer.id, e.target.value)}
                    placeholder="Layer name"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveLayer(layer.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {formData.layers.length === 0 && (
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
    </Dialog>
  );
};
