import { zodResolver } from "@hookform/resolvers/zod";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import ImageUpload from "./ui/image-upload";
import { Input } from "./ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Textarea } from "./ui/textarea";
import PropertyInput from "./ui/property-input";
import { Button } from "./ui/button";
import { useCollectionStore } from "@/stores/useCollectionStore";

interface AddItemProps {
  layer: string;
  onOpenChange: (open: boolean) => void;
}

const itemSchema = z.object({
  name: z.string(),
  imgUrl: z.string(),
  layer: z.string(),
  description: z.string().optional(),
  properties: z.array(
    z.object({
      name: z.string(),
      value: z.string(),
    }),
  ),
});

export type ItemCreateFormData = z.infer<typeof itemSchema>;

const AddItem = ({ layer, onOpenChange }: AddItemProps) => {
  const { collection, setCollection } = useCollectionStore();
  const { register, handleSubmit, setValue, watch } = useForm<ItemCreateFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: "",
      imgUrl: "",
      layer: layer,
      description: "",
      properties: [],
    },
  });
  const imageUrl = watch("imgUrl");
  const properties = watch("properties");

  const onSubmit = (data: ItemCreateFormData) => {
    onOpenChange(false);
    if (collection) {
      setCollection({
        ...collection,
        items: [...(collection.items || []), { ...data, address: "" }],
      });
    }
    console.log(data);
  };

  const handlePropertiesChange = (newProperties: Array<{ name: string; value: string }>) => {
    setValue("properties", newProperties);
  };

  return (
    <DialogContent className="h-3/4 overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Add Item</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <ImageUpload
          currentImageUrl={imageUrl || ""}
          onImageChange={(url: string) => setValue("imgUrl", url)}
          isEditing={true}
          className="w-full"
          showUrl={false}
        />
        <label className="block text-sm font-medium text-gray-700">Item Name</label>
        <Input
          placeholder="Item Name"
          aria-label="Item Name"
          {...register("name", { required: true })}
        />
        <label className="block text-sm font-medium text-gray-700">
          Item Description (Optional)
        </label>
        <Textarea
          placeholder="Item Description"
          aria-label="Item Description"
          rows={2}
          {...register("description")}
        />

        <PropertyInput
          label="Item Properties"
          properties={properties || []}
          propertyNameOptions={collection?.properties || []}
          isEditing={true}
          valuePlaceholder="Property value"
          onPropertiesChange={handlePropertiesChange}
        />

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#5656F2] to-[#4CA3FF] text-white sm:w-auto"
          >
            Confirm
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default AddItem;
