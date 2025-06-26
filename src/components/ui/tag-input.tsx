import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TagInputProps {
  label: string;
  tags: string[];
  isEditing: boolean;
  placeholder?: string;
  className?: string;

  onTagsChange?: (tags: string[]) => void;
}

const TagInput: React.FC<TagInputProps> = ({
  label,
  tags,
  isEditing,
  placeholder = "Enter tag name",
  className,

  onTagsChange,
}) => {
  const [tagInputs, setTagInputs] = useState<string[]>([]);
  const [localTags, setLocalTags] = useState<string[]>(tags);

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

  // Update local tags when props change
  useEffect(() => {
    setLocalTags(tags);
  }, [tags]);

  const handleAddTag = () => {
    setTagInputs([...tagInputs, ""]);
  };

  const handleTagInputChange = (index: number, value: string) => {
    const newInputs = [...tagInputs];
    newInputs[index] = value;
    setTagInputs(newInputs);
  };

  const handleTagInputKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInputs[index].trim()) {
      const newTags = [...localTags, tagInputs[index].trim()];
      setLocalTags(newTags);

      // Call onTagsChange if provided
      if (onTagsChange) {
        onTagsChange(newTags);
      }

      // Remove the input field after adding
      const newInputs = tagInputs.filter((_, i) => i !== index);
      setTagInputs(newInputs);
    }
  };

  const handleTagInputBlur = (index: number) => {
    if (tagInputs[index].trim()) {
      const newTags = [...localTags, tagInputs[index].trim()];
      setLocalTags(newTags);

      // Call onTagsChange if provided
      if (onTagsChange) {
        onTagsChange(newTags);
      }

      // Remove the input field after adding
      const newInputs = tagInputs.filter((_, i) => i !== index);
      setTagInputs(newInputs);
    } else {
      // Remove empty input field
      const newInputs = tagInputs.filter((_, i) => i !== index);
      setTagInputs(newInputs);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = localTags.filter((tag) => tag !== tagToRemove);
    setLocalTags(newTags);

    // Call onTagsChange if provided
    if (onTagsChange) {
      onTagsChange(newTags);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>

      <div className="flex flex-wrap gap-2">
        {localTags?.map((tag, index) => (
          <Badge
            key={tag}
            className={cn("text-sm", colors[index % colors.length])}
            onClick={() => isEditing && handleRemoveTag(tag)}
          >
            {tag}
          </Badge>
        ))}

        {/* Dynamic tag inputs */}
        {tagInputs.map((input, index) => (
          <Input
            key={`tag-input-${index}`}
            className="h-8 w-32 text-sm"
            placeholder={placeholder}
            value={input}
            onChange={(e) => handleTagInputChange(index, e.target.value)}
            onKeyDown={(e) => handleTagInputKeyDown(index, e)}
            onBlur={() => handleTagInputBlur(index)}
            autoFocus
          />
        ))}
      </div>

      {isEditing && (
        <div className="mt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddTag}
            className="flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add {label}
          </Button>
        </div>
      )}
    </div>
  );
};

export default TagInput;
