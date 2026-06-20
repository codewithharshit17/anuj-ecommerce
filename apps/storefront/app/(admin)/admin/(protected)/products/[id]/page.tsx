import prisma from "@/lib/prisma";
import ProductFormClient from "@/components/admin/ProductFormClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        variants: true,
      },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!product) {
    notFound();
  }

  const formattedProduct = {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    mrp: product.mrp,
    categoryId: product.categoryId,
    lowStockThreshold: product.lowStockThreshold,
    imageUrl: product.images.find((img) => img.isPrimary)?.url || product.images[0]?.url || "",
    stock: product.variants[0]?.stock || 0,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
  };

  return (
    <ProductFormClient
      categories={categories}
      initialData={formattedProduct}
    />
  );
}
