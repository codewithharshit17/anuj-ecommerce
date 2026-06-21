-- AlterTable
ALTER TABLE "public"."ProductImage" ADD COLUMN     "publicId" TEXT,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;
