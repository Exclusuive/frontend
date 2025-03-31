import { UploadToS3Params } from "@/types/types";

export async function uploadToS3({
  type,
  id,
  file,
}: UploadToS3Params): Promise<{ fileUrl: string }> {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  if (!file) {
    console.warn("📁 No file provided for S3 upload.");
    return { fileUrl: "" };
  }

  try {
    const presignRes = await fetch(`${backendUrl}/s3/requestS3Permission`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: `${type}/${id}_${file.name}`,
        fileType: file.type,
      }),
    });

    if (!presignRes.ok) throw new Error("Failed to get presigned URL");

    const { uploadUrl, fileUrl } = await presignRes.json();

    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!uploadRes.ok) throw new Error("Failed to upload to S3");

    return { fileUrl };
  } catch (err: any) {
    console.error("S3 Upload Error:", err.message || err);
    throw err;
  }
}
