import { zodResolver } from "@hookform/resolvers/zod";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import ImageUpload from "./ui/image-upload";
import { Input } from "./ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Textarea } from "./ui/textarea";
import AttributeInput from "./ui/attribute-input";
import { Button } from "./ui/button";
import { Attribute, Collection } from "@/types/collection";

interface AddItemProps {
  category: string;
  onSubmit: (data: ItemCreateFormData) => void;
  collection: Collection;
}

const itemSchema = z.object({
  name: z.string(),
  imgUrl: z.string(),
  layer: z.string(),
  description: z.string().optional(),
  attributes: z.array(
    z.object({
      name: z.string(),
      value: z.string(),
    }),
  ),
});

export type ItemCreateFormData = z.infer<typeof itemSchema>;

const AddItem = ({ category, onSubmit, collection }: AddItemProps) => {
  const { register, handleSubmit, setValue, watch } = useForm<ItemCreateFormData>({
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

  const handleAttributesChange = (newAttributes: Attribute[]) => {
    setValue("attributes", newAttributes);
  };

  return (
    <DialogContent className="h-fit overflow-y-auto">
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
        <div>
          <label className="block text-sm font-medium text-gray-700">Item Description (Pro)</label>
          <Textarea
            placeholder="Item Description"
            aria-label="Item Description"
            rows={2}
            {...register("description")}
          />

          <AttributeInput
            label="Item Attributes (Pro)"
            attributes={attributes || []}
            attributeNameOptions={collection?.attribute_types || []}
            isEditing={true}
            valuePlaceholder="Attribute value"
            onAttributesChange={handleAttributesChange}
          />
        </div>

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
