import prisma from "@/lib/prisma";
import OrderDetailClient from "@/components/admin/OrderDetailClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: {
        include: {
          addresses: true,
        },
      },
      items: {
        include: {
          product: {
            include: {
              images: true,
            },
          },
          variant: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  // Coerce order details to match the client component requirements
  return <OrderDetailClient order={order as unknown as Parameters<typeof OrderDetailClient>[0]["order"]} />;
}
