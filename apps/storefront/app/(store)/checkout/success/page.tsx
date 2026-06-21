// apps/storefront/app/(store)/checkout/success/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle,
  ShoppingBag,
  MapPin,
  Truck,
  ChevronRight,
} from "lucide-react";
import { useCartStore, CartItem } from "@/lib/store/cart-store";
import { useCheckoutStore } from "@/lib/store/checkout-store";

interface PlacedAddress {
  name: string;
  mobile: string;
  address: string;
}

export default function CheckoutSuccessPage() {
  const cartItems = useCartStore((state) => state.items);

  const contact = useCheckoutStore((state) => state.contact);
  const shipping = useCheckoutStore((state) => state.shipping);
  const deliveryMethod = useCheckoutStore((state) => state.deliveryMethod);
  const resetCheckout = useCheckoutStore((state) => state.resetCheckout);

  const [orderId] = useState(
    () => "KP-" + Math.floor(100000 + Math.random() * 900000),
  );
  const [placedItems] = useState<CartItem[]>(() => cartItems);
  const [placedAddress] = useState<PlacedAddress | null>(() => {
    if (cartItems.length === 0) return null;
    return {
      name: contact.fullName,
      mobile: contact.mobile,
      address: `${shipping.addressLine1}, ${shipping.addressLine2 ? shipping.addressLine2 + ", " : ""}${shipping.city}, ${shipping.state} - ${shipping.pinCode}`,
    };
  });

  useEffect(() => {
    // Clear the Cart Store
    if (cartItems.length > 0) {
      useCartStore.setState({ items: [] });
    }

    // Reset Checkout Store
    return () => {
      resetCheckout();
    };
  }, [cartItems.length, resetCheckout]);

  // Calculate estimated delivery date: 3 days for Express, 6 days for Standard
  const getDeliveryDate = () => {
    const isExpress = deliveryMethod === "express";
    const days = isExpress ? 3 : 6;
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[var(--ag-gray-100)] dark:bg-neutral-950 py-12 select-none flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto px-4 text-center">
        {/* Animated Check */}
        <div className="flex flex-col items-center mb-6">
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4"
          >
            <CheckCircle size={36} className="stroke-[2.5]" />
          </motion.div>

          <h1 className="text-2xl sm:text-3xl font-display font-black text-[var(--ag-dark)] dark:text-white tracking-tight">
            Order Placed Successfully!
          </h1>
          <p className="text-sm font-semibold text-[var(--ag-gray-500)] mt-1.5">
            Thank you for shopping with Personal Marketing Store. Your order has been confirmed.
          </p>
        </div>

        {/* Details Card */}
        <div className="bg-white dark:bg-[#1E1E1E] border border-[var(--ag-gray-200)] dark:border-neutral-850 rounded-[var(--radius-2xl)] p-6 shadow-sm text-left space-y-5">
          {/* Order Meta details */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--ag-gray-100)] dark:border-neutral-800 pb-4">
            <div>
              <span className="text-[10px] font-black text-[var(--ag-gray-500)] uppercase tracking-wider block">
                Order Reference ID
              </span>
              <span className="text-base font-black text-[var(--ag-dark)] dark:text-white tracking-tight">
                {orderId || "KP-481923"}
              </span>
            </div>
            <div className="sm:text-right">
              <span className="text-[10px] font-black text-[var(--ag-gray-500)] uppercase tracking-wider block">
                Estimated Delivery
              </span>
              <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-500 flex items-center gap-1.5 mt-0.5">
                <Truck size={14} /> {getDeliveryDate()}
              </span>
            </div>
          </div>

          {/* Delivery Address */}
          {placedAddress && (
            <div className="flex gap-3 text-xs font-semibold text-[var(--ag-gray-800)] dark:text-neutral-300">
              <MapPin
                size={16}
                className="text-[var(--ag-red)] shrink-0 mt-0.5"
              />
              <div>
                <span className="font-black text-[var(--ag-dark)] dark:text-white block mb-0.5">
                  Shipping to:
                </span>
                <p>
                  {placedAddress.name} ({placedAddress.mobile})
                </p>
                <p className="text-[var(--ag-gray-500)] mt-0.5">
                  {placedAddress.address}
                </p>
              </div>
            </div>
          )}

          {/* Summary Items list */}
          {placedItems.length > 0 && (
            <div className="border-t border-[var(--ag-gray-100)] dark:border-neutral-800 pt-4">
              <span className="text-[10px] font-black text-[var(--ag-gray-500)] uppercase tracking-wider block mb-3">
                Items Purchased
              </span>
              <div className="divide-y divide-[var(--ag-gray-100)] dark:divide-neutral-850 max-h-[140px] overflow-y-auto pr-1">
                {placedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-2 first:pt-0 last:pb-0 text-xs font-semibold"
                  >
                    <span className="text-[var(--ag-dark)] dark:text-white truncate max-w-[70%]">
                      {item.name}{" "}
                      <span className="text-[var(--ag-gray-500)]">
                        × {item.quantity}
                      </span>
                    </span>
                    <span className="text-[var(--ag-dark)] dark:text-white font-bold">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
          <Link
            href="/products"
            className="px-6 py-3.5 bg-[var(--ag-red)] hover:bg-[var(--ag-red-hover)] text-white font-black text-xs rounded-[var(--radius-lg)] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ShoppingBag size={14} />
            CONTINUE SHOPPING
          </Link>

          <Link
            href="/"
            className="px-6 py-3.5 bg-white dark:bg-neutral-850 hover:bg-[var(--ag-gray-100)] dark:hover:bg-neutral-800 text-[var(--ag-dark)] dark:text-white border border-[var(--ag-gray-200)] dark:border-neutral-850 font-black text-xs rounded-[var(--radius-lg)] transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            GO TO HOME
            <ChevronRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
