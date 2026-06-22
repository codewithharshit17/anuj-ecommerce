import prisma from "@/lib/prisma";
import PromotionFormClient from "@/components/admin/PromotionFormClient";

export const dynamic = "force-dynamic";

export default async function NewPromotionPage() {
  const [products, categories] = await Promise.all([
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

  return (
    <PromotionFormClient
      products={products}
      categories={categories}
    />
  );
}
