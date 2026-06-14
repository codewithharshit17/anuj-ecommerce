"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";

interface ProductPurchasePanelProps {
  id: number;
  name: string;
  price: number;
  image: string;
}

export default function ProductPurchasePanel({
  id,
  name,
  price,
  image,
}: ProductPurchasePanelProps) {
  const [quantity, setQuantity] = useState(1);

  const addItem = useCartStore((state) => state.addItem);

  return (
    <>
      {/* Quantity Selector */}
      <div className="flex items-center gap-4 mt-8">
        <button
          onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
          className="border px-4 py-2 rounded"
        >
          -
        </button>

        <span className="font-semibold text-lg">{quantity}</span>

        <button
          onClick={() => setQuantity((prev) => prev + 1)}
          className="border px-4 py-2 rounded"
        >
          +
        </button>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 mt-8">
        <Button
          className="
      bg-red-500
      hover:bg-red-600
      min-w-[140px]
    "
        >
          Add To Cart
        </Button>

        <Button variant="outline" className="min-w-[140px]">
          Buy Now
        </Button>
      </div>
    </>
  );
}
