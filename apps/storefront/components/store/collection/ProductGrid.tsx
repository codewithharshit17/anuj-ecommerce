// apps/storefront/components/store/collection/ProductGrid.tsx
"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ProductCard from "../products/ProductCard";
import SkeletonCard from "../ui/SkeletonCard";
import { MedusaProduct } from "@/lib/medusa/client";

interface ProductGridProps {
  products: MedusaProduct[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as any } },
};

export default function ProductGrid({ products, loading, hasMore, onLoadMore }: ProductGridProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Setup infinite scroll observer
  useEffect(() => {
    if (!sentinelRef.current || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, onLoadMore]);

  if (products.length === 0 && !loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-center select-none bg-white border border-[var(--ag-gray-200)] rounded-[var(--radius-lg)]">
        <div className="w-16 h-16 rounded-full bg-[var(--ag-gray-100)] flex items-center justify-center mb-4 text-[var(--ag-gray-500)] text-2xl">
          📦
        </div>
        <h3 className="font-display font-black text-lg text-[var(--ag-dark)] mb-1">
          No Products Found
        </h3>
        <p className="text-sm text-[var(--ag-gray-500)] max-w-xs leading-normal">
          Try relaxing your filters or choosing a different subcategory.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full select-none flex flex-col gap-8">
      {/* Product List Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        {products.map((product) => (
          <motion.div key={product.id} variants={itemVariants}>
            <ProductCard product={product} />
          </motion.div>
        ))}

        {/* Loading skeletons */}
        {loading &&
          [1, 2, 3, 4].map((n) => (
            <div key={n}>
              <SkeletonCard />
            </div>
          ))}
      </motion.div>

      {/* Sentinel for infinite scroll */}
      {hasMore && !loading && (
        <div ref={sentinelRef} className="h-10 w-full flex items-center justify-center" aria-hidden="true">
          <div className="w-6 h-6 border-2 border-[var(--ag-red)] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
