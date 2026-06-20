import prisma from "@/lib/prisma";
import CustomersTableClient from "@/components/admin/CustomersTableClient";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  // Fetch customers with their orders to compute aggregates
  const customers = await prisma.user.findMany({
    where: {
      role: "CUSTOMER",
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      createdAt: true,
      orders: {
        select: {
          totalAmount: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-zinc-900 dark:text-zinc-50">
          Customer Insights
        </h1>
        <p className="text-sm text-zinc-500">
          Analyze customer lifetime values, buying patterns, and manage client profiles
        </p>
      </div>

      <CustomersTableClient initialCustomers={customers as unknown as Parameters<typeof CustomersTableClient>[0]["initialCustomers"]} />
    </div>
  );
}
