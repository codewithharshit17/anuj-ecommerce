"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { useUIStore } from "@/components/store/ui-store";
import { motion, AnimatePresence } from "framer-motion";

interface WishlistProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  mrp: number;
  image: string;
  category: string;
}

interface WishlistClientProps {
  initialProducts: WishlistProduct[];
}

export default function WishlistClient({ initialProducts }: WishlistClientProps) {
  const [products, setProducts] = useState<WishlistProduct[]>(initialProducts);
  const { toggleWishlist, setCartOpen } = useUIStore();
  const { addItem } = useCartStore();

  const handleRemove = async (productId: string) => {
    // Optimistic UI update
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    // Trigger actual database sync
    await toggleWishlist(productId);
  };

  const handleAddToCart = (e: React.MouseEvent, prod: WishlistProduct) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: prod.id,
      name: prod.name,
      price: prod.price,
      image: prod.image,
      quantity: 1,
    });
    setCartOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-h2 text-[var(--ag-dark)] tracking-tight">
          My Wishlist
        </h2>
        <p className="text-sm text-[var(--ag-gray-500)] mt-1">
          Your saved items
        </p>
      </div>

      {products.length === 0 ? (
        /* Empty State */
        <div className="bg-white dark:bg-[var(--card)] border border-[var(--ag-gray-200)] dark:border-[var(--border)] rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[var(--ag-gray-100)] dark:bg-[var(--muted)] flex items-center justify-center mx-auto mb-4">
            <Heart size={28} className="text-[var(--ag-gray-500)]" />
          </div>
          <h3 className="font-bold text-base text-[var(--ag-dark)] mb-1">
            Your wishlist is empty
          </h3>
          <p className="text-sm text-[var(--ag-gray-500)] mb-6 max-w-xs mx-auto">
            Explore our premium collection of pens, journals, and stationery and save your favorites here.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-[var(--ag-red)] hover:bg-[var(--ag-red-hover)] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-px"
          >
            <ShoppingBag size={16} />
            Explore Products
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        /* Grid list */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <AnimatePresence>
            {products.map((prod) => {
              const discount = prod.mrp > prod.price ? Math.round(((prod.mrp - prod.price) / prod.mrp) * 100) : 0;
              return (
                <motion.div
                  key={prod.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white dark:bg-[var(--card)] border border-[var(--ag-gray-200)] dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group h-full relative"
                >
                  <Link href={`/products/${prod.slug}`} className="flex flex-col h-full flex-1">
                    {/* Image Area */}
                    <div className="relative aspect-square w-full bg-[var(--ag-gray-100)] dark:bg-neutral-850 overflow-hidden border-b border-[var(--ag-gray-200)] dark:border-neutral-800 shrink-0">
                      <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      {discount > 0 && (
                        <div className="absolute top-2.5 left-2.5 bg-[var(--ag-red)] text-white text-[8px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
                          -{discount}%
                        </div>
                      )}
                      {/* Delete icon button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemove(prod.id);
                        }}
                        className="absolute top-2.5 right-2.5 p-1.5 bg-white/90 hover:bg-white dark:bg-neutral-900/90 dark:hover:bg-neutral-900 border border-[var(--ag-gray-200)] dark:border-neutral-800 text-[var(--ag-gray-500)] hover:text-[var(--ag-red)] rounded-full shadow-xs transition-colors cursor-pointer"
                        title="Remove from wishlist"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[8px] font-black uppercase tracking-widest text-[var(--ag-gray-500)]">
                          {prod.category}
                        </span>
                        <h4 className="text-xs font-bold text-[var(--ag-dark)] dark:text-gray-200 group-hover:text-[var(--ag-red)] transition-colors line-clamp-2 min-h-[32px] leading-tight">
                          {prod.name}
                        </h4>
                      </div>

                      <div className="flex items-baseline gap-2 mt-3 pt-3 border-t border-[var(--ag-gray-100)]/50 dark:border-neutral-800/50">
                        <span className="text-xs sm:text-sm font-black text-[var(--ag-red)]">₹{prod.price}</span>
                        {prod.mrp > prod.price && (
                          <span className="text-[10px] text-[var(--ag-gray-500)] line-through">₹{prod.mrp}</span>
                        )}
                      </div>
                    </div>
                  </Link>

                  {/* Add to cart bottom row */}
                  <div className="p-3 pt-0">
                    <button
                      onClick={(e) => handleAddToCart(e, prod)}
                      className="w-full py-2 bg-[var(--ag-dark)] dark:bg-neutral-800 hover:bg-[var(--ag-red)] dark:hover:bg-[var(--ag-red)] text-white font-black text-[10px] rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ShoppingCart size={10} />
                      ADD TO CART
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
