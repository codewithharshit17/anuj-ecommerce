import prisma from "@/lib/prisma";
import CustomerDetailClient from "@/components/admin/CustomerDetailClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CustomerDetailPage({ params }: PageProps) {
  const { id } = await params;

  const customer = await prisma.user.findUnique({
    where: { id },
    include: {
      addresses: true,
      orders: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!customer || customer.role !== "CUSTOMER") {
    notFound();
  }

  return <CustomerDetailClient customer={customer as unknown as Parameters<typeof CustomerDetailClient>[0]["customer"]} />;
}
