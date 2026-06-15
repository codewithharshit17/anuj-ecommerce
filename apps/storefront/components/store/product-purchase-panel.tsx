"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart, Zap, Heart } from "lucide-react";
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
  const [addedToCart, setAddedToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({ id, name, price, image, quantity });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div>
        <label
          className="text-xs font-bold uppercase tracking-widest mb-2 block"
          style={{ color: "var(--muted-foreground)" }}
        >
          Quantity
        </label>
        <div
          className="inline-flex items-center rounded-xl overflow-hidden border"
          style={{ borderColor: "#EAE4DD" }}
        >
          <button
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            className="w-10 h-10 flex items-center justify-center transition-colors hover:bg-[#F5F0EB] active:bg-[#EAE4DD]"
            style={{ color: "var(--brand-navy)" }}
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span
            className="w-12 h-10 flex items-center justify-center text-sm font-bold border-x"
            style={{
              color: "var(--brand-navy)",
              borderColor: "#EAE4DD",
              background: "#FAFAFA",
            }}
          >
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((prev) => Math.min(10, prev + 1))}
            className="w-10 h-10 flex items-center justify-center transition-colors hover:bg-[#F5F0EB] active:bg-[#EAE4DD]"
            style={{ color: "var(--brand-navy)" }}
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>
        <span
          className="ml-3 text-xs"
          style={{ color: "var(--muted-foreground)" }}
        >
          Max 10 per order
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-200 active:scale-95"
          style={{
            background: addedToCart
              ? "#16A34A"
              : "linear-gradient(135deg, #E8442A, #C7321A)",
            boxShadow: addedToCart
              ? "0 4px 16px rgba(22,163,74,0.35)"
              : "0 4px 16px rgba(232,68,42,0.35)",
          }}
        >
          {addedToCart ? (
            <>✓ Added to Cart!</>
          ) : (
            <>
              <ShoppingCart size={16} />
              Add to Cart
            </>
          )}
        </button>

        {/* Buy Now */}
        <button
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 border-2 hover:shadow-md active:scale-95"
          style={{
            color: "var(--brand-navy)",
            borderColor: "var(--brand-navy)",
            background: "white",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--brand-navy)";
            (e.currentTarget as HTMLButtonElement).style.color = "white";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "white";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--brand-navy)";
          }}
        >
          <Zap size={16} />
          Buy Now
        </button>

        {/* Wishlist */}
        <button
          onClick={() => setIsWishlisted((v) => !v)}
          className="w-12 h-12 flex items-center justify-center rounded-xl border-2 transition-all hover:scale-105 active:scale-95"
          style={{
            borderColor: isWishlisted ? "var(--brand-coral)" : "#EAE4DD",
            background: isWishlisted ? "rgba(232,68,42,0.05)" : "white",
          }}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={16}
            fill={isWishlisted ? "var(--brand-coral)" : "none"}
            style={{ color: isWishlisted ? "var(--brand-coral)" : "var(--muted-foreground)" }}
          />
        </button>
      </div>

      {/* Total display */}
      {quantity > 1 && (
        <div
          className="px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between"
          style={{
            background: "rgba(232,68,42,0.06)",
            color: "var(--brand-navy)",
            border: "1px solid rgba(232,68,42,0.1)",
          }}
        >
          <span>Total for {quantity} items:</span>
          <span style={{ color: "var(--brand-coral)", fontWeight: 800 }}>
            ₹{price * quantity}
          </span>
        </div>
      )}
    </div>
  );
}
