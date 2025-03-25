// src/api/collection.ts
import axios from "axios";
import { Collection } from "@/types/api"; // 타입 정의는 필요에 따라 수정

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const baseUrl = `${backendUrl}/collections/collections`; // backend의 app.use("/collections", collectionRoutes) 기준

// ✅ 모든 컬렉션 조회
export const getAllCollections = async (): Promise<Collection[]> => {
  const response = await axios.get(baseUrl);
  return response.data;
};

// ✅ 특정 컬렉션 조회
export const getCollectionById = async (id: string): Promise<Collection> => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
};

export const getCollectionsByObjectIds = async (objectIds: string[]): Promise<Collection[]> => {
  const response = await axios.post(`${baseUrl}/by-object-ids`, {
    objectIds,
  });
  return response.data;
};

// ✅ 컬렉션 생성
export const createCollection = async (collection: {
  id: string;
  name: string;
  bannerImg?: string;
  description?: string;
}): Promise<Collection> => {
  const response = await axios.post(baseUrl, collection);
  return response.data;
};

// ✅ 컬렉션 업데이트
export const updateCollection = async (
  id: string,
  updateData: Partial<Omit<Collection, "id">>
): Promise<Collection> => {
  const response = await axios.put(`${baseUrl}/${id}`, updateData);
  return response.data;
};

// ✅ 컬렉션 삭제
export const deleteCollection = async (id: string): Promise<Collection> => {
  const response = await axios.delete(`${baseUrl}/${id}`);
  return response.data;
};
