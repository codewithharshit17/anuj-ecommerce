import prisma from "@/lib/prisma";
import OrdersTableClientWrapper from "@/components/admin/OrdersTableClient";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  // Fetch initial orders
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-zinc-900 dark:text-zinc-50">
          Orders Management
        </h1>
        <p className="text-sm text-zinc-500">
          Monitor incoming customer orders, manage statuses, and track payment conditions
        </p>
      </div>

      <OrdersTableClientWrapper initialOrders={orders as unknown as Parameters<typeof OrdersTableClientWrapper>[0]["initialOrders"]} />
    </div>
  );
}
