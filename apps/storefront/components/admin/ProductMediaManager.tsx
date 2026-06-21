"use client";

import React, { useState, useRef, DragEvent } from "react";
import { Upload, X, Star, ArrowLeft, ArrowRight, Image as ImageIcon, Loader2 } from "lucide-react";

export interface MediaManagerImage {
  id?: string; // local db id if exists
  url: string;
  publicId?: string;
  isPrimary: boolean;
  sortOrder: number;
  isUploading?: boolean;
  progress?: number;
  error?: string;
}

interface ProductMediaManagerProps {
  images: MediaManagerImage[];
  onChange: React.Dispatch<React.SetStateAction<MediaManagerImage[]>>;
  productName?: string;
}

export default function ProductMediaManager({
  images,
  onChange,
  productName = "Product",
}: ProductMediaManagerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Normalize and sort images by sortOrder ascending
  const sortedImages = [...images].sort((a, b) => a.sortOrder - b.sortOrder);

  const handleFiles = async (files: FileList) => {
    setUploadErrors([]);
    const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      setUploadErrors(["Please select valid image files."]);
      return;
    }

    // Determine current maximum sort order
    const maxSortOrder = images.length > 0 ? Math.max(...images.map((img) => img.sortOrder)) : -1;

    // Create temporary images for progress indication
    const newTempImages: MediaManagerImage[] = imageFiles.map((file, idx) => ({
      url: URL.createObjectURL(file), // temporary local URL for preview
      isPrimary: images.length === 0 && idx === 0, // make primary if there are no existing images and this is the first uploaded
      sortOrder: maxSortOrder + idx + 1,
      isUploading: true,
    }));

    // Add temp images to state
    const currentImages = [...images, ...newTempImages];
    onChange(currentImages);

    // Process each upload sequentially or concurrently
    await Promise.all(
      imageFiles.map(async (file, idx) => {
        const tempImg = newTempImages[idx];
        const formData = new FormData();
        formData.append("file", file);

        try {
          const res = await fetch("/api/admin/media/upload", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || "Upload failed");
          }

          const data = await res.json();
          if (!data.success) {
            throw new Error(data.error || "Upload failed");
          }

          // Update this specific temp image to the finalized version
          onChange((prevImages) =>
            prevImages.map((img) => {
              if (img.url === tempImg.url) {
                return {
                  url: data.secure_url,
                  publicId: data.public_id,
                  isPrimary: img.isPrimary,
                  sortOrder: img.sortOrder,
                  isUploading: false,
                };
              }
              return img;
            })
          );
        } catch (error: any) {
          console.error("Error uploading file:", error);
          setUploadErrors((prev) => [...prev, `Failed to upload ${file.name}: ${error.message}`]);

          // Remove the failed temporary image from the state
          onChange((prevImages) => prevImages.filter((img) => img.url !== tempImg.url));
        }
      })
    );
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const setPrimary = (targetUrl: string) => {
    const updated = images.map((img) => ({
      ...img,
      isPrimary: img.url === targetUrl,
    }));
    onChange(updated);
  };

  const removeImage = (targetUrl: string) => {
    const remaining = images.filter((img) => img.url !== targetUrl);
    
    // If the deleted image was primary and we have other images left, select a new primary
    const deletedWasPrimary = images.find((img) => img.url === targetUrl)?.isPrimary;
    if (deletedWasPrimary && remaining.length > 0) {
      // Find image with lowest sortOrder to make primary
      const sortedRemaining = [...remaining].sort((a, b) => a.sortOrder - b.sortOrder);
      sortedRemaining[0].isPrimary = true;
    }

    // Re-index sortOrder to ensure consecutive values starting at 0
    const reindexed = remaining
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((img, index) => ({
        ...img,
        sortOrder: index,
      }));

    onChange(reindexed);
  };

  const moveImage = (index: number, direction: "left" | "right") => {
    const newSorted = [...sortedImages];
    const targetIndex = direction === "left" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newSorted.length) return;

    // Swap the elements
    const temp = newSorted[index];
    newSorted[index] = newSorted[targetIndex];
    newSorted[targetIndex] = temp;

    // Re-assign clean sequential sortOrder values
    const updated = newSorted.map((img, idx) => ({
      ...img,
      sortOrder: idx,
    }));

    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={triggerFileInput}
        className={`relative overflow-hidden rounded-xl border-2 border-dashed p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[160px] ${
          isDragging
            ? "border-red-500 bg-red-500/5 dark:bg-red-500/10 shadow-lg shadow-red-500/5"
            : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/40 hover:border-zinc-300 dark:hover:border-zinc-700"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          multiple
          accept="image/*"
          className="hidden"
        />

        <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-850 rounded-xl mb-3 shadow-sm">
          <Upload className="size-6 text-zinc-400 dark:text-zinc-500" />
        </div>

        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          Upload Product Media
        </h3>
        <p className="text-xs text-zinc-500 mt-1 max-w-xs">
          Drag and drop product images here, or click to browse. Multiple file uploads are supported.
        </p>

        {/* Backdrop Glow effect */}
        <div className="absolute inset-0 -z-10 bg-radial-gradient from-red-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Errors display */}
      {uploadErrors.length > 0 && (
        <div className="p-3 bg-red-55/10 border border-red-500/20 text-red-500 rounded-lg text-xs space-y-1">
          {uploadErrors.map((err, idx) => (
            <div key={idx}>{err}</div>
          ))}
        </div>
      )}

      {/* Images Grid */}
      {sortedImages.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {sortedImages.map((img, index) => {
            const isFirst = index === 0;
            const isLast = index === sortedImages.length - 1;

            return (
              <div
                key={img.url}
                className={`group relative rounded-xl overflow-hidden border bg-white dark:bg-zinc-950 flex flex-col shadow-sm transition-all duration-300 hover:shadow-md ${
                  img.isPrimary
                    ? "border-red-550 ring-2 ring-red-550/20 dark:ring-red-550/30"
                    : "border-zinc-200 dark:border-zinc-800"
                }`}
              >
                {/* Image Aspect ratio container */}
                <div className="relative aspect-square w-full bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-center overflow-hidden border-b border-zinc-150 dark:border-zinc-850">
                  {img.isUploading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/60 backdrop-blur-xs text-white p-3">
                      <Loader2 className="size-6 animate-spin text-red-500 mb-1" />
                      <span className="text-[10px] font-medium tracking-wider uppercase opacity-80">Uploading...</span>
                    </div>
                  ) : null}

                  <img
                    src={img.url}
                    alt={productName}
                    className={`object-cover w-full h-full transition-transform duration-550 group-hover:scale-105 ${
                      img.isUploading ? "blur-xs" : ""
                    }`}
                  />

                  {/* Badges/Toggles top bar */}
                  {!img.isUploading && (
                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-auto">
                      <button
                        type="button"
                        onClick={() => setPrimary(img.url)}
                        title={img.isPrimary ? "Primary Product Cover" : "Set as Primary Cover"}
                        className={`p-1.5 rounded-lg shadow-sm border transition-all cursor-pointer ${
                          img.isPrimary
                            ? "bg-amber-500 border-amber-600 text-white"
                            : "bg-white/90 dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-amber-500"
                        }`}
                      >
                        <Star className={`size-3.5 ${img.isPrimary ? "fill-current" : ""}`} />
                      </button>

                      <button
                        type="button"
                        onClick={() => removeImage(img.url)}
                        title="Delete Image"
                        className="p-1.5 rounded-lg bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-red-500 shadow-sm transition-all cursor-pointer"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Operations footer (Sort buttons / details) */}
                <div className="p-2 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-950 text-xs">
                  <span className="text-[10px] text-zinc-450 dark:text-zinc-500 font-semibold uppercase tracking-wider">
                    {img.isPrimary ? "Primary Cover" : `Image #${index + 1}`}
                  </span>

                  {!img.isUploading && sortedImages.length > 1 && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={isFirst}
                        onClick={() => moveImage(index, "left")}
                        title="Move Left / Prioritize"
                        className="p-1 text-zinc-450 dark:text-zinc-500 hover:text-zinc-850 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={isLast}
                        onClick={() => moveImage(index, "right")}
                        title="Move Right"
                        className="p-1 text-zinc-450 dark:text-zinc-500 hover:text-zinc-850 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                      >
                        <ArrowRight className="size-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 rounded-xl border border-zinc-150 dark:border-zinc-850 bg-zinc-50/30 dark:bg-zinc-950/20 text-zinc-400">
          <ImageIcon className="size-8 stroke-[1.5] mb-2 opacity-60" />
          <span className="text-xs font-medium">No images uploaded yet</span>
        </div>
      )}
    </div>
  );
}
