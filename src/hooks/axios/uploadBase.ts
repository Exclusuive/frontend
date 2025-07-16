import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { Membership } from "@/types/collection";

export const uploadMembership = async () => {
  const baseId = uuidv4();
  const baseImg = await fetch("/WhiteBackground.png").then((r) => r.blob());

  const formData = new FormData();
  formData.append("path", `/collection/base/${baseId}.png`);
  formData.append("file", baseImg, `${baseId}.png`);

  const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/s3/uploadImage`, formData);
  return { data: res.data, membership_id: baseId };
};

export const updateMembership = async (buffer: Blob, membership: Membership) => {
  const formData = new FormData();
  formData.append("path", `/collection/base/${membership.membership_id}.png`);
  formData.append("file", buffer, `${membership.membership_id}.png`);

  const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/s3/uploadImage`, formData);
  return { data: res.data, membership_id: membership.membership_id };
};
