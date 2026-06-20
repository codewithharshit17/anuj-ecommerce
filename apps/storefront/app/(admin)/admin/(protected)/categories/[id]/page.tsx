import prisma from "@/lib/prisma";
import CategoryFormClient from "@/components/admin/CategoryFormClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params;

  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    notFound();
  }

  return <CategoryFormClient initialData={category} />;
}
