// apps/storefront/components/store/home/FeaturedBrands.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface Brand {
  name: string;
  origin: string;
  specialty: string;
  href: string;
}

const brands: Brand[] = [
  { name: "Pilot", origin: "Japan", specialty: "Hi-Tecpoint & Gel Pens", href: "/collections/stationery?brand=Pilot" },
  { name: "Lamy", origin: "Germany", specialty: "Luxury Fountain Pens", href: "/collections/birthday-party-items?brand=Lamy" },
  { name: "Muji", origin: "Japan", specialty: "Minimalist Gel Cap Pens", href: "/collections/stationery?brand=Muji" },
  { name: "Tombow", origin: "Japan", specialty: "Dual Brush Calligraphy", href: "/collections/art-supplies?brand=Tombow" },
  { name: "Sakura", origin: "Japan", specialty: "Archival Pigma Micron", href: "/collections/art-supplies?brand=Sakura" },
  { name: "Classmate", origin: "India", specialty: "Premium Bound Notebooks", href: "/collections/office-supplies?brand=Classmate" },
  { name: "Apsara", origin: "India", specialty: "Platinum Extra Dark Pencils", href: "/collections/stationery?brand=Apsara" },
  { name: "MT Washi", origin: "Japan", specialty: "Rice Paper Decorative Tapes", href: "/collections/craft-material?brand=MT" },
];

export default function FeaturedBrands() {
  return (
    <section className="py-12 bg-white dark:bg-neutral-900 border-b border-[var(--ag-gray-200)] dark:border-neutral-800 select-none">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-8 text-center md:text-left">
          <h2 className="text-xl sm:text-2xl font-display font-black text-[var(--ag-dark)] dark:text-[var(--foreground)] section-title-underline pb-1">
            Featured Brands
          </h2>
          <p className="text-sm text-[var(--ag-gray-500)] mt-2 font-medium">
            Curated writing tools from the world's most trusted manufacturers.
          </p>
        </div>

        {/* Brand Horizontal Scroll */}
        <div className="flex overflow-x-auto whitespace-nowrap scrollbar-none snap-x gap-4 pb-4 -mx-6 px-6 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]">
          {brands.map((brand, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -3, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="flex-none w-[170px] sm:w-[190px] snap-start"
            >
              <Link
                href={brand.href}
                className="flex flex-col items-center justify-between p-5 h-36 bg-[var(--ag-gray-100)] dark:bg-[#1E1E1E] border border-[var(--ag-gray-200)] dark:border-neutral-850 rounded-[var(--radius-lg)] text-center hover:border-[var(--ag-red)]/40 hover:shadow-xs group transition-colors"
              >
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-[var(--ag-gray-500)] bg-[var(--ag-gray-200)] dark:bg-neutral-800 px-2 py-0.5 rounded-full">
                    {brand.origin}
                  </span>
                  <h3 className="text-xl font-display font-black text-[var(--ag-dark)] dark:text-[var(--foreground)] mt-3 tracking-tight group-hover:text-[var(--ag-red)] transition-colors">
                    {brand.name}
                  </h3>
                </div>
                <p className="text-[10px] font-bold text-[var(--ag-gray-500)] leading-tight text-wrap line-clamp-2 mt-1">
                  {brand.specialty}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
