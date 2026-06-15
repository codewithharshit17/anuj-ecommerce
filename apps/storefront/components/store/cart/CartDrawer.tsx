// apps/storefront/components/store/cart/CartDrawer.tsx
"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { useUIStore } from "@/components/store/ui-store";
import CartItemComponent from "./CartItem";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const router = useRouter();
  const { isCartOpen, setCartOpen } = useUIStore();
  const items = useCartStore((state) => state.items);
  const drawerRef = useRef<HTMLDivElement>(null);

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  const threshold = 999;
  const isFreeShipping = subtotal >= threshold;
  const remaining = threshold - subtotal;
  const progress = Math.min((subtotal / threshold) * 100, 100);

  // Close drawer on escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) {
        setCartOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, setCartOpen]);

  // Focus trap inside drawer
  useEffect(() => {
    if (isCartOpen && drawerRef.current) {
      const focusableElements = drawerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex="0"]'
      );
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
  }, [isCartOpen]);

  const handleCheckout = () => {
    setCartOpen(false);
    // Checkout redirects to auth gate or cart checkout path
    router.push("/cart");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[200] overflow-hidden" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs cursor-pointer"
            onClick={() => setCartOpen(false)}
          />

          {/* Drawer content */}
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <motion.div
              ref={drawerRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 250 }}
              className="w-screen max-w-[420px] bg-white flex flex-col shadow-2xl relative"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-[var(--ag-gray-200)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={20} className="text-[var(--ag-dark)]" />
                  <span className="font-display font-extrabold text-lg text-[var(--ag-dark)]">
                    Your Cart ({cartCount} {cartCount === 1 ? "item" : "items"})
                  </span>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-2 -mr-2 rounded-lg hover:bg-[var(--ag-gray-100)] text-[var(--ag-gray-800)] transition-colors"
                  aria-label="Close cart"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Free Shipping Progress */}
              {cartCount > 0 && (
                <div className="px-6 py-4 bg-[var(--ag-gray-100)] border-b border-[var(--ag-gray-200)]">
                  <div className="flex items-center justify-between text-xs font-semibold mb-2">
                    {isFreeShipping ? (
                      <motion.span
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-emerald-600 flex items-center gap-1"
                      >
                        🎉 Free shipping unlocked!
                      </motion.span>
                    ) : (
                      <span className="text-[var(--ag-gray-800)]">
                        Add <span className="font-extrabold text-[var(--ag-red)]">₹{remaining}</span> more for Free Shipping
                      </span>
                    )}
                    <span className="text-[var(--ag-gray-500)]">Threshold: ₹{threshold}</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--ag-red)] rounded-full transition-all duration-600 ease-out-expo"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-[var(--ag-gray-100)] flex items-center justify-center mb-4 text-[var(--ag-gray-500)]">
                      <ShoppingBag size={28} />
                    </div>
                    <h3 className="font-bold text-base text-[var(--ag-dark)] mb-1">
                      Your cart is empty
                    </h3>
                    <p className="text-sm text-[var(--ag-gray-500)] mb-6 max-w-[280px]">
                      Add items to your cart to see them here. Free delivery above ₹999!
                    </p>
                    <button
                      onClick={() => setCartOpen(false)}
                      className="px-6 py-2.5 bg-[var(--ag-red)] text-white text-sm font-bold rounded-[var(--radius-md)] hover:bg-[var(--ag-red-hover)] transition-all"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-[var(--ag-gray-200)]">
                    {items.map((item) => (
                      <CartItemComponent key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-[var(--ag-gray-200)] p-6 bg-white shrink-0 shadow-inner">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-[var(--ag-gray-500)]">
                      Subtotal
                    </span>
                    <span className="text-xl font-extrabold text-[var(--ag-dark)]">
                      ₹{subtotal}
                    </span>
                  </div>

                  <p className="text-[11px] text-[var(--ag-gray-500)] mb-4 leading-normal text-center">
                    Taxes and shipping charges calculated at checkout.
                  </p>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={handleCheckout}
                      className="w-full py-3.5 bg-[var(--ag-red)] hover:bg-[var(--ag-red-hover)] text-white font-bold rounded-[var(--radius-md)] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-sm select-none"
                    >
                      PROCEED TO CHECKOUT
                    </button>
                    <button
                      onClick={() => setCartOpen(false)}
                      className="w-full py-2.5 bg-transparent border border-[var(--ag-gray-200)] text-[var(--ag-dark)] font-bold text-sm rounded-[var(--radius-md)] hover:bg-[var(--ag-gray-100)] transition-all select-none"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
