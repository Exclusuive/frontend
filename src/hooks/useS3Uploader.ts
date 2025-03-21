import { useState } from "react";

export function useS3Uploader() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const uploadToS3 = async (type: string, id: string, file: File) => {
    setUploading(true);
    setError(null);
    setUploadedUrl(null);

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

      setUploadedUrl(fileUrl);
      return fileUrl;
    } catch (err: any) {
      setError(err.message || "Unknown error");
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    uploadedUrl,
    error,
    uploadToS3,
  };
}
