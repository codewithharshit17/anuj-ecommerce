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
    salePrice: product.salePrice,
    categoryId: product.categoryId,
    lowStockThreshold: product.lowStockThreshold,
    images: product.images.map((img) => ({
      id: img.id,
      url: img.url,
      publicId: img.publicId ?? undefined,
      isPrimary: img.isPrimary,
      sortOrder: img.sortOrder,
    })).sort((a, b) => a.sortOrder - b.sortOrder),
    stock: product.variants[0]?.stock || 0,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    brandName: product.brandName,
    brandDescription: product.brandDescription,
    specifications: product.specifications,
  };

  return (
    <ProductFormClient
      categories={categories}
      initialData={formattedProduct}
    />
  );
}
