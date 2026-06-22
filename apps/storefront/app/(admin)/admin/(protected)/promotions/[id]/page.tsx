import prisma from "@/lib/prisma";
import PromotionFormClient from "@/components/admin/PromotionFormClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPromotionPage({ params }: PageProps) {
  const { id } = await params;

  const [promotion, products, categories] = await Promise.all([
    prisma.promotion.findUnique({
      where: { id },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!promotion || promotion.isDeleted) {
    notFound();
  }

  const formattedPromotion = {
    id: promotion.id,
    title: promotion.title,
    subtitle: promotion.subtitle,
    description: promotion.description,
    imageUrl: promotion.imageUrl,
    buttonText: promotion.buttonText,
    redirectType: promotion.redirectType,
    redirectId: promotion.redirectId,
    isActive: promotion.isActive,
    startDate: promotion.startDate,
    endDate: promotion.endDate,
    displayOrder: promotion.displayOrder,
  };

  return (
    <PromotionFormClient
      products={products}
      categories={categories}
      initialData={formattedPromotion}
    />
  );
}
