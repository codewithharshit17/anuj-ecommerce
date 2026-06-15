// apps/storefront/components/store/product/ProductTabs.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductTabsProps {
  description: string;
  specifications?: Record<string, string>;
  brand: string;
  reviewCount: number;
}

export default function ProductTabs({
  description,
  specifications = {},
  brand,
  reviewCount,
}: ProductTabsProps) {
  const tabs = ["Description", "Specifications", "About Brand", `Reviews (${reviewCount})`];
  const [activeTab, setActiveTab] = useState("Description");

  return (
    <div className="w-full select-none bg-white dark:bg-[#1E1E1E] border border-[var(--ag-gray-200)] rounded-[var(--radius-lg)] overflow-hidden mt-10">
      {/* Tabs list Header */}
      <div className="flex border-b border-[var(--ag-gray-200)] bg-[var(--ag-gray-100)] overflow-x-auto no-scrollbar relative">
        {tabs.map((tab) => {
          const isActive = tab.startsWith(activeTab.split(" ")[0]);
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.split(" ")[0])}
              className={`px-6 py-4 text-xs sm:text-sm font-bold transition-colors relative shrink-0 ${
                isActive ? "text-[var(--ag-red)]" : "text-[var(--ag-gray-800)] hover:text-[var(--ag-red)]"
              }`}
            >
              {tab}
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--ag-red)]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === "Description" && (
            <motion.div
              key="desc"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              className="text-sm text-[var(--ag-gray-800)] leading-relaxed space-y-4"
            >
              <p>{description}</p>
            </motion.div>
          )}

          {activeTab === "Specifications" && (
            <motion.div
              key="specs"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              className="divide-y divide-[var(--ag-gray-200)]"
            >
              {Object.keys(specifications).length === 0 ? (
                <p className="text-xs text-[var(--ag-gray-500)] italic">No specifications provided.</p>
              ) : (
                Object.entries(specifications).map(([key, val]) => (
                  <div key={key} className="flex justify-between py-2 text-sm">
                    <span className="font-semibold text-[var(--ag-gray-500)]">{key}</span>
                    <span className="font-bold text-[var(--ag-dark)]">{val}</span>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === "About" && (
            <motion.div
              key="brand"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              className="text-sm text-[var(--ag-gray-800)] leading-relaxed"
            >
              <h4 className="font-bold text-base text-[var(--ag-dark)] mb-2">About {brand}</h4>
              <p>
                {brand} is an internationally acclaimed manufacturer of fine writing instruments and accessories.
                Renowned for their structural excellence and premium ergonomics, {brand} products represent the pinnacle
                of stationery design.
              </p>
            </motion.div>
          )}

          {activeTab.startsWith("Reviews") && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 bg-[var(--ag-gray-100)] p-4 rounded-[var(--radius-md)] border border-[var(--ag-gray-200)]">
                <div className="text-3xl font-black text-[var(--ag-dark)]">4.7</div>
                <div>
                  <div className="flex items-center gap-0.5 text-amber-500 text-sm">
                    {"★".repeat(5)}
                  </div>
                  <div className="text-xs text-[var(--ag-gray-500)] font-semibold mt-0.5">Based on {reviewCount} reviews</div>
                </div>
              </div>
              <p className="text-xs text-[var(--ag-gray-500)] italic">Showcasing latest verified purchaser feedback.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
