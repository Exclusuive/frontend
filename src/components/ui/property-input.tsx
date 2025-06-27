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

interface Property {
  name: string;
  value: string;
}

interface PropertyInputProps {
  label: string;
  properties: Property[];
  propertyNameOptions: string[];
  isEditing: boolean;
  valuePlaceholder?: string;
  className?: string;
  onPropertiesChange?: (properties: Property[]) => void;
}

const PropertyInput: React.FC<PropertyInputProps> = ({
  label,
  properties,
  propertyNameOptions,
  isEditing,
  valuePlaceholder = "Property value",
  className,
  onPropertiesChange,
}) => {
  const [localProperties, setLocalProperties] = useState<Property[]>(properties);
  const [newProperty, setNewProperty] = useState<Property>({ name: "", value: "" });

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
    setLocalProperties(properties);
  }, [properties]);

  const handleAddProperty = () => {
    if (newProperty.name.trim() && newProperty.value.trim()) {
      const updatedProperties = [...localProperties, { ...newProperty }];
      setLocalProperties(updatedProperties);

      if (onPropertiesChange) {
        onPropertiesChange(updatedProperties);
      }

      setNewProperty({ name: "", value: "" });
    }
  };

  const handleRemoveProperty = (index: number) => {
    const updatedProperties = localProperties.filter((_, i) => i !== index);
    setLocalProperties(updatedProperties);

    if (onPropertiesChange) {
      onPropertiesChange(updatedProperties);
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
        {localProperties.map((property, index) => (
          <Badge
            key={`${property.name}-${index}`}
            className={cn("flex items-center gap-1 text-sm", colors[index % colors.length])}
          >
            <span className="font-medium">{property.name}:</span>
            <span>{property.value}</span>
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
              value={newProperty.name}
              onValueChange={(value) => setNewProperty({ ...newProperty, name: value })}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select property name" />
              </SelectTrigger>
              <SelectContent>
                {propertyNameOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder={valuePlaceholder}
              value={newProperty.value}
              onChange={(e) => setNewProperty({ ...newProperty, value: e.target.value })}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddProperty}
              disabled={!newProperty.name.trim() || !newProperty.value.trim()}
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

export default PropertyInput;
