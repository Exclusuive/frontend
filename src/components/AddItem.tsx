import { zodResolver } from "@hookform/resolvers/zod";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import ImageUpload from "./ui/image-upload";
import { Input } from "./ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Textarea } from "./ui/textarea";
import AttributeInput from "./ui/attribute-input";
import { Button } from "./ui/button";
import { Collection } from "@/types/collection";
import { useAddItem } from "@/hooks/moveCall/useAddItem";
import { useEffect } from "react";
import { useCollectionStore } from "@/stores/useCollectionStore";

interface AddItemProps {
  category: string;
  collection: Collection;
  onOpenChange: (open: boolean) => void;
}

const itemSchema = z.object({
  name: z.string(),
  imgUrl: z.string(),
  layer: z.string(),
  description: z.string().optional(),
  attributes: z.array(
    z.object({
      name: z.string(),
      value: z.number(),
    }),
  ),
});

export type ItemCreateFormData = z.infer<typeof itemSchema>;

const AddItem = ({ category, collection, onOpenChange }: AddItemProps) => {
  const { addItem, result } = useAddItem();
  const { addItemToCollection } = useCollectionStore();
  const { register, handleSubmit, setValue, watch, reset } = useForm<ItemCreateFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: "",
      imgUrl: "",
      layer: category,
      description: "",
      attributes: [],
    },
  });
  const imageUrl = watch("imgUrl");
  const attributes = watch("attributes");

  const handleAttributesChange = (newAttributes: Array<{ name: string; value: number }>) => {
    setValue("attributes", newAttributes);
  };

  const onSubmit = (data: ItemCreateFormData) => {
    addItem({
      collection_id: collection.collection_id,
      collection_cap_id: collection.collection_cap_id,
      name: data.name,
      description: data.description,
      img_url: data.imgUrl,
      layer: data.layer,
      attributes: data.attributes,
    });
    reset();
  };

  useEffect(() => {
    if (result) {
      console.log(result);
      addItemToCollection(result);
      onOpenChange(false);
    }
  }, [result]);

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
          showUrl={true}
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

        <AttributeInput
          label="Item Attributes"
          attributes={attributes || []}
          attributeNameOptions={collection?.attributes || []}
          isEditing={true}
          valuePlaceholder="Attribute value"
          onAttributesChange={handleAttributesChange}
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
