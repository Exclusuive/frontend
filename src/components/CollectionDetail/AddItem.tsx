import { useSendTransactions } from "@/hooks/useSendTransactions";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { FiUpload } from "react-icons/fi";

export default function AddItem({ data }: any) {
  const [selectedLayer, setSelectedLayer] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemImagePreview, setItemImagePreview] = useState<string | null>(null);
  const [itemImageFile, setItemImageFile] = useState<File | null>(null);
  const { addItemType } = useSendTransactions();
  const params = useParams();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setItemImagePreview(url);
      setItemImageFile(file);
    }
  };

  const handleSubmit = () => {
    if (!params.collectionId || !params.capId) return;

    addItemType({
      id: params.collectionId,
      capId: params.capId,
      layer: selectedLayer,
      itemName: itemName,
      itemImg: itemImageFile,
    });
  };

  return (
    <div className="flex gap-x-5 text-start">
      <div className="w-1/2">
        <h2 className="mb-6 text-2xl font-extrabold">Add New Item</h2>
        {/* Layer Select */}
        <label className="mb-2 block font-semibold text-gray-700">Select Layer</label>
        <select
          value={selectedLayer}
          onChange={(e) => setSelectedLayer(e.target.value)}
          className="mb-4 w-full rounded border p-2"
        >
          <option value="">-- Choose Layer --</option>
          {data?.layers?.map((layer: any, index: number) => (
            <option key={index} value={layer.type}>
              {layer.type}
            </option>
          ))}
        </select>

        <label className="mb-2 block font-semibold text-gray-700">Item Name</label>
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="mb-4 w-full rounded border p-2"
          placeholder="Enter item name"
        />
        {/* Image Upload */}
        <label className="mb-2 block font-semibold text-gray-700">Upload Item Image</label>
        <label className="flex h-64 w-full flex-1 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border p-4">
          {itemImagePreview ? (
            <img
              src={itemImagePreview}
              alt="ItemImage"
              className="h-full w-full rounded-lg object-contain"
            />
          ) : (
            <div>
              <FiUpload className="mx-auto text-4xl" />
              <p className="text-center text-sm text-gray-500">Please upload item images</p>
            </div>
          )}
          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
        </label>
        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!selectedLayer || !itemName || !itemImagePreview}
          className="my-10 w-full rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
        >
          Add Item
        </Button>
      </div>

      <div className="w-1/2">
        <h2 className="mb-6 text-xl font-bold">Item property (Optional)</h2>
      </div>
    </div>
  );
}
