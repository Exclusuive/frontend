import { Layer } from "@/types/types";
import React, { useState } from "react";
import { FiPlus, FiTrash } from "react-icons/fi";

interface EditLayerProps {
  layers: Layer[];
  setLayers: React.Dispatch<React.SetStateAction<Layer[]>>;
}

const EditLayer = ({ layers, setLayers }: EditLayerProps) => {
  const handleLayerChange = (index: number, newType: string) => {
    const updated = [...layers];
    updated[index].type = newType;
    setLayers(updated);
  };

  const addLayer = () => {
    const nextOrder = layers.length;
    setLayers([...layers, { order: nextOrder, type: "" }]);
  };

  const removeLayer = (index: number) => {
    const updated = layers.filter((_, i) => i !== index);
    // order 다시 정렬
    const reordered = updated.map((layer, i) => ({ ...layer, order: i }));
    setLayers(reordered);
  };

  const handleSubmit = () => {
    console.log("✅ Updated Layers:", layers);
    alert("Layers updated!");
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Edit Layers</h2>

      <div className="space-y-4">
        {layers.map((layer, index) => (
          <div key={index} className="flex items-center gap-4">
            <span className="w-6 text-center text-sm text-gray-500">{layer.order}</span>
            <input
              type="text"
              value={layer.type}
              onChange={(e) => handleLayerChange(index, e.target.value)}
              className="flex-1 rounded-lg border px-3 py-2 text-sm"
              placeholder={`Layer ${index + 1}`}
            />
            <button
              onClick={() => removeLayer(index)}
              className="text-red-500 hover:text-red-700"
              title="Remove Layer"
            >
              <FiTrash />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={addLayer}
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
        >
          <FiPlus /> Add Layer
        </button>
        <button
          onClick={handleSubmit}
          className="ml-auto rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
        >
          Save Layers
        </button>
      </div>
    </div>
  );
};

export default EditLayer;
