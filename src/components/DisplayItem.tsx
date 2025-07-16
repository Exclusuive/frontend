import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Attribute, CollectionItem } from "@/types/collection";
import { Badge } from "@/components/ui/badge";
import LayerItemSelector from "./LayerItemSelector";
import { ProductFormData } from "./AddProduct";
import AttributeInput from "./ui/attribute-input";

interface DisplayItemProps {
  items: CollectionItem[];
  categories: string[];
  attributes: string[];
  onSubmit: (data: {
    selectedItem: CollectionItem;
    selectedLayer: string;
    itemAmount: string;
    suiAmount: string;
    conditions: { name: string; value: number }[];
  }) => void;
}

const DisplayItem: React.FC<DisplayItemProps> = ({ items, categories, attributes, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      selectedItem: undefined,
      selectedLayer: "",
      itemAmount: "0",
      suiAmount: "0",
      conditions: [],
    },
  });

  const watchedValues = watch();
  const { selectedItem, selectedLayer, itemAmount, suiAmount, conditions } = watchedValues;

  const handleItemSelect = (item: CollectionItem) => {
    setValue("selectedItem", item);
  };

  const handleLayerChange = (layer: string) => {
    setValue("selectedLayer", layer);
    setValue("selectedItem", undefined); // Reset item selection when layer changes
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleConditionsChange = (data: Attribute[]) => {
    setValue("conditions", data);
  };

  const handleFinalSubmit = handleSubmit((data: ProductFormData) => {
    if (onSubmit && data.selectedItem) {
      onSubmit({
        selectedItem: data.selectedItem,
        selectedLayer: data.selectedLayer || "",
        itemAmount: data.itemAmount || "0",
        suiAmount: data.suiAmount || "0",
        conditions: data.conditions || [],
      });
    }
  });

  return (
    <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          Display Item
          <Badge variant="outline">Step {currentStep} / 4</Badge>
        </DialogTitle>
        <DialogDescription>
          {currentStep === 1 && "Select items to display"}
          {currentStep === 2 && "Enter SUI amount"}
          {currentStep === 3 && "Set conditions"}
          {currentStep === 4 && "Review and confirm"}
        </DialogDescription>
      </DialogHeader>

      <div>
        {/* Step 1: Item Selection */}
        {currentStep === 1 && (
          <div>
            <div className="mb-4">
              <h3 className="mb-2 text-lg font-medium">Select Item</h3>
            </div>
            <LayerItemSelector
              layers={categories}
              items={items}
              onItemSelect={handleItemSelect}
              selectedLayer={selectedLayer}
              selectedItem={selectedItem?.name}
              onLayerChange={handleLayerChange}
            />
            {selectedItem && (
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
                      onChange={(e) => {
                        const value = e.target.value;
                        // 숫자와 소수점만 허용
                        if (value === "" || /^\d*\.?\d*$/.test(value)) {
                          field.onChange(value);
                        }
                        return parseInt(value) || 0;
                      }}
                    />
                  )}
                />
                {errors.itemAmount && (
                  <p className="text-sm text-red-500">{errors.itemAmount.message}</p>
                )}
              </div>
            )}
          </div>
        )}
        {/* Step 2: SUI Amount Input */}
        {currentStep === 2 && (
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="w-full max-w-md">
              <label htmlFor="sui-amount" className="mb-2 block text-sm font-medium">
                SUI Amount
              </label>
              <Controller
                name="suiAmount"
                control={control}
                rules={{
                  required: "SUI amount is required",
                  pattern: {
                    value: /^\d*\.?\d*$/,
                    message: "Please enter a valid number",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="sui-amount"
                    type="text"
                    placeholder="Enter amount (e.g., 10.5)"
                    className="text-center text-lg"
                    onChange={(e) => {
                      const value = e.target.value;
                      // 숫자와 소수점만 허용
                      if (value === "" || /^\d*\.?\d*$/.test(value)) {
                        field.onChange(value);
                      }
                    }}
                  />
                )}
              />
              {errors.suiAmount && (
                <p className="mt-1 text-sm text-red-500">{errors.suiAmount.message}</p>
              )}
            </div>
          </div>
        )}
        {/* Step 3: Conditions */}
        {currentStep === 3 && (
          <AttributeInput
            label="Limit Users by ticket who can access this item"
            attributes={conditions || []}
            attributeNameOptions={attributes || []}
            isEditing={true}
            valuePlaceholder="Minimum value required"
            onAttributesChange={handleConditionsChange}
          />
        )}

        {/* Step 4: Review and Confirm */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 font-medium">Selected Item</h4>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    {selectedItem?.img_url && (
                      <img
                        src={selectedItem.img_url}
                        alt={selectedItem.name}
                        className="h-6 w-6 rounded object-cover"
                      />
                    )}
                    <span>{selectedItem?.name}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="mb-2 font-medium">Item Amount</h4>
                <p className="text-lg font-semibold text-blue-600">{itemAmount}</p>
              </div>
              <div>
                <h4 className="mb-2 font-medium">SUI Amount</h4>
                <p className="text-lg font-semibold text-blue-600">{suiAmount} SUI</p>
              </div>

              <div>
                <h4 className="mb-2 font-medium">Conditions ({conditions?.length})</h4>
                {conditions && conditions.length > 0 ? (
                  <div className="space-y-2">
                    {conditions.map((condition, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Badge variant="outline">{condition.name}</Badge>
                        <span> : {condition.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No conditions set</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <DialogFooter className="flex justify-between">
        <div>
          {currentStep > 1 && (
            <Button variant="outline" onClick={handlePrevStep}>
              Previous
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          {currentStep < 4 && currentStep > 0 && (
            <Button
              onClick={handleNextStep}
              disabled={!selectedItem}
              className="bg-gradient-to-r from-[#5656F2] to-[#4CA3FF] text-white"
            >
              Next
            </Button>
          )}

          {currentStep === 4 && (
            <Button
              onClick={handleFinalSubmit}
              disabled={!selectedItem}
              className="bg-gradient-to-r from-[#5656F2] to-[#4CA3FF] text-white"
            >
              Confirm & Submit
            </Button>
          )}
        </div>
      </DialogFooter>
    </DialogContent>
  );
};

export default DisplayItem;
