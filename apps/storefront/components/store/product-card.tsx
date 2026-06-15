"use client";

import Link from "next/link";
import { Heart, Star, ShoppingCart, Eye } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/lib/store/cart-store";

interface ProductCardProps {
  id: number;
  slug: string;
  name: string;
  price: number;
  image: string;
  badge?: "sale" | "new" | "hot";
  rating?: number;
  reviewCount?: number;
}

export default function ProductCard({
  id,
  slug,
  name,
  price,
  image,
  badge = "sale",
  rating = 4.5,
  reviewCount = 124,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [imageError, setImageError] = useState(false);

  const originalPrice = Math.round(price * 2.2);
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id, name, price, image, quantity: 1 });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1800);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted((v) => !v);
  };

  const badgeStyles: Record<string, React.CSSProperties> = {
    sale: { background: "var(--brand-coral)", color: "white" },
    new: { background: "#4A9B8E", color: "white" },
    hot: { background: "#F5A623", color: "var(--brand-navy)" },
  };

  const badgeLabel: Record<string, string> = {
    sale: `${discount}% OFF`,
    new: "NEW",
    hot: "HOT",
  };

  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  return (
    <div
      className="group relative rounded-2xl overflow-hidden bg-white border transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
      style={{
        borderColor: "#EAE4DD",
        boxShadow: "var(--shadow-card)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "var(--shadow-card-hover)";
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "rgba(232,68,42,0.2)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "var(--shadow-card)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "#EAE4DD";
      }}
    >
      <Link href={`/products/${slug}`}>
        {/* ── Image Area ── */}
        <div
          className="relative overflow-hidden"
          style={{ aspectRatio: "4/3", background: "#F9F6F3" }}
        >
          <img
            src={imageError ? "https://placehold.co/400x300/F9F6F3/C8B8A8?text=KAPI+PEN" : image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
            onError={() => setImageError(true)}
            style={{ transform: "scale(1)" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />

          {/* Badge */}
          <div
            className="absolute top-3 left-3 text-[11px] font-black px-2.5 py-1 rounded-lg tracking-wide uppercase shadow-sm"
            style={badgeStyles[badge]}
          >
            {badgeLabel[badge]}
          </div>

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95"
            style={{
              background: isWishlisted
                ? "var(--brand-coral)"
                : "rgba(255,255,255,0.92)",
              border: "1px solid rgba(255,255,255,0.5)",
            }}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              size={14}
              fill={isWishlisted ? "white" : "none"}
              style={{ color: isWishlisted ? "white" : "var(--brand-navy)" }}
            />
          </button>

          {/* Hover overlay with Quick View */}
          <div
            className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
            style={{ background: "rgba(26,35,64,0.35)", backdropFilter: "blur(2px)" }}
          >
            <Link
              href={`/products/${slug}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
              style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <Eye size={14} />
              Quick View
            </Link>
          </div>
        </div>

        {/* ── Info Area ── */}
        <div className="p-4">
          {/* Product name */}
          <h3
            className="font-semibold text-sm leading-snug line-clamp-2 mb-2 transition-colors group-hover:text-[var(--brand-coral)]"
            style={{ color: "var(--brand-navy)" }}
          >
            {name}
          </h3>

          {/* Star Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={11}
                  fill={
                    star <= fullStars
                      ? "#F5A623"
                      : hasHalf && star === fullStars + 1
                      ? "#F5A623"
                      : "none"
                  }
                  style={{
                    color:
                      star <= fullStars ||
                      (hasHalf && star === fullStars + 1)
                        ? "#F5A623"
                        : "#DDD",
                  }}
                />
              ))}
            </div>
            <span
              className="text-[11px] font-medium"
              style={{ color: "var(--muted-foreground)" }}
            >
              ({reviewCount})
            </span>
          </div>

          {/* Pricing */}
          <div className="flex items-end justify-between gap-2">
            <div>
              <div
                className="text-lg font-black leading-none"
                style={{ color: "var(--brand-coral)" }}
              >
                ₹{price}
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className="text-xs line-through"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  ₹{originalPrice}
                </span>
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                  style={{
                    background: "#DCFCE7",
                    color: "#16A34A",
                  }}
                >
                  {discount}% off
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* ── Add to Cart Button ── */}
      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95"
          style={{
            background: addedToCart
              ? "#16A34A"
              : "linear-gradient(135deg, #E8442A, #C7321A)",
            color: "white",
            boxShadow: addedToCart
              ? "0 4px 14px rgba(22,163,74,0.35)"
              : "0 4px 14px rgba(232,68,42,0.3)",
          }}
        >
          {addedToCart ? (
            <>
              <span>✓</span>
              Added to Cart!
            </>
          ) : (
            <>
              <ShoppingCart size={14} />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
