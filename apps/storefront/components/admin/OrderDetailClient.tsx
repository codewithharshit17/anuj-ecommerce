"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, MapPin, CreditCard, ShoppingBag, Loader2, ArrowRight } from "lucide-react";
import { updateOrderStatus } from "@/lib/actions/admin-orders";
import { OrderStatus } from "@prisma/client";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    images: { url: string }[];
  };
  variant: {
    optionName: string;
    optionValue: string;
  } | null;
}

interface Address {
  id: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: string;
  totalAmount: number;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  createdAt: Date | string;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    addresses: Address[];
  };
  items: OrderItem[];
}

interface OrderDetailClientProps {
  order: OrderDetail;
}

export default function OrderDetailClient({ order }: OrderDetailClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<OrderStatus>(order.status);

  const customerName =
    order.user.firstName || order.user.lastName
      ? `${order.user.firstName ?? ""} ${order.user.lastName ?? ""}`.trim()
      : order.user.email;

  // Shipping address (default or first address)
  const shippingAddress =
    order.user.addresses.find((addr) => addr.isDefault) || order.user.addresses[0];

  // Legal transitions helper
  const getAvailableTransitions = (current: OrderStatus): OrderStatus[] => {
    if (current === OrderStatus.CANCELLED || current === OrderStatus.DELIVERED) {
      return [];
    }
    switch (current) {
      case OrderStatus.PENDING:
        return [OrderStatus.PROCESSING, OrderStatus.CANCELLED];
      case OrderStatus.PROCESSING:
        return [OrderStatus.SHIPPED, OrderStatus.CANCELLED];
      case OrderStatus.SHIPPED:
        return [OrderStatus.DELIVERED];
      default:
        return [];
    }
  };

  const transitions = getAvailableTransitions(order.status);

  const handleStatusChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (status === order.status) return;

    startTransition(async () => {
      const res = await updateOrderStatus(order.id, status);
      if (res.success) {
        router.refresh();
      } else {
        setError(res.error || "Failed to update order status");
        setStatus(order.status); // reset
      }
    });
  };

  return (
    <div className="space-y-8 animate-scaleIn">
      {/* Back button and title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="p-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-150 transition-colors shadow-sm"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-display text-zinc-900 dark:text-zinc-50">
                Order #{order.orderNumber}
              </h1>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  order.status === "DELIVERED"
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450 border border-emerald-200 dark:border-emerald-900/30"
                    : order.status === "PROCESSING" || order.status === "SHIPPED"
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-450 border border-blue-200 dark:border-blue-900/30"
                    : order.status === "CANCELLED"
                    ? "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-450 border border-red-200 dark:border-red-900/30"
                    : "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-450 border border-amber-200 dark:border-amber-900/30"
                }`}
              >
                {order.status}
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
        </div>

        {/* Transition Status Form */}
        {transitions.length > 0 && (
          <form onSubmit={handleStatusChange} className="flex items-center gap-3 bg-white dark:bg-zinc-950 p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value={order.status}>No Change</option>
              {transitions.map((t) => (
                <option key={t} value={t}>
                  Transition to {t}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={isPending || status === order.status}
              className="flex items-center gap-1 bg-red-600 hover:bg-red-700 disabled:bg-zinc-100 dark:disabled:bg-zinc-900 text-white disabled:text-zinc-400 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
            >
              {isPending ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <ArrowRight className="size-3" />
              )}
              <span>Update Status</span>
            </button>
          </form>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 border border-red-200 dark:border-red-900/50 rounded-lg text-xs font-medium max-w-xl">
          {error}
        </div>
      )}

      {/* Detail grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 space-y-4">
            <h3 className="text-base font-semibold font-display flex items-center gap-2">
              <ShoppingBag className="size-4 text-zinc-500" /> Items in Order
            </h3>

            <div className="divide-y divide-zinc-150 dark:divide-zinc-800">
              {order.items.map((item) => (
                <div key={item.id} className="flex py-4 gap-4 items-center justify-between">
                  <div className="flex gap-3 items-center min-w-0">
                    <div className="size-12 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden shrink-0 flex items-center justify-center relative">
                      {item.product.images[0]?.url ? (
                        <img
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <ShoppingBag className="size-6 text-zinc-400" />
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[280px] sm:max-w-[400px]">
                        {item.product.name}
                      </p>
                      {item.variant && (
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {item.variant.optionName}: {item.variant.optionValue}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      ₹{item.price} x {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total aggregation bar */}
            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 flex justify-between items-baseline">
              <span className="text-sm font-semibold text-zinc-500">Order Grand Total</span>
              <span className="text-xl font-bold text-red-600 dark:text-red-500 font-display">
                ₹{order.totalAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* Customer and Payment sidebar */}
        <div className="space-y-6">
          {/* Customer profile */}
          <div className="bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 space-y-4">
            <h3 className="text-base font-semibold font-display flex items-center gap-2">
              <User className="size-4 text-zinc-500" /> Customer Information
            </h3>
            <div>
              <Link
                href={`/admin/customers/${order.user.id}`}
                className="font-bold text-sm text-zinc-900 dark:text-zinc-100 hover:text-red-650 hover:underline"
              >
                {customerName}
              </Link>
              <p className="text-xs text-zinc-500 mt-0.5">{order.user.email}</p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 space-y-4">
            <h3 className="text-base font-semibold font-display flex items-center gap-2">
              <MapPin className="size-4 text-zinc-500" /> Shipping Destination
            </h3>
            {shippingAddress ? (
              <div className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                <p className="font-semibold text-zinc-850 dark:text-zinc-200">{customerName}</p>
                <p>{shippingAddress.line1}</p>
                {shippingAddress.line2 && <p>{shippingAddress.line2}</p>}
                <p>
                  {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
                </p>
              </div>
            ) : (
              <p className="text-xs italic text-zinc-400">
                No delivery address details synced.
              </p>
            )}
          </div>

          {/* Payment metadata */}
          <div className="bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 space-y-4">
            <h3 className="text-base font-semibold font-display flex items-center gap-2">
              <CreditCard className="size-4 text-zinc-500" /> Razorpay Verification
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500">Payment Status</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded-full border ${
                    order.paymentStatus === "COMPLETED"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450 border-emerald-200 dark:border-emerald-900/30"
                      : "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-450 border border-amber-200 dark:border-amber-900/30"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
              {order.razorpayOrderId && (
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Razorpay Order ID
                  </p>
                  <p className="font-mono text-xs text-zinc-700 dark:text-zinc-300 select-all truncate">
                    {order.razorpayOrderId}
                  </p>
                </div>
              )}
              {order.razorpayPaymentId && (
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Razorpay Payment ID
                  </p>
                  <p className="font-mono text-xs text-zinc-700 dark:text-zinc-300 select-all truncate">
                    {order.razorpayPaymentId}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
