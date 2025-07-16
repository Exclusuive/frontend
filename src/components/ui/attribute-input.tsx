import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Attribute {
  name: string;
  value: number;
}

interface AttributeInputProps {
  label: string;
  attributes: Attribute[];
  attributeNameOptions: string[];
  isEditing: boolean;
  valuePlaceholder?: string;
  className?: string;
  onAttributesChange?: (attributes: Attribute[]) => void;
}

const AttributeInput: React.FC<AttributeInputProps> = ({
  label,
  attributes,
  attributeNameOptions,
  isEditing,
  valuePlaceholder = "Property value",
  className,
  onAttributesChange,
}) => {
  const [localAttributes, setLocalAttributes] = useState<Attribute[]>(attributes);
  const [newAttribute, setNewAttribute] = useState<Attribute>({ name: "", value: 0 });

  const colors = [
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-purple-100 text-purple-800",
    "bg-orange-100 text-orange-800",
    "bg-red-100 text-red-800",
    "bg-yellow-100 text-yellow-800",
    "bg-pink-100 text-pink-800",
    "bg-indigo-100 text-indigo-800",
  ];

  // Update local properties when props change
  useEffect(() => {
    setLocalAttributes(attributes);
  }, [attributes]);

  const handleAddProperty = () => {
    if (newAttribute.name.trim() && newAttribute.value) {
      const existingIndex = localAttributes.findIndex((attr) => attr.name === newAttribute.name);

      let updatedAttributes;
      if (existingIndex !== -1) {
        // Update existing attribute value
        updatedAttributes = localAttributes.map((attr, index) =>
          index === existingIndex ? { ...attr, value: newAttribute.value } : attr,
        );
      } else {
        // Add new attribute
        updatedAttributes = [...localAttributes, { ...newAttribute }];
      }

      setLocalAttributes(updatedAttributes);

      if (onAttributesChange) {
        onAttributesChange(updatedAttributes);
      }

      setNewAttribute({ name: "", value: 0 });
    }
  };

  const handleRemoveProperty = (index: number) => {
    const updatedAttributes = localAttributes.filter((_, i) => i !== index);
    setLocalAttributes(updatedAttributes);

    if (onAttributesChange) {
      onAttributesChange(updatedAttributes);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddProperty();
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {/* Display existing properties */}
      <div className="flex flex-wrap gap-2">
        {localAttributes?.map((attribute, index) => (
          <Badge
            key={`${attribute.name}-${index}`}
            className={cn("flex items-center gap-1 text-sm", colors[index % colors.length])}
          >
            <span className="font-medium">{attribute.name}:</span>
            <span>{attribute.value}</span>
            {isEditing && (
              <button
                type="button"
                onClick={() => handleRemoveProperty(index)}
                className="ml-1 rounded-full p-0.5 hover:bg-black/10"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        ))}
      </div>

      {/* Add new property form */}
      {isEditing && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Select
              value={newAttribute.name}
              onValueChange={(value) => setNewAttribute({ ...newAttribute, name: value })}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {attributeNameOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder={valuePlaceholder}
              value={newAttribute.value}
              onChange={(e) => setNewAttribute({ ...newAttribute, value: Number(e.target.value) })}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddProperty}
              disabled={!newAttribute.name.trim() || newAttribute.value === 0}
              className="flex items-center gap-1"
            >
              <Plus className="h-3 w-3" />
              Add
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttributeInput;
