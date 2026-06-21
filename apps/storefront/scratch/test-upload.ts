import dotenv from "dotenv";
import path from "path";

// Load .env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { uploadImage, CLOUDINARY_FOLDERS } from "../lib/cloudinary/upload-image";

async function runTest() {
  console.log("Environment variables loaded:");
  console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME ? "PRESENT" : "MISSING");
  console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY ? "PRESENT" : "MISSING");
  console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "PRESENT" : "MISSING");

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error("Cannot run test: Cloudinary credentials are missing. Please add them to your .env file.");
    process.exit(1);
  }

  try {
    // 1x1 transparent pixel base64 image
    const sampleImageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    console.log("Uploading test transparent pixel to Cloudinary...");
    const result = await uploadImage(sampleImageBase64, CLOUDINARY_FOLDERS.TEST);
    console.log("Upload SUCCESSFUL!");
    console.log("Result:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Upload FAILED:", error);
  }
}

runTest();
