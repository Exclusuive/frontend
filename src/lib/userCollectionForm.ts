// hooks/useCollectionForm.ts
import { useS3Uploader } from "@/hooks/useS3Uploader";
import { createCollection, updateCollection } from "@/api/collections";
import { useState } from "react";

export function useCollectionForm() {
  const { uploadToS3 } = useS3Uploader();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ 컬렉션 생성
  const createCollectionWithImage = async (collectionData: {
    id: string;
    name: string;
    description?: string;
    imageFile?: File;
  }) => {
    try {
      setLoading(true);
      let bannerImg: string | undefined;

      if (collectionData.imageFile) {
        bannerImg = await uploadToS3("banner", collectionData.id, collectionData.imageFile);
      }

      const collection = await createCollection({
        id: collectionData.id,
        name: collectionData.name,
        description: collectionData.description,
        bannerImg,
      });

      return collection;
    } catch (err: any) {
      setError(err.message || "컬렉션 생성 실패");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ 컬렉션 수정
  const updateCollectionWithImage = async (
    id: string,
    updateData: {
      type: string;
      name?: string;
      description?: string;
      imageFile?: File;
    }
  ) => {
    try {
      setLoading(true);
      let bannerImg: string | undefined;

      if (updateData.imageFile) {
        bannerImg = await uploadToS3("banner", updateData.type, updateData.imageFile);
      }

      const collection = await updateCollection(id, {
        type: updateData.type,
        name: updateData.name,
        description: updateData.description,
        ...(bannerImg && { bannerImg }),
      });

      return collection;
    } catch (err: any) {
      setError(err.message || "컬렉션 업데이트 실패");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createCollectionWithImage,
    updateCollectionWithImage,
    loading,
    error,
  };
}
