import { Layer } from "@/types/types";
import { FiEdit, FiTrash2, FiCheck } from "react-icons/fi";
import { useState } from "react";

interface LayerOptionProps extends Layer {
  onDelete: () => void;
  onEdit: (name: string, description: string) => void;
}

export default function LayerOption({ name, description, onDelete, onEdit }: LayerOptionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [editedDescription, setEditedDescription] = useState(description);

  const handleSave = () => {
    onEdit(editedName, editedDescription);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-md">
      <div>
        {isEditing ? (
          <div>
            <input
              type="text"
              className="mb-2 w-full rounded-lg border p-2"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
            />
            <textarea
              className="w-full rounded-lg border p-2"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
            />
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        )}
      </div>
      <div className="flex space-x-4">
        {isEditing ? (
          <button onClick={handleSave} className="flex cursor-pointer items-center text-green-500">
            <FiCheck /> SAVE
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="flex cursor-pointer items-center text-gray-500"
          >
            <FiEdit /> EDIT
          </button>
        )}
        <button onClick={onDelete} className="flex cursor-pointer items-center text-red-500">
          <FiTrash2 /> DELETE
        </button>
      </div>
    </div>
  );
}
