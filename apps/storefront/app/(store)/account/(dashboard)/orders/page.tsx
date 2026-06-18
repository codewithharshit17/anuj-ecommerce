/**
 * Orders Page — `/account/orders`
 *
 * Displays the user's order history. Currently shows an empty state
 * since the order system is not yet implemented.
 */

import { requireAuth } from "@/lib/auth/require-auth";
import prisma from "@/lib/prisma";
import { Package, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "My Orders — KAPI PEN",
};

export default async function OrdersPage() {
  const user = await requireAuth("/account/orders");

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          product: {
            include: { images: { where: { isPrimary: true }, take: 1 } },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-h2 text-[var(--ag-dark)] tracking-tight">
          My Orders
        </h2>
        <p className="text-sm text-[var(--ag-gray-500)] mt-1">
          Track and manage your orders
        </p>
      </div>

      {orders.length === 0 ? (
        /* ── Empty state ── */
        <div className="bg-white dark:bg-[var(--card)] border border-[var(--ag-gray-200)] dark:border-[var(--border)] rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[var(--ag-gray-100)] dark:bg-[var(--muted)] flex items-center justify-center mx-auto mb-4">
            <Package
              size={28}
              className="text-[var(--ag-gray-500)]"
            />
          </div>
          <h3 className="font-bold text-base text-[var(--ag-dark)] mb-1">
            No orders yet
          </h3>
          <p className="text-sm text-[var(--ag-gray-500)] mb-6 max-w-xs mx-auto">
            When you place an order, it will appear here for easy tracking.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[var(--ag-red)] hover:bg-[var(--ag-red-hover)] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-px"
          >
            <ShoppingBag size={16} />
            Start Shopping
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        /* ── Orders list ── */
        <div className="space-y-4">
          {orders.map((order) => {
            const statusColors: Record<string, string> = {
              PENDING: "bg-amber-100 text-amber-700",
              PROCESSING: "bg-blue-100 text-blue-700",
              SHIPPED: "bg-purple-100 text-purple-700",
              DELIVERED: "bg-green-100 text-green-700",
              CANCELLED: "bg-red-100 text-red-700",
            };

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-[var(--card)] border border-[var(--ag-gray-200)] dark:border-[var(--border)] rounded-2xl p-5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-[var(--ag-gray-500)] font-medium">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-[11px] text-[var(--ag-gray-500)]">
                      {new Intl.DateTimeFormat("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }).format(new Date(order.createdAt))}
                    </p>
                  </div>
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${statusColors[order.status] ?? "bg-gray-100 text-gray-700"}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[var(--ag-gray-200)]/50 dark:border-[var(--border)]/50">
                  <p className="text-sm font-bold text-[var(--ag-dark)]">
                    ₹{order.totalAmount.toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs text-[var(--ag-gray-500)]">
                    {order.items.length} item{order.items.length > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
