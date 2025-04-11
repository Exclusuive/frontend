import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { useSendTransactions } from "@/hooks/useSendTransactions";
import { useParams } from "react-router-dom";

type Layer = {
  id: string;
  type: string;
};

export default function EditCollectionInfo({ data, refreshKey, setRefreshKey }: any) {
  const [bannerImagePreview, setBannerImagePreview] = useState<string>(data?.banner_url || "");
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [initialDescription] = useState<string>(data?.description || "");

  const [collectionName, setCollectionName] = useState<string>(data?.name || "");
  const [collectionInfo, setCollectionInfo] = useState<string>(data?.description || "");
  const [layers, setLayers] = useState<Layer[]>(data?.layers || []);
  const { editCollectionInfo, editLayerInfo, addPropertyType, addTicketType } =
    useSendTransactions();

  const [property, setProperty] = useState<string>("");
  const [ticket, setTicket] = useState<string>("");

  const params = useParams();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setBannerImagePreview(imageUrl);
    setBannerImageFile(file);
  };

  const addLayer = () => {
    const newLayer: Layer = {
      id: uuidv4(),
      type: "New Layer",
    };
    setLayers((prev) => [...prev, newLayer]);
  };

  const removeLayer = (index: number) => {
    setLayers((prev) => prev.filter((_, i) => i !== index));
  };

  const editLayer = (index: number, newName: string) => {
    setLayers((prev) =>
      prev.map((layer, i) => (i === index ? { ...layer, type: newName } : layer))
    );
  };

  const moveLayer = (currentIndex: number, direction: "up" | "down") => {
    const newLayers = [...layers];
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= newLayers.length) return;

    [newLayers[currentIndex], newLayers[targetIndex]] = [
      newLayers[targetIndex],
      newLayers[currentIndex],
    ];
    setLayers(newLayers);
  };

  const handlEditLayer = async () => {
    if (!layers) {
      return;
    }
    await editLayerInfo({
      id: params.collectionId || "",
      capId: params.capId || "",
      layers: layers,
    });
  };

  const handleEditCollection = async () => {
    const descriptionChanged = collectionInfo !== initialDescription;
    const imageChanged = bannerImageFile !== null;
    if (!descriptionChanged && !imageChanged) {
      return;
    }

    await editCollectionInfo({
      id: params.collectionId || "",
      capId: params.capId || "",
      collectionName: collectionName,
      description: collectionInfo,
      bannerImageFile,
      changedField:
        descriptionChanged && imageChanged
          ? "both"
          : descriptionChanged
            ? "description"
            : "bannerImageFile",
    });

    setRefreshKey(Date.now());
  };

  const handleAddProperty = async () => {
    if (!property) {
      return;
    }
    await addPropertyType({
      id: params.collectionId || "",
      capId: params.capId || "",
      type: property,
    });
  };

  const handleAddTicket = async () => {
    if (!ticket) {
      return;
    }
    await addTicketType({
      id: params.collectionId || "",
      capId: params.capId || "",
      type: ticket,
    });
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="w-full">
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <h2 className="text-xl font-semibold">Collection Information</h2>
          <div className="mt-4 flex items-stretch space-x-6">
            {/* 왼쪽: 이미지 업로드 + 이름 */}
            <div className="flex w-64 flex-col space-y-4">
              <label className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border p-6">
                {bannerImagePreview ? (
                  <img
                    src={`${bannerImagePreview}`}
                    alt="Banner"
                    className="h-auto w-full rounded-lg"
                  />
                ) : (
                  <div>
                    <p className="text-center text-sm text-gray-500">Upload Banner Image</p>
                  </div>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>

              <input
                type="text"
                className="rounded-lg border px-4 py-2"
                placeholder="Enter Collection Name"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
              />
            </div>

            {/* 오른쪽: 설명 */}
            <textarea
              className="flex-1 resize-none rounded-lg border p-4"
              placeholder="Write a brief information about Collections"
              value={collectionInfo}
              onChange={(e) => setCollectionInfo(e.target.value)}
            />
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              className="w-full rounded-xl bg-blue-500 text-white"
              onClick={handleEditCollection}
            >
              Change Collection Information
            </Button>
          </div>

          {/* Layer Options */}
          <div className="mt-6 max-h-[400px] space-y-4 overflow-y-scroll rounded-lg bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Layer Options</h2>
            {layers.map((layer, index) => (
              <div key={layer.id} className="flex items-center space-x-2">
                <input
                  type="text"
                  className="flex-1 rounded-lg border px-3 py-1"
                  value={layer.type}
                  onChange={(e) => editLayer(index, e.target.value)}
                />
                <div className="flex space-x-1">
                  <Button
                    variant="outline"
                    onClick={() => moveLayer(index, "up")}
                    disabled={index === 0}
                  >
                    Up
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => moveLayer(index, "down")}
                    disabled={index === layers.length - 1}
                  >
                    Down
                  </Button>
                  <Button variant="outline" onClick={() => removeLayer(index)}>
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            <Button
              onClick={addLayer}
              className="mt-3 w-full rounded-xl border border-blue-500 bg-transparent text-sm text-blue-500"
            >
              Add Layer
            </Button>
          </div>

          {/* Submit */}
          <div className="mt-6 flex justify-center">
            <Button className="w-full rounded-xl bg-blue-500 text-white" onClick={handlEditLayer}>
              Change Layers
            </Button>
          </div>

          <div className="mx-auto w-1/2 py-10">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Add Property Type</label>
              <input
                type="text"
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="Strength, Luck, etc..."
                value={property}
                onChange={(e) => setProperty(e.target.value)}
              />
            </div>

            <Button
              onClick={handleAddProperty}
              disabled={!property}
              className="w-full rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
            >
              Add Property Type
            </Button>
          </div>

          <div className="mx-auto w-1/2 py-10">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Add Ticket Type</label>
              <input
                type="text"
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="Whitelist, Founder, etc..."
                value={ticket}
                onChange={(e) => setTicket(e.target.value)}
              />
            </div>

            <Button
              onClick={handleAddTicket}
              disabled={!ticket}
              className="w-full rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
            >
              add TicketType
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
