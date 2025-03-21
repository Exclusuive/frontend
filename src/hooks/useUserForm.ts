// src/hooks/useUserForm.ts
import { useS3Uploader } from "./useS3Uploader";
import { createUser, updateUser } from "@/api/users";
import { useState } from "react";

export function useUserForm() {
  const { uploadToS3 } = useS3Uploader();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ 유저 생성
  const createUserWithImage = async (userData: {
    address: string;
    name: string;
    description?: string;
    imageFile?: File; // 선택적 이미지
  }) => {
    try {
      setLoading(true);
      let profileImg: string | undefined;

      if (userData.imageFile) {
        profileImg = await uploadToS3("profile", userData.address, userData.imageFile);
      }

      const user = await createUser({
        address: userData.address,
        name: userData.name,
        description: userData.description,
        profileImg,
      });

      return user;
    } catch (err: any) {
      setError(err.message || "유저 생성 실패");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ 유저 수정
  const updateUserWithImage = async (
    id: string,
    updateData: {
      name?: string;
      description?: string;
      imageFile?: File;
    }
  ) => {
    try {
      setLoading(true);
      let profileImg: string | undefined;

      if (updateData.imageFile) {
        profileImg = await uploadToS3("profile", id, updateData.imageFile);
      }

      const user = await updateUser(id, {
        name: updateData.name,
        description: updateData.description,
        ...(profileImg && { profileImg }),
      });

      return user;
    } catch (err: any) {
      setError(err.message || "유저 업데이트 실패");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createUserWithImage,
    updateUserWithImage,
    loading,
    error,
  };
}
