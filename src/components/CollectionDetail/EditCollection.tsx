import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";

const EditCollection = () => {
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null);
  const [collectionName, setCollectionName] = useState("");
  const [collectionInfo, setCollectionInfo] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBannerImagePreview(url);
    }
  };

  const handleSubmit = () => {
    // 추후 API 연결 등으로 확장 가능
    console.log("🎯 Submitted:", {
      collectionName,
      collectionInfo,
      bannerImagePreview,
    });
    alert("Collection info saved!");
  };

  return (
    <div className="mb-6 h-full w-full rounded-lg bg-white p-6 shadow-md">
      <h2 className="text-xl font-semibold">Edit Collection</h2>

      <div className="flex w-full flex-col space-y-4">
        <label className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border p-6">
          {bannerImagePreview ? (
            <img src={bannerImagePreview} alt="Banner" className="h-auto w-full rounded-lg" />
          ) : (
            <div className="text-center text-gray-500">
              <FiUpload className="mx-auto mb-2 text-4xl" />
              <p className="text-sm">Please upload banner image</p>
            </div>
          )}
          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
        </label>

        <input
          type="text"
          className="rounded-lg border px-4 py-2"
          placeholder="Enter Collection Name"
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
        />

        {/* 오른쪽: 설명 */}
        <textarea
          className="flex-1 resize-none rounded-lg border p-4"
          placeholder="Write a brief information about the Collection"
          value={collectionInfo}
          onChange={(e) => setCollectionInfo(e.target.value)}
        />
      </div>

      <div className="mt-6">
        <button
          className="w-full rounded-lg bg-blue-500 px-6 py-2 text-white transition hover:bg-blue-600"
          onClick={handleSubmit}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditCollection;
