// apps/storefront/components/store/home/BudgetSection.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getProducts } from "@/lib/actions/product-actions";
import { StorefrontProduct } from "../products/ProductCard";
import ProductCard from "../products/ProductCard";

interface Chip {
  label: string;
  min?: number;
  max?: number;
}

const budgetChips: Chip[] = [
  { label: "₹ Under 199", max: 199 },
  { label: "₹ 199–499", min: 199, max: 499 },
  { label: "₹ 499–999", min: 499, max: 999 },
  { label: "₹ 999+", min: 999 },
];

const gridVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function BudgetSection() {
  const [activeChip, setActiveChip] = useState<Chip>(budgetChips[0]);
  const [filteredProducts, setFilteredProducts] = useState<StorefrontProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBudgetProducts = async () => {
      setLoading(true);
      try {
        const products = (await getProducts()) as StorefrontProduct[];
        
        // Filter by budget locally
        const min = activeChip.min ?? 0;
        const max = activeChip.max ?? Infinity;
        
        const filtered = products.filter((p) => {
          const price = p.price || 0;
          return price >= min && price < max;
        });
        
        setFilteredProducts(filtered.slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetProducts();
  }, [activeChip]);

  return (
    <section className="py-section bg-[var(--ag-gray-100)] select-none">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-black text-[var(--ag-dark)] section-title-underline pb-1">
              Shop By Budget
            </h2>
            <p className="text-sm text-[var(--ag-gray-500)] mt-2 font-medium">
              Find premium stationery tools matching your spending preferences.
            </p>
          </div>

          {/* Chips */}
          <div className="flex items-center gap-2 flex-wrap">
            {budgetChips.map((chip) => {
              const isActive = activeChip.label === chip.label;
              return (
                <button
                  key={chip.label}
                  onClick={() => setActiveChip(chip)}
                  className={`px-4.5 py-2.5 rounded-full text-xs font-bold border transition-all ${
                    isActive
                      ? "bg-[var(--ag-red)] text-white border-[var(--ag-red)] shadow-md hover:shadow-lg"
                      : "bg-white dark:bg-[#1E1E1E] text-[var(--ag-gray-800)] border-[var(--ag-gray-200)] hover:bg-[var(--ag-gray-100)]"
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product grid transition container */}
        <div className="min-h-[340px] relative">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading-skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="w-full aspect-[4/5] rounded-[var(--radius-lg)] border border-[var(--ag-gray-200)] bg-white dark:bg-[#1E1E1E] skeleton"
                  />
                ))}
              </motion.div>
            ) : filteredProducts.length === 0 ? (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full py-16 text-center text-sm font-semibold text-[var(--ag-gray-500)] bg-white dark:bg-[#1E1E1E] rounded-[var(--radius-lg)] border border-[var(--ag-gray-200)]"
              >
                No products found in this budget category.
              </motion.div>
            ) : (
              <motion.div
                key={activeChip.label}
                variants={gridVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {filteredProducts.map((product) => (
                  <motion.div key={product.id} variants={cardItemVariants}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
