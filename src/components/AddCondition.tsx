import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AttributeInput from "./ui/attribute-input";
import { Listing } from "@/types/collection";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";

const editConditionSchema = z.object({
  conditions: z.array(
    z.object({
      name: z.string(),
      value: z.number(),
    }),
  ),
});

export type EditConditionFormData = z.infer<typeof editConditionSchema>;

// 내부 로직만 담당하는 컴포넌트 (Dialog 없이)
export const ConditionForm = ({
  attributes,
  listing,
  onSubmit,
  showSubmitButton = true,
}: {
  attributes: string[];
  listing?: Listing;
  onSubmit: (data: EditConditionFormData) => void;
  showSubmitButton?: boolean;
}) => {
  const { handleSubmit, setValue, watch } = useForm<EditConditionFormData>({
    resolver: zodResolver(editConditionSchema),
    defaultValues: {
      conditions: listing?.conditions || [],
    },
  });
  const conditions = watch("conditions");

  const handleConditionsChange = (newConditions: Array<{ name: string; value: number }>) => {
    setValue("conditions", newConditions);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <AttributeInput
        label="Limit Users by ticket who can access this item"
        attributes={conditions || []}
        attributeNameOptions={attributes || []}
        isEditing={true}
        valuePlaceholder="Minimum value required"
        onAttributesChange={handleConditionsChange}
      />

      {showSubmitButton && (
        <div className="flex justify-end">
          <Button type="submit" className="bg-gradient-to-r from-[#5656F2] to-[#4CA3FF] text-white">
            Apply Conditions
          </Button>
        </div>
      )}
    </form>
  );
};

const AddCondition = ({
  attributes,
  listing,
  onSubmit,
}: {
  attributes: string[];
  listing: Listing;
  onSubmit: (data: EditConditionFormData) => void;
}) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Condition</DialogTitle>
      </DialogHeader>
      <ConditionForm
        attributes={attributes}
        listing={listing}
        onSubmit={onSubmit}
        showSubmitButton={true}
      />
    </DialogContent>
  );
};

export default AddCondition;
