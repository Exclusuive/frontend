import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FiUpload } from "react-icons/fi";
import { useSendTransactions } from "@/hooks/useSendTransactions";
import { Layer } from "@/types/types";
import LayerOption from "./LayerOptions";

export default function NewCollection() {
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null); // 미리보기용
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null); // S3 업로드용
  const [collectionName, setCollectionName] = useState<string>("");

  const [collectionInfo, setCollectionInfo] = useState<string>("");
  const [layers, setLayers] = useState<any[]>([]);
  const { newCollection } = useSendTransactions();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setBannerImagePreview(imageUrl); // 미리보기용
    setBannerImageFile(file); // S3 업로드용
  };

  const addLayer = () => {
    const newLayer: Layer = {
      name: `New Layer`,
    };
    setLayers([...layers, newLayer]);
  };

  const removeLayer = (index: number) => {
    setLayers(layers.filter((_, i) => i !== index));
  };

  const editLayer = (index: number, newName: string) => {
    setLayers(layers.map((layer, i) => (i === index ? { ...layer, name: newName } : layer)));
  };

  return (
    <div className="min-h-screen w-2/3 overflow-hidden p-6">
      <div className="w-full">
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <h2 className="text-xl font-semibold">Collection Information</h2>
          <div className="mt-4 flex items-stretch space-x-6">
            {/* 왼쪽: 이미지 업로드 + Collection Name */}
            <div className="flex w-64 flex-col space-y-4">
              <label className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border p-6">
                {bannerImagePreview ? (
                  <img src={bannerImagePreview} alt="Banner" className="h-auto w-full rounded-lg" />
                ) : (
                  <div>
                    <FiUpload className="mx-auto text-4xl" />
                    <p className="text-center text-sm text-gray-500">Please upload banner images</p>
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

            {/* 오른쪽: Description (왼쪽과 높이 맞춤) */}
            <textarea
              className="flex-1 resize-none rounded-lg border p-4"
              placeholder="Write a brief information about Collections"
              value={collectionInfo}
              onChange={(e) => setCollectionInfo(e.target.value)}
            />
          </div>

          {/* Layer Options with Scroll */}
          <div className="mt-6 h-[400px] space-y-6 overflow-y-scroll rounded-lg bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Layer Options</h2>
            {layers.map((layer, index) => (
              <LayerOption
                key={index}
                name={layer.name}
                onDelete={() => removeLayer(index)}
                onEdit={(newName: string) => editLayer(index, newName)}
              />
            ))}
            <Button
              onClick={addLayer}
              className="mt-3 w-full rounded-xl border border-blue-500 bg-transparent text-sm text-blue-500"
            >
              Add Layer
            </Button>
          </div>
          {/* Create Button */}
          <div className="mt-6 flex justify-center">
            <Button
              className="mt-3 w-full rounded-xl border border-blue-500 bg-transparent text-sm text-blue-500"
              onClick={() =>
                newCollection({
                  collectionName: collectionName,
                  description: collectionInfo,
                  bannerImageFile: bannerImageFile,
                  layers: layers,
                })
              }
            >
              Create
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
