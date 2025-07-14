import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Item } from "@/types/collection";
import LayerItemSelector from "./LayerItemSelector";

// Unified form schema
const productFormSchema = z.object({
  selectedLayer: z.string().optional(),
  selectedItem: z
    .object({
      address: z.string(),
      name: z.string(),
      img_url: z.string(),
      layer: z.string(),
      description: z.string().optional(),
      attributes: z
        .union([
          z.array(
            z.object({
              name: z.string(),
              value: z.string(),
            }),
          ),
          z.string(),
        ])
        .optional(),
    })
    .optional(),
  itemAmount: z.string().optional(),
  suiAmount: z.string().optional(),
  conditions: z.array(z.object({ name: z.string(), value: z.string() })).optional(),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

interface AddProductProps {
  isNew: boolean;
  items: Item[];
  layers?: string[];
  onSubmit: (data: ProductFormData) => void;
}

const AddProduct: React.FC<AddProductProps> = ({ isNew, items, layers = [], onSubmit }) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    clearErrors,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      selectedLayer: "",
      selectedItem: undefined,
      itemAmount: "0",
      suiAmount: "0",
      conditions: [],
    },
    mode: "onChange",
  });

  const watchedLayer = watch("selectedLayer");
  const watchedItem = watch("selectedItem");
  const watchedItemAmount = watch("itemAmount");
  const watchedSuiAmount = watch("suiAmount");

  const handleItemSelect = (item: Item) => {
    setValue("selectedItem", item, { shouldValidate: true });
    clearErrors("selectedItem");
  };

  const handleLayerChange = (layer: string) => {
    setValue("selectedLayer", layer, { shouldValidate: true });
    setValue("selectedItem", undefined, { shouldValidate: true });
    clearErrors(["selectedLayer", "selectedItem"]);
  };

  const isFormValid = isNew
    ? !!(watchedLayer && watchedItem && watchedItemAmount && watchedSuiAmount)
    : !!watchedSuiAmount;

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{isNew ? "Add New Product" : "Add more Products"}</DialogTitle>
        <DialogDescription>
          {isNew
            ? "Select a layer and item from the collection to mint"
            : "Enter the product details to mint"}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
        {isNew ? (
          <>
            <LayerItemSelector
              layers={layers}
              items={items}
              onItemSelect={handleItemSelect}
              selectedLayer={watchedLayer || ""}
              selectedItem={watchedItem?.address || ""}
              onLayerChange={handleLayerChange}
              placeholder={{
                layer: "Choose a layer",
                item: "Choose an item",
              }}
            />
            {errors.selectedLayer && (
              <p className="text-sm text-red-500">{errors.selectedLayer.message}</p>
            )}
            {errors.selectedItem && (
              <p className="text-sm text-red-500">{errors.selectedItem.message}</p>
            )}

            {watchedItem && (
              <div className="grid gap-2">
                <label htmlFor="item-amount-input" className="text-sm font-medium">
                  Amount to Add
                </label>
                <Controller
                  name="itemAmount"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="item-amount-input"
                      type="number"
                      placeholder="Enter amount to add"
                      className="w-full"
                    />
                  )}
                />
                {errors.itemAmount && (
                  <p className="text-sm text-red-500">{errors.itemAmount.message}</p>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="grid gap-2">
            <label htmlFor="item-amount-input" className="text-sm font-medium">
              Amount to Add
            </label>
            <Controller
              name="itemAmount"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="item-amount-input"
                  type="number"
                  placeholder="Enter amount to add"
                  className="w-full"
                />
              )}
            />
            {errors.itemAmount && (
              <p className="text-sm text-red-500">{errors.itemAmount.message}</p>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={!isFormValid} className="min-w-[100px]">
            Confirm
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default AddProduct;
