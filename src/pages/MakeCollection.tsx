import React, { useState } from "react";
import LayerOption from "@/components/LayerOption";
import { Button } from "@/components/ui/button";
import { FiUpload } from "react-icons/fi";
import { Layer } from "@/types/types";
import { useNavigate } from "react-router-dom";

export default function MakeCollection() {
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [collectionInfo, setCollectionInfo] = useState<string>("");
  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [amountOfSUI, setAmountOfSUI] = useState<string>("");

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
    <div className="min-h-screen overflow-hidden bg-gray-100 p-6 pt-32">
      <div className="flex justify-evenly space-x-6">
        <div className="w-1/2">
          <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
            <h2 className="text-xl font-semibold">Collection Information</h2>
            <div className="mt-4 flex space-x-6">
              <label className="flex h-40 w-40 cursor-pointer flex-col items-center justify-center rounded-lg border p-6">
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
              <textarea
                className="flex-1 rounded-lg border p-4"
                placeholder="Write a brief information about Collections"
                value={collectionInfo}
                onChange={(e) => setCollectionInfo(e.target.value)}
              ></textarea>
            </div>
          </div>

          {/* Layer Options with Scroll */}
          <div className="h-[400px] space-y-6 overflow-y-scroll rounded-lg bg-white p-4 shadow-sm">
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
        <div className="w-1/3">
          <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
            <h2 className="text-xl font-semibold">Create First Item</h2>
            <div className="mt-4 flex space-x-6">
              <label className="flex h-40 w-40 cursor-pointer flex-col items-center justify-center rounded-lg border p-6">
                {baseImage ? (
                  <img src={baseImage} alt="Base" className="h-auto w-full rounded-lg" />
                ) : (
                  <FiUpload className="text-4xl" />
                )}
                <p className="text-center text-sm text-gray-500">Please upload item image</p>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setBaseImage)}
                />
              </label>
              <textarea
                className="flex-1 rounded-lg border p-4"
                placeholder="Write a brief information about this item"
              ></textarea>
            </div>
            <select
              className="mt-4 w-full rounded-lg border p-2"
              value={selectedLayer}
              onChange={(e) => setSelectedLayer(e.target.value)}
            >
              <option value="" disabled>
                Select Layer
              </option>
              {layers.map((layer, index) => (
                <option key={index} value={layer.name}>
                  {layer.name}
                </option>
              ))}
            </select>
            <div className="mt-2 w-full">
              <select
                className="w-full rounded-lg border p-2"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="" disabled>
                  Choose Type
                </option>
                <option value="Mint item upon request">Mint item instantly</option>
                <option value="Mint requires SUI">Mint requires SUI</option>
                <option value="I will customize it">I will customize it</option>
              </select>
              <div
                className={`transition-all duration-300 ${selectedType === "Mint requires SUI" ? "opacity-100" : "h-0 overflow-hidden opacity-0"}`}
              >
                <input
                  type="number"
                  className="mt-2 w-full rounded-lg border p-2"
                  placeholder="Enter required SUI amount"
                  value={amountOfSUI}
                  onChange={(e) => setAmountOfSUI(e.target.value)}
                />
              </div>
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
    </div>
  );
}
