// apps/storefront/components/store/collection/FilterSidebar.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FilterSidebarProps {
  selectedBrands: string[];
  onChangeBrands: (brands: string[]) => void;
  priceRange: { min: string; max: string };
  onChangePrice: (range: { min: string; max: string }) => void;
  inStockOnly: boolean;
  onChangeStock: (inStock: boolean) => void;
  selectedDiscount: string;
  onChangeDiscount: (discount: string) => void;
}

const brandsList = ["Pilot", "Lamy", "Classmate", "Tombow", "Muji", "MT", "Sakura", "Staedtler"];
const discountList = [
  { label: "All Discounts", value: "" },
  { label: "10% Off & More", value: "10" },
  { label: "20% Off & More", value: "20" },
  { label: "30% Off & More", value: "30" },
];

export default function FilterSidebar({
  selectedBrands,
  onChangeBrands,
  priceRange,
  onChangePrice,
  inStockOnly,
  onChangeStock,
  selectedDiscount,
  onChangeDiscount,
}: FilterSidebarProps) {
  const [openSections, setOpenSections] = useState({
    price: true,
    brand: true,
    stock: true,
    discount: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleBrandChange = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      onChangeBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      onChangeBrands([...selectedBrands, brand]);
    }
  };

  return (
    <div className="w-full md:w-60 shrink-0 flex flex-col gap-6 select-none bg-card text-card-foreground p-4 border border-border rounded-[var(--radius-lg)]">
      
      {/* SECTION: Price Range */}
      <div className="border-b border-border pb-4">
        <button
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between font-bold text-sm text-foreground py-2 text-left"
        >
          <span>Price Range</span>
          <motion.div animate={{ rotate: openSections.price ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={16} />
          </motion.div>
        </button>
        <AnimatePresence initial={false}>
          {openSections.price && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden mt-3"
            >
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => onChangePrice({ ...priceRange, min: e.target.value })}
                  className="w-1/2 px-3 py-2 border border-border bg-background text-foreground placeholder:text-muted-foreground text-xs font-semibold rounded-[var(--radius-sm)] outline-none focus:border-[var(--ag-red)]"
                />
                <span className="text-[var(--ag-gray-500)] text-xs font-bold">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => onChangePrice({ ...priceRange, max: e.target.value })}
                  className="w-1/2 px-3 py-2 border border-border bg-background text-foreground placeholder:text-muted-foreground text-xs font-semibold rounded-[var(--radius-sm)] outline-none focus:border-[var(--ag-red)]"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SECTION: Brands */}
      <div className="border-b border-border pb-4">
        <button
          onClick={() => toggleSection("brand")}
          className="w-full flex items-center justify-between font-bold text-sm text-foreground py-2 text-left"
        >
          <span>Brands</span>
          <motion.div animate={{ rotate: openSections.brand ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={16} />
          </motion.div>
        </button>
        <AnimatePresence initial={false}>
          {openSections.brand && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden mt-3"
            >
              <div className="flex flex-col gap-2.5">
                {brandsList.map((brand) => (
                  <label key={brand} className="flex items-center gap-2.5 text-xs font-semibold text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                      className="rounded border-[var(--ag-gray-200)] text-[var(--ag-red)] focus:ring-[var(--ag-red)] h-4 w-4"
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SECTION: Availability */}
      <div className="border-b border-border pb-4">
        <button
          onClick={() => toggleSection("stock")}
          className="w-full flex items-center justify-between font-bold text-sm text-foreground py-2 text-left"
        >
          <span>Availability</span>
          <motion.div animate={{ rotate: openSections.stock ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={16} />
          </motion.div>
        </button>
        <AnimatePresence initial={false}>
          {openSections.stock && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden mt-3"
            >
              <label className="flex items-center gap-2.5 text-xs font-semibold text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => onChangeStock(e.target.checked)}
                  className="rounded border-[var(--ag-gray-200)] text-[var(--ag-red)] focus:ring-[var(--ag-red)] h-4 w-4"
                />
                <span>In Stock Only</span>
              </label>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SECTION: Discounts */}
      <div>
        <button
          onClick={() => toggleSection("discount")}
          className="w-full flex items-center justify-between font-bold text-sm text-foreground py-2 text-left"
        >
          <span>Discounts</span>
          <motion.div animate={{ rotate: openSections.discount ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={16} />
          </motion.div>
        </button>
        <AnimatePresence initial={false}>
          {openSections.discount && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden mt-3"
            >
              <div className="flex flex-col gap-2">
                {discountList.map((disc) => (
                  <label key={disc.label} className="flex items-center gap-2.5 text-xs font-semibold text-foreground cursor-pointer">
                    <input
                      type="radio"
                      name="discount"
                      checked={selectedDiscount === disc.value}
                      onChange={() => onChangeDiscount(disc.value)}
                      className="border-[var(--ag-gray-200)] text-[var(--ag-red)] focus:ring-[var(--ag-red)] h-4 w-4"
                    />
                    <span>{disc.label}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
