import { v2 as cloudinary } from "cloudinary";

// Configure statically (may run before env is loaded in some testing contexts due to hoisting)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
  secure: true,
});

/**
 * Returns the configured Cloudinary SDK instance.
 * If the initial static configuration was evaluated before environment variables
 * were loaded, this will re-configure the SDK with the correct runtime values.
 */
export function getConfiguredCloudinary() {
  const currentConfig = cloudinary.config();
  if (!currentConfig.cloud_name || !currentConfig.api_key || !currentConfig.api_secret) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
      api_key: process.env.CLOUDINARY_API_KEY || "",
      api_secret: process.env.CLOUDINARY_API_SECRET || "",
      secure: true,
    });
  }
  return cloudinary;
}

export { cloudinary };
