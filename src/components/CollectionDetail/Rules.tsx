import { useSendTransactions } from "@/hooks/useSendTransactions";
import { Layer } from "@/types/types";
import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";
import { Button } from "../ui/button";

interface RulesProps {
  id?: string;
  capId?: string;
  layers: Layer[];
}

const Rules = ({ id, capId, layers }: RulesProps) => {
  const [selectedLayer, setSelectedLayer] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemImagePreview, setItemImagePreview] = useState<string | null>(null);
  const [itemImageFile, setItemImageFile] = useState<File | null>(null);

  const { addItemType } = useSendTransactions();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setItemImagePreview(url);
      setItemImageFile(file);
    }
  };

  const handleSubmit = () => {
    if (!id || !capId) return;
    setItemName("");

    addItemType({
      id: id,
      capId: capId,
      layer: selectedLayer,
      itemName: itemName,
      itemImg: itemImageFile, // 여기서 itemImageFile은 File 타입이어야 함!
    });
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Rules</h2>

      <div className="mb-4 space-y-2">
        <label className="block text-sm font-medium text-gray-700">Select Layer</label>
        <select
          className="w-full rounded-lg border px-3 py-2 text-sm"
          value={selectedLayer}
          onChange={(e) => setSelectedLayer(e.target.value)}
        >
          <option value="" disabled>
            -- Select Layer --
          </option>
          {layers.map((layer, index) => (
            <option key={index} value={layer.type}>
              {layer.type}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Item Name</label>
        <select
          className="w-full rounded-lg border px-3 py-2 text-sm"
          value={selectedLayer}
          onChange={(e) => setSelectedLayer(e.target.value)}
        >
          <option value="" disabled>
            -- Select Item --
          </option>
          {layers.map((item, index) => (
            <option key={index} value={item.type}>
              {item.type}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">Rules</label>
        <label className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border p-4 text-gray-500">
          {itemImagePreview ? (
            <img src={itemImagePreview} alt="Item Preview" className="h-full object-contain" />
          ) : (
            <>
              <FiUpload className="mb-2 text-3xl" />
              <p className="text-sm">Click to upload image</p>
            </>
          )}
          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
        </label>
      </div>

      <div className="mt-6 text-right">
        <Button
          onClick={handleSubmit}
          disabled={!selectedLayer || !itemName || !itemImagePreview}
          className="rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
        >
          Add Item
        </Button>
      </div>
    </div>
  );
};

export default Rules;
