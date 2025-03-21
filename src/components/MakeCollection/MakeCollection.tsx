import React, { useState } from "react";
import LayerOption from "@/components/LayerOption";
import { Button } from "@/components/ui/button";
import { FiUpload } from "react-icons/fi";
import { Layer, MakeCollectionProps } from "@/types/types";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function MakeCollection({ goBack }: MakeCollectionProps) {
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [collectionInfo, setCollectionInfo] = useState<string>("");
  const [layers, setLayers] = useState<Layer[]>([]);

  const navigate = useNavigate();

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setImage: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const addLayer = () => {
    const newLayer: Layer = {
      name: `New Layer`,
      description: "New layer description",
    };
    setLayers([...layers, newLayer]);
  };

  const removeLayer = (index: number) => {
    setLayers(layers.filter((_, i) => i !== index));
  };

  const editLayer = (index: number, newName: string, newDescription: string) => {
    setLayers(
      layers.map((layer, i) =>
        i === index ? { ...layer, name: newName, description: newDescription } : layer
      )
    );
  };

  const create = () => {
    window.alert("Create Collection complete!");
    navigate("/");
  };

  return (
    <div className="min-h-screen w-2/3 overflow-hidden bg-gray-100 p-6">
      <Button
        onClick={goBack}
        className="mb-6 flex items-center justify-end gap-2 bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
      >
        <ArrowLeft size={20} />
        Back
      </Button>
      <div className="w-full">
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <h2 className="text-xl font-semibold">Collection Information</h2>
          <div className="mt-4 flex items-stretch space-x-6">
            {/* 왼쪽: 이미지 업로드 + Collection Name */}
            <div className="flex w-64 flex-col space-y-4">
              <label className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border p-6">
                {bannerImage ? (
                  <img src={bannerImage} alt="Banner" className="h-auto w-full rounded-lg" />
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
                  onChange={(e) => handleImageUpload(e, setBannerImage)}
                />
              </label>

              <input
                type="text"
                className="rounded-lg border px-4 py-2"
                placeholder="Enter Collection Name"
                // 상태 연결 예시
                // value={collectionName}
                // onChange={(e) => setCollectionName(e.target.value)}
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
                description={layer.description}
                onDelete={() => removeLayer(index)}
                onEdit={(newName, newDescription) => editLayer(index, newName, newDescription)}
              />
            ))}
            <Button
              onClick={addLayer}
              className="mt-3 w-full rounded-xl border border-blue-500 bg-transparent text-sm text-blue-500"
            >
              Add Layer
            </Button>
          </div>
        </div>
        {/* Create Button */}
        <div className="mt-6 flex justify-center">
          <Button
            className="mt-3 w-full rounded-xl border border-blue-500 bg-transparent text-sm text-blue-500"
            onClick={create}
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
}
