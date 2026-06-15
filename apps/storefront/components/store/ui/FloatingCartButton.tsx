// apps/storefront/components/store/ui/FloatingCartButton.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { useUIStore } from "@/components/store/ui-store";

export default function FloatingCartButton() {
  const { items } = useCartStore();
  const { setCartOpen } = useUIStore();

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <AnimatePresence>
      {cartCount > 0 && (
        <motion.button
          onClick={() => setCartOpen(true)}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
          className="fixed bottom-24 right-6 z-[180] md:hidden w-14 h-14 rounded-full bg-[var(--ag-red)] hover:bg-[var(--ag-red-hover)] text-white flex items-center justify-center shadow-lg cursor-pointer"
          aria-label={`Open Cart with ${cartCount} items`}
        >
          <ShoppingBag size={22} />
          {/* Badge */}
          <span className="absolute -top-1.5 -right-1.5 bg-[var(--ag-yellow)] text-[var(--ag-dark)] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md">
            {cartCount}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
