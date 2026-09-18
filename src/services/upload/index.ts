// src/services/upload.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type TUploadResponse = {
  success: boolean;
  message: string;
  data: {
    url: string;
    publicId: string;
    type: "image" | "video";
    format: string;
    size: number;
  };
  url: string;
};

/**
 * Uploads a single file to the backend (which pushes it to Cloudinary)
 * and returns the hosted URL to store on the product.
 */
export const uploadImageFile = async (file: File): Promise<string> => {
  if (!API_BASE_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not set. Add it to your .env.local file and restart the dev server.",
    );
  }

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/upload/upload_file`, {
    method: "POST",
    body: formData,
  });

  const result: TUploadResponse = await res.json();

  if (!res.ok || !result.success) {
    throw new Error(result.message || "Image upload failed");
  }

  return result.url;
};
