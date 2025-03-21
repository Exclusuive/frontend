// src/api/user.ts
import { User } from "@/types/api";
import axios from "axios";

// .env에 정의된 백엔드 API 주소
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const baseUrl = `${backendUrl}/users/users`;

// ✅ 모든 유저 조회
export const getAllUsers = async (): Promise<User[]> => {
  const response = await axios.get(baseUrl);
  return response.data;
};

// ✅ 특정 유저 조회
export const getUserById = async (id: string): Promise<User> => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
};

// ✅ 유저 생성
export const createUser = async (user: {
  address: string;
  profileImg?: string;
  name: string;
  description?: string;
}): Promise<User> => {
  const response = await axios.post(baseUrl, user);
  return response.data;
};

// ✅ 유저 업데이트
export const updateUser = async (
  id: string,
  updateData: Partial<Omit<User, "id">>
): Promise<User> => {
  const response = await axios.put(`${baseUrl}/${id}`, updateData);
  return response.data;
};

// ✅ 유저 삭제
export const deleteUser = async (id: string): Promise<User> => {
  const response = await axios.delete(`${baseUrl}/${id}`);
  return response.data;
};
