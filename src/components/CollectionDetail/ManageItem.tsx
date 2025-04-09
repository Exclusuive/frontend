import { useState } from "react";
import { useSendTransactions } from "@/hooks/useSendTransactions";
import { Button } from "../ui/button";
import { FiUpload } from "react-icons/fi";
import { useParams } from "react-router-dom";

export default function ManageItem({ data }: any) {
  const [selectedLayer, setSelectedLayer] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemImagePreview, setItemImagePreview] = useState<string | null>(null);
  const [itemImageFile, setItemImageFile] = useState<File | null>(null);
  const [selectedItem, setSelectedItem] = useState("");
  const [recipient, setRecipient] = useState("");

  const { addItemType, mintItem } = useSendTransactions();
  const params = useParams();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setItemImagePreview(url);
      setItemImageFile(file);
    }
  };

  const handleAddItem = () => {
    if (!params.collectionId || !params.capId) return;
    addItemType({
      id: params.collectionId,
      capId: params.capId,
      layer: selectedLayer,
      itemName: itemName,
      itemImg: itemImageFile,
    });
  };

  const handleMint = () => {
    if (!recipient || !params.collectionId || !params.capId) return;
    mintItem({
      id: params.collectionId,
      capId: params.capId,
      baseId: recipient,
      itemType: selectedItem,
    });
  };

  return (
    <div className="grid grid-cols-2 gap-x-8">
      {/* Add Item */}
      <div className="rounded-lg bg-white p-6">
        <h2 className="mb-6 text-2xl font-extrabold">Add New Item</h2>
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

        <label className="mb-2 block font-semibold text-gray-700">Upload Item Image</label>
        <label className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border p-4">
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

        <Button
          onClick={handleAddItem}
          disabled={!selectedLayer || !itemName || !itemImageFile}
          className="my-6 w-full rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
        >
          Add Item
        </Button>
      </div>

      {/* Mint Item */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-6 text-2xl font-extrabold">Mint Item NFT</h2>

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

        {selectedLayer && data.items[selectedLayer] && (
          <div className="mb-4">
            <label className="mb-2 block font-semibold text-gray-700">Select Item</label>
            <select
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              className="w-full rounded border p-2"
            >
              <option value="">-- Choose an Item --</option>
              {data.items[selectedLayer].map((item: any, idx: number) => (
                <option key={idx} value={item.type}>
                  {item.type}
                </option>
              ))}
            </select>
          </div>
        )}

        <label className="mb-2 block font-semibold text-gray-700">Recipient Address</label>
        <input
          type="text"
          className="w-full rounded-lg border px-3 py-2 text-sm"
          placeholder="0x..."
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />

        <Button
          onClick={handleMint}
          disabled={!recipient || !selectedItem}
          className="my-6 w-full rounded-lg bg-green-500 px-6 py-2 text-white hover:bg-green-600 disabled:opacity-50"
        >
          Mint Item
        </Button>
      </div>
    </div>
  );
}
