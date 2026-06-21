import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

async function debugCloudinary() {
  console.log("=== CLOUDINARY DEBUG ===");
  console.log("process.env.CLOUDINARY_CLOUD_NAME:", JSON.stringify(process.env.CLOUDINARY_CLOUD_NAME));
  console.log("process.env.CLOUDINARY_API_KEY:", JSON.stringify(process.env.CLOUDINARY_API_KEY));
  console.log("process.env.CLOUDINARY_API_SECRET (exists?):", !!process.env.CLOUDINARY_API_SECRET);

  // Configure directly from .env values
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  const activeConfig = cloudinary.config();
  console.log("Active configuration in SDK:");
  console.log("cloud_name:", JSON.stringify(activeConfig.cloud_name));
  console.log("api_key:", JSON.stringify(activeConfig.api_key));
  console.log("api_secret (exists?):", !!activeConfig.api_secret);

  try {
    console.log("\nPinging Cloudinary...");
    const pingResult = await cloudinary.api.ping();
    console.log("Ping successful:", pingResult);
  } catch (err) {
    console.error("Ping failed:", err);
  }

  try {
    console.log("\nTrying test upload of 1x1 transparent pixel...");
    const sampleImageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    const uploadResult = await cloudinary.uploader.upload(sampleImageBase64, {
      folder: "pms/test",
    });
    console.log("Upload successful:", uploadResult.secure_url);
  } catch (err) {
    console.error("Upload failed:", err);
  }
}

debugCloudinary();
