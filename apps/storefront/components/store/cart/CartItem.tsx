// apps/storefront/components/store/cart/CartItem.tsx
"use client";

import { motion } from "framer-motion";
import { Trash2, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";

interface CartItemProps {
  item: {
    id: any;
    name: string;
    price: number;
    image: string;
    quantity: number;
    variantName?: string;
  };
}

export default function CartItemComponent({ item }: CartItemProps) {
  const { removeItem, increaseQuantity, decreaseQuantity } = useCartStore();

  return (
    <div className="flex gap-4 py-4 border-b border-[var(--ag-gray-200)] last:border-b-0">
      {/* Product Image */}
      <div className="w-16 h-16 rounded-[var(--radius-sm)] overflow-hidden border border-[var(--ag-gray-200)] bg-[var(--ag-gray-100)] shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Item info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h4 className="text-sm font-bold text-[var(--ag-dark)] truncate">
            {item.name}
          </h4>
          {item.variantName && (
            <p className="text-xs text-[var(--ag-gray-500)] mt-0.5">
              Variant: {item.variantName}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-2">
          {/* Quantity stepper */}
          <div className="flex items-center border border-[var(--ag-gray-200)] rounded-[var(--radius-sm)] overflow-hidden bg-[var(--ag-gray-100)] h-7">
            <button
              onClick={() => decreaseQuantity(item.id)}
              disabled={item.quantity <= 1}
              className="px-2 h-full flex items-center justify-center hover:bg-white text-[var(--ag-gray-800)] disabled:opacity-40 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={11} />
            </button>
            <motion.span
              key={item.quantity}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-2 text-xs font-bold text-[var(--ag-dark)] min-w-[20px] text-center inline-block"
            >
              {item.quantity}
            </motion.span>
            <button
              onClick={() => increaseQuantity(item.id)}
              className="px-2 h-full flex items-center justify-center hover:bg-white text-[var(--ag-gray-800)] transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={11} />
            </button>
          </div>

          {/* Pricing & delete */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-black text-[var(--ag-dark)]">
              ₹{item.price * item.quantity}
            </span>
            <button
              onClick={() => removeItem(item.id)}
              className="text-[var(--ag-gray-500)] hover:text-[var(--ag-red)] p-1 rounded-md hover:bg-[var(--ag-gray-100)] transition-colors"
              aria-label="Remove item"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
