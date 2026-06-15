// apps/storefront/components/store/home/TrustBar.tsx
"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Truck, ShieldAlert, CreditCard, RotateCcw } from "lucide-react";

interface TrustItem {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
}

const trustItems: TrustItem[] = [
  {
    icon: ShieldCheck,
    title: "100% Genuine Products",
    description: "Sourced directly from global brands",
  },
  {
    icon: Truck,
    title: "Fast Delivery Across India",
    description: "Free shipping on orders above ₹999",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "UPI, Cards, and Net Banking protected",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "7-day hassle free replacement policy",
  },
];

export default function TrustBar() {
  return (
    <section className="w-full bg-white dark:bg-neutral-900 py-6 border-b border-[var(--ag-gray-200)] dark:border-neutral-800 select-none">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex items-center gap-4 p-4 rounded-[var(--radius-lg)] bg-[var(--ag-gray-100)] dark:bg-[#1E1E1E] border border-[var(--ag-gray-200)] dark:border-neutral-850 hover:shadow-sm hover:border-[var(--ag-red)]/35 dark:hover:border-[var(--ag-red)]/35 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-full bg-[var(--ag-red)]/10 text-[var(--ag-red)] flex items-center justify-center shrink-0">
                  <Icon size={20} className="stroke-[2.5]" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-black text-[var(--ag-dark)] dark:text-[var(--foreground)] tracking-tight leading-tight mb-1">
                    {item.title}
                  </h4>
                  <p className="text-[10px] sm:text-xs font-semibold text-[var(--ag-gray-500)] leading-tight truncate">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
