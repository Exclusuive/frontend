import React, { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  currentImageUrl: string;
  onImageChange: (imageUrl: string, file?: File) => void;
  isEditing: boolean;
  className?: string;
  showUrl?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImageUrl,
  onImageChange,
  isEditing,
  className,
  showUrl = true,
}) => {
  const [imagePreview, setImagePreview] = useState<string>(currentImageUrl);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageError = () => {
    setImagePreview("/placeholder-image.png");
  };

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        onImageChange(result, file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const removeUploadedFile = () => {
    setUploadedFile(null);
    setImagePreview(currentImageUrl);
    onImageChange(currentImageUrl);
  };

  const handleUrlChange = (url: string) => {
    setImagePreview(url);
    onImageChange(url);
  };

  // Update preview when currentImageUrl changes
  React.useEffect(() => {
    if (!uploadedFile) {
      setImagePreview(currentImageUrl);
    }
  }, [currentImageUrl, uploadedFile]);

  if (!isEditing) {
    return (
      <div className={cn("w-full", className)}>
        <img
          src={imagePreview || currentImageUrl}
          alt="Collection preview"
          className="aspect-square w-full rounded-lg object-cover"
          onError={handleImageError}
        />
      </div>
    );
  }

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* File Upload Area */}
      <div
        className={cn(
          "relative rounded-lg border-2 border-dashed p-6 text-center transition-colors",
          isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400",
          uploadedFile && "border-green-500 bg-green-50",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {uploadedFile ? (
          <div className="space-y-2">
            <div className="aspect-square w-full overflow-hidden rounded-lg">
              <img
                src={imagePreview}
                alt="Uploaded preview"
                className="h-full w-full object-cover"
                onError={handleImageError}
              />
            </div>
            <p className="text-sm font-medium text-green-600">{uploadedFile.name}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={removeUploadedFile}
              className="text-red-600 hover:text-red-700"
            >
              Remove File
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                Drop image here or click to upload
              </p>
              <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleUploadClick}
              className="mt-2"
            >
              Choose File
            </Button>
          </div>
        )}
      </div>

      {/* URL Input as fallback */}
      {showUrl && (
        <div className="space-y-2">
          <label htmlFor="imgUrl" className="block text-sm font-medium text-gray-700">
            Or enter image URL
          </label>
          <Input
            id="imgUrl"
            value={imagePreview}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="w-full"
            placeholder="Enter image URL"
            disabled={!!uploadedFile}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
