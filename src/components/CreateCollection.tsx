import { DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import ImageUpload from "./ui/image-upload";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import TagInput from "./ui/tag-input";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCollectionStore } from "@/stores/useCollectionStore";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCreateCollection } from "@/hooks/moveCall/useCreateCollection";
import { useEffect } from "react";

const collectionSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  img_url: z.string().optional(),
  layers: z.array(z.string()).optional(),
});

export type CollectionCreateFormData = z.infer<typeof collectionSchema>;

const CreateCollection = ({ onOpenChange }: { onOpenChange: (open: boolean) => void }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createCollection, result } = useCreateCollection();
  const { setCollection } = useCollectionStore();
  const { register, handleSubmit, setValue, watch, control } = useForm<CollectionCreateFormData>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      name: "",
      description: "",
      img_url: "",
      layers: [],
    },
  });

  const onSubmit = (data: CollectionCreateFormData) => {
    createCollection({
      name: data.name,
      description: data.description,
      img_url: data.img_url,
      layers: data.layers || [],
    });
  };

  useEffect(() => {
    if (result) {
      setCollection(result);
      onOpenChange(false);
      navigate(`/${user?.role}`);
    }
  }, [result]);

  // 이미지 URL 실시간 반영
  const imageUrl = watch("img_url");

  return (
    <DialogContent className="h-3/4 overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Create Collection</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <ImageUpload
          currentImageUrl={imageUrl || ""}
          onImageChange={(url: string) => setValue("img_url", url)}
          isEditing={true}
          className="w-full"
          showUrl={true}
        />
        <label className="block text-sm font-medium text-gray-700">Collection Name</label>

        <Input
          placeholder="Collection Name"
          aria-label="Collection Name"
          {...register("name", { required: true })}
        />
        <label className="block text-sm font-medium text-gray-700">Collection Description</label>
        <Textarea
          placeholder="Collection Description"
          aria-label="Collection Description"
          rows={3}
          {...register("description")}
        />
        {/* Layers */}
        <Controller
          control={control}
          name="layers"
          render={({ field }) => (
            <TagInput
              label="Layers"
              tags={field.value || []}
              onTagsChange={field.onChange}
              isEditing={true}
              placeholder="Layer name"
            />
          )}
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

export default CreateCollection;
