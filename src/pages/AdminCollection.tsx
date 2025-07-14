import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCollectionStore } from "@/stores/useCollectionStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit3, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import TagInput from "@/components/ui/tag-input";
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { useMintMembership, useUpdateCollection } from "exclusuive-typescript-sdk";
import { toast } from "sonner";

// Validation schema for collection form
const collectionSchema = z.object({
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  imgUrl: z.string().optional(),
  layer_types: z.array(z.string()).optional(),
  attribute_types: z.array(z.string()).optional(),
  ticket_types: z.array(z.string()).optional(),
});

export type CollectionFormData = z.infer<typeof collectionSchema>;

const AdminCollection = () => {
  const { collection, updateCollection: updateCollectionStore } = useCollectionStore();
  const [isEditing, setIsEditing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [mintAddress, setMintAddress] = useState<string>("");
  // Temporary state for tags
  const [tempLayers, setTempLayers] = useState<string[]>([]);
  const [tempAttributes, setTempAttributes] = useState<string[]>([]);
  const [tempTickets, setTempTickets] = useState<string[]>([]);

  const { updateCollection, isPending, error, result } = useUpdateCollection();
  const {
    mintMembership,
    isPending: isMinting,
    error: mintError,
    result: mintResult,
  } = useMintMembership();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
    trigger,
    getValues,
  } = useForm<CollectionFormData>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      description: collection?.configs?.description || "",
      imgUrl: collection?.configs?.img_url || "",
      layer_types: collection?.layer_types || [],
      attribute_types: collection?.attribute_types || [],
      ticket_types: collection?.ticket_types || [],
    },
  });

  // Update form when collection changes
  useEffect(() => {
    if (collection) {
      reset({
        description: collection.configs?.description,
        imgUrl: collection.configs?.img_url,
        layer_types: collection.layer_types || [],
        attribute_types: collection.attribute_types || [],
        ticket_types: collection.ticket_types || [],
      });
      // Reset temporary states
      setTempLayers(collection.layer_types || []);
      setTempAttributes(collection.attribute_types || []);
      setTempTickets(collection.ticket_types || []);
    }
  }, [collection, reset]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
    setUploadedFile(null);
    // Reset temporary states to original values
    if (collection) {
      setTempLayers(collection.layer_types || []);
      setTempAttributes(collection.attribute_types || []);
      setTempTickets(collection.ticket_types || []);
    }
  };

  const handleSave = (data: CollectionFormData) => {
    const layerChange = tempLayers.filter((layer) => !collection?.layer_types?.includes(layer));
    const attributeChange = tempAttributes.filter(
      (attribute) => !collection?.attribute_types?.includes(attribute),
    );
    const ticketChange = tempTickets.filter(
      (ticket) => !collection?.ticket_types?.includes(ticket),
    );

    const descriptionChange =
      data.description !== collection?.configs?.description ? data.description : null;
    const imgUrlChange = data.imgUrl !== collection?.configs?.img_url ? data.imgUrl : null;

    if (collection) {
      const updateData = {
        col: collection?.id || "",
        cap: collection?.cap || "",
        name: collection?.name || "",
        description: descriptionChange || undefined,
        img_url: imgUrlChange || undefined,
        layer_types: layerChange,
        attribute_types: attributeChange,
        ticket_types: ticketChange,
      };
      updateCollection(updateData);
      setIsEditing(false);
      setUploadedFile(null);
    }
  };

  useEffect(() => {
    if (isPending) {
      toast.loading("Collection is being updated...");
    }
    if (result) {
      toast.dismiss();
      toast.success("Collection updated successfully");

      updateCollectionStore({
        ...collection,
        configs: {
          description: result?.description || collection?.configs?.description,
          img_url: result?.img_url || collection?.configs?.img_url,
        },
        layer_types: tempLayers || collection?.layer_types,
        attribute_types: tempAttributes || collection?.attribute_types,
        ticket_types: tempTickets || collection?.ticket_types,
      });
    } else if (error) {
      toast.dismiss();
      toast.error("Failed to update collection");
      handleCancel();
    }
  }, [isPending, result, error]);

  useEffect(() => {
    if (isMinting) {
      toast.loading("Minting membership...");
    }
    if (mintResult) {
      toast.dismiss();
      toast.success("Membership minted successfully");
    } else if (mintError) {
      toast.dismiss();
      toast.error("Failed to mint membership");
    }
  }, [isMinting, mintResult, mintError]);

  const handleImageChange = (imageUrl: string, file?: File) => {
    setValue("imgUrl", imageUrl, { shouldDirty: true, shouldTouch: true });
    setUploadedFile(file || null);
    trigger("imgUrl");
  };

  // Temporary tag change handlers
  const handleTempLayersChange = (layers: string[]) => {
    setTempLayers(layers);
  };

  const handleTempAttributesChange = (attributes: string[]) => {
    setTempAttributes(attributes);
  };

  const handleTempTicketsChange = (tickets: string[]) => {
    setTempTickets(tickets);
  };

  const onMintAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMintAddress(e.target.value);
  };

  const onMint = () => {
    mintMembership({
      col: collection?.id || "",
      cap: collection?.cap || "",
      img_url: "asdfasdfsdv",
      recipient: mintAddress,
    });
  };

  if (!collection) {
    return (
      <div className="flex flex-col gap-4 p-10">
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <p className="mb-2 text-lg font-medium text-gray-600">No Collection Selected</p>
              <p className="text-sm text-gray-500">
                Please select a collection to view and edit its information.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-10">
      <div className="grid grid-cols-1 gap-6">
        <Card className="mx-auto w-full md:w-2/3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Collection Details</CardTitle>
                <CardDescription>Basic information about the collection</CardDescription>
              </div>
              {!isEditing && (
                <Button
                  onClick={handleEdit}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
              <div className="flex flex-col gap-2 transition-all duration-300 ease-in-out xl:flex-row">
                {/* Image Section */}
                <div className="w-full xl:w-1/2">
                  <ImageUpload
                    currentImageUrl={
                      (isPending ? getValues("imgUrl") : collection.configs?.img_url) || ""
                    }
                    onImageChange={handleImageChange}
                    isEditing={isEditing}
                  />
                </div>

                {/* Details Section */}
                <div className="flex w-full flex-col gap-y-4 p-4 xl:w-1/2">
                  {/* Collection Name */}
                  <div>
                    <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
                      Collection Name
                    </label>

                    <p className="text-sm text-[#636363]">{collection.name}</p>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    {isEditing ? (
                      <div>
                        <Textarea
                          id="description"
                          {...register("description")}
                          rows={3}
                          className={cn(
                            errors.description && "border-red-500 focus:border-red-500",
                          )}
                          placeholder="Enter collection description"
                        />
                        {errors.description && (
                          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-[#636363]">{collection.configs?.description}</p>
                    )}
                  </div>

                  {/* Layers */}
                  <TagInput
                    label="Layers"
                    tags={tempLayers}
                    onTagsChange={handleTempLayersChange}
                    isEditing={isEditing}
                    placeholder="Layer name"
                  />

                  {/* Attributes */}
                  <TagInput
                    label="Attributes"
                    tags={tempAttributes}
                    onTagsChange={handleTempAttributesChange}
                    isEditing={isEditing}
                    placeholder="Attribute name"
                  />

                  {/* Tickets */}
                  <TagInput
                    label="Tickets"
                    tags={tempTickets}
                    onTagsChange={handleTempTicketsChange}
                    isEditing={isEditing}
                    placeholder="Ticket name"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex items-center gap-2 pt-4">
                  <Button
                    type="submit"
                    disabled={
                      !isDirty &&
                      !uploadedFile &&
                      JSON.stringify(tempLayers) ===
                        JSON.stringify(collection?.layer_types || []) &&
                      JSON.stringify(tempAttributes) ===
                        JSON.stringify(collection?.attribute_types || []) &&
                      JSON.stringify(tempTickets) === JSON.stringify(collection?.ticket_types || [])
                    }
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
          <div className="flex flex-col gap-2 border-t pt-8">
            <CardHeader>
              <CardTitle className="text-xl">Mint new membership</CardTitle>
              <CardDescription>Directly mint new membership to user.</CardDescription>
            </CardHeader>
            <CardContent className="mt-3">
              <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
                <Input
                  onChange={onMintAddressChange}
                  placeholder="Enter user address"
                  value={mintAddress}
                />
                <Button
                  onClick={onMint}
                  className="w-fit bg-blue-600 hover:bg-blue-700"
                  disabled={!mintAddress}
                >
                  Mint
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminCollection;
