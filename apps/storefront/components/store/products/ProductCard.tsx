// apps/storefront/components/store/products/ProductCard.tsx
"use client";

import { motion } from "framer-motion";
import { Heart, Star, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useUIStore } from "@/components/store/ui-store";
import { useCartStore } from "@/lib/store/cart-store";
import { MedusaProduct } from "@/lib/medusa/client";

interface ProductCardProps {
  product: MedusaProduct;
  showVendor?: boolean;
  showBadge?: boolean;
}

export default function ProductCard({ product, showVendor = true, showBadge = true }: ProductCardProps) {
  const { wishlist, toggleWishlist, setCartOpen } = useUIStore();
  const { addItem } = useCartStore();

  const isWishlisted = wishlist.includes(product.id);

  // Price variables
  const price = product.variants[0]?.prices[0]?.amount || 0;
  const originalPrice = product.variants[0]?.prices[0]?.original_amount || Math.round(price * 1.3);
  const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id as any,
      name: product.title,
      price: price,
      image: product.thumbnail,
      quantity: 1,
    });
    setCartOpen(true);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", damping: 30, stiffness: 250 }}
      className="group relative bg-white dark:bg-[#1E1E1E] border border-[var(--ag-gray-200)] rounded-[var(--radius-lg)] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full select-none"
    >
      <Link href={`/products/${product.handle}`} className="flex flex-col h-full">
        {/* Image wrapper */}
        <div className="relative aspect-square w-full bg-[var(--ag-gray-100)] overflow-hidden border-b border-[var(--ag-gray-200)] shrink-0">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out-expo group-hover:scale-1.04"
            loading="lazy"
          />

          {/* Discount badge */}
          {showBadge && discount > 0 && (
            <div className="absolute top-3 left-3 bg-[var(--ag-red)] text-white text-[10px] font-black px-2 py-1 rounded-md shadow-sm">
              -{discount}%
            </div>
          )}

          {/* Wishlist toggle */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white dark:bg-[#1E1E1E] border border-[var(--ag-gray-200)] shadow-sm hover:shadow-md flex items-center justify-center text-[var(--ag-gray-800)] hover:text-[var(--ag-red)] transition-all z-10"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <motion.div
              animate={isWishlisted ? { scale: [1, 1.3, 1] } : { scale: 1 }}
              transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] as any }}
            >
              <Heart
                size={15}
                className={isWishlisted ? "fill-[var(--ag-red)] text-[var(--ag-red)]" : "text-gray-400"}
              />
            </motion.div>
          </button>

          {/* Slide-up Add to Cart button (hover state) */}
          <div className="absolute inset-x-0 bottom-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-250 ease-out-expo hidden sm:block">
            <button
              onClick={handleAddToCart}
              className="w-full py-2 bg-[var(--ag-dark)] hover:bg-[var(--ag-red)] text-white font-bold text-xs rounded-[var(--radius-sm)] flex items-center justify-center gap-1.5 shadow-md transition-colors"
            >
              <ShoppingCart size={12} />
              ADD TO CART
            </button>
          </div>
        </div>

        {/* Content details */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div className="flex flex-col gap-1">
            {/* Vendor/Brand */}
            {showVendor && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--ag-gray-500)]">
                {product.brand}
              </span>
            )}

            {/* Product Title */}
            <h3 className="text-sm font-bold text-[var(--ag-dark)] group-hover:text-[var(--ag-red)] transition-colors line-clamp-2 leading-tight">
              {product.title}
            </h3>

            {/* Stars Rating */}
            <div className="flex items-center gap-1.5 mt-1">
              <div className="flex items-center gap-0.5 text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={11}
                    className={s <= Math.floor(product.rating) ? "fill-current" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="text-[10px] font-bold text-[var(--ag-gray-800)]">
                ({product.reviewCount})
              </span>
            </div>
          </div>

          {/* Price Tag Row */}
          <div className="flex items-baseline gap-2 mt-3 pt-3 border-t border-[var(--ag-gray-100)] shrink-0">
            <span className="text-base font-black text-[var(--ag-red)]">
              ₹{price}
            </span>
            {originalPrice > price && (
              <span className="text-xs text-[var(--ag-gray-500)] line-through">
                ₹{originalPrice}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Mobile Add to Cart button (always visible below card on mobile) */}
      <div className="p-3 pt-0 sm:hidden shrink-0">
        <button
          onClick={handleAddToCart}
          className="w-full py-2 bg-[var(--ag-red)] hover:bg-[var(--ag-red-hover)] text-white font-bold text-xs rounded-[var(--radius-sm)] flex items-center justify-center gap-1.5 shadow-sm transition-colors"
        >
          <ShoppingCart size={11} />
          ADD TO CART
        </button>
      </div>
    </motion.div>
  );
}
