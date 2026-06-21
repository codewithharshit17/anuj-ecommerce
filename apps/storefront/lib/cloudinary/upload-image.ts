import { cloudinary } from "./index";

export const CLOUDINARY_FOLDERS = {
  TEST: "pms/test",
  PRODUCTS: "pms/products",
  CATEGORIES: "pms/categories",
} as const;

export type CloudinaryFolder = typeof CLOUDINARY_FOLDERS[keyof typeof CLOUDINARY_FOLDERS];

export interface UploadImageResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format?: string;
}

/**
 * Uploads an image (base64 string, data URI, or file path) to Cloudinary.
 * @param file - Base64 string, data URI, or file path.
 * @param folder - Cloudinary folder/namespace path (default is pms/test).
 */
export async function uploadImage(
  file: string,
  folder: CloudinaryFolder | string = CLOUDINARY_FOLDERS.TEST
): Promise<UploadImageResult> {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are not configured.");
  }

  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: "auto",
    });

    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    };
  } catch (error) {
    console.error("[Cloudinary Upload] Failed to upload image:", error);
    throw error;
  }
}
