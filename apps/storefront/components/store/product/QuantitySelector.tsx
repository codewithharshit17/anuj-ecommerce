// apps/storefront/components/store/product/QuantitySelector.tsx
"use client";

import { Plus, Minus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  max?: number;
  onChange: (val: number) => void;
}

export default function QuantitySelector({ quantity, max = 99, onChange }: QuantitySelectorProps) {
  const handleDecrease = () => {
    if (quantity > 1) {
      onChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  return (
    <div className="flex items-center select-none">
      <span className="text-xs font-bold uppercase tracking-wider text-[var(--ag-gray-500)] mr-3">
        Quantity:
      </span>
      <div className="flex items-center border border-[var(--ag-gray-200)] rounded-[var(--radius-sm)] overflow-hidden bg-[var(--ag-gray-100)] h-9">
        <button
          onClick={handleDecrease}
          disabled={quantity <= 1}
          className="w-9 h-full flex items-center justify-center hover:bg-white dark:hover:bg-[#2D2D2D] text-[var(--ag-gray-800)] disabled:opacity-40 transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus size={13} />
        </button>
        <span className="w-10 text-center text-sm font-bold text-[var(--ag-dark)]">
          {quantity}
        </span>
        <button
          onClick={handleIncrease}
          disabled={quantity >= max}
          className="w-9 h-full flex items-center justify-center hover:bg-white dark:hover:bg-[#2D2D2D] text-[var(--ag-gray-800)] disabled:opacity-40 transition-colors"
          aria-label="Increase quantity"
        >
          <Plus size={13} />
        </button>
      </div>
    </div>
  );
}
