// apps/storefront/components/store/layout/MegaMenu.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface MegaMenuProps {
  category: string;
  onClose: () => void;
}

const megaMenuVariants = {
  hidden: { opacity: 0, y: -8, scaleY: 0.97, transformOrigin: "top" },
  visible: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15 } },
};

interface SubCategory {
  title: string;
  image: string;
  href: string;
}

interface FeaturedProduct {
  title: string;
  price: string;
  image: string;
  href: string;
}

const categoryData: Record<
  string,
  {
    subcategories: SubCategory[];
    featured: FeaturedProduct[];
    ctaText: string;
    ctaHref: string;
  }
> = {
  stationery: {
    subcategories: [
      { title: "Pens & Refills", image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=200&auto=format&fit=crop&q=80", href: "/collections/stationery?category=Pens" },
      { title: "Notebooks & Diaries", image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=200&auto=format&fit=crop&q=80", href: "/collections/office-supplies?category=Notebooks" },
      { title: "Pencils & Erasers", image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=200&auto=format&fit=crop&q=80", href: "/collections/stationery?category=Pencils" },
      { title: "Desk Organizers", image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=200&auto=format&fit=crop&q=80", href: "/collections/stationery" },
    ],
    featured: [
      { title: "Pilot V5 Needle Point", price: "₹80", image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=150&auto=format&fit=crop&q=80", href: "/products/pilot-v5-rollerball" },
      { title: "Muji Gel Pen 0.5", price: "₹150", image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=150&auto=format&fit=crop&q=80", href: "/products/muji-gel-cap-05" },
    ],
    ctaText: "See All Stationery →",
    ctaHref: "/collections/stationery",
  },
  "office-supplies": {
    subcategories: [
      { title: "Notebooks", image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=200&auto=format&fit=crop&q=80", href: "/collections/office-supplies?category=Notebooks" },
      { title: "Calculators", image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=200&auto=format&fit=crop&q=80", href: "/collections/office-supplies" },
      { title: "Files & Folders", image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=200&auto=format&fit=crop&q=80", href: "/collections/office-supplies" },
      { title: "Adhesives", image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=200&auto=format&fit=crop&q=80", href: "/collections/office-supplies" },
    ],
    featured: [
      { title: "Classmate Notebook", price: "₹120", image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=150&auto=format&fit=crop&q=80", href: "/products/classmate-premium-notebook" },
    ],
    ctaText: "Shop Office Supplies →",
    ctaHref: "/collections/office-supplies",
  },
  "art-supplies": {
    subcategories: [
      { title: "Markers & Liners", image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=200&auto=format&fit=crop&q=80", href: "/collections/art-supplies" },
      { title: "Sketchbooks", image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=200&auto=format&fit=crop&q=80", href: "/collections/art-supplies" },
      { title: "Acrylic Paints", image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=200&auto=format&fit=crop&q=80", href: "/collections/art-supplies" },
    ],
    featured: [
      { title: "Tombow Brush Pens", price: "₹1999", image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=150&auto=format&fit=crop&q=80", href: "/products/tombow-dual-brush-pastel" },
      { title: "Sakura Micron Set", price: "₹799", image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=150&auto=format&fit=crop&q=80", href: "/products/sakura-pigma-micron" },
    ],
    ctaText: "Shop Art Supplies →",
    ctaHref: "/collections/art-supplies",
  },
  "craft-material": {
    subcategories: [
      { title: "Washi Tapes", image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=200&auto=format&fit=crop&q=80", href: "/collections/craft-material" },
      { title: "Craft Papers", image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=200&auto=format&fit=crop&q=80", href: "/collections/craft-material" },
      { title: "Glitter & Ribbon", image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=200&auto=format&fit=crop&q=80", href: "/collections/craft-material" },
    ],
    featured: [
      { title: "MT Washi Tape Floral Set", price: "₹499", image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=150&auto=format&fit=crop&q=80", href: "/products/mt-washi-tape-floral" },
    ],
    ctaText: "Shop Craft Material →",
    ctaHref: "/collections/craft-material",
  },
  "birthday-party-items": {
    subcategories: [
      { title: "Party Decoration", image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=200&auto=format&fit=crop&q=80", href: "/collections/birthday-party-items" },
      { title: "Candles & Poppers", image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=200&auto=format&fit=crop&q=80", href: "/collections/birthday-party-items" },
    ],
    featured: [
      { title: "Premium Birthday Kit", price: "₹599", image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=150&auto=format&fit=crop&q=80", href: "/products/birthday-decor-kit" },
    ],
    ctaText: "See Birthday/Party Items →",
    ctaHref: "/collections/birthday-party-items",
  },
};

export default function MegaMenu({ category, onClose }: MegaMenuProps) {
  const data = categoryData[category.toLowerCase().replace(/\s+/g, "-")];

  if (!data) return null;

  return (
    <motion.div
      variants={megaMenuVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="absolute top-[calc(100%-1px)] left-0 w-full bg-white dark:bg-neutral-900 z-[100] border-b border-[var(--ag-gray-200)] dark:border-neutral-800 shadow-2xl flex flex-col"
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto w-full px-8 py-10 grid grid-cols-12 gap-8">
        {/* Left Side: Subcategories */}
        <div className="col-span-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--ag-gray-500)] mb-6">
            Shop Subcategories
          </h3>
          <div className="grid grid-cols-4 gap-6">
            {data.subcategories.map((sub) => (
              <Link
                key={sub.title}
                href={sub.href}
                className="group flex flex-col items-center text-center select-none"
                onClick={onClose}
              >
                <div className="w-full aspect-square rounded-[var(--radius-lg)] overflow-hidden border border-[var(--ag-gray-200)] dark:border-neutral-800 bg-[var(--ag-gray-100)] dark:bg-neutral-800 transition-transform duration-300 group-hover:scale-102 group-hover:shadow-md">
                  <img
                    src={sub.image}
                    alt={sub.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <span className="mt-3 text-sm font-semibold text-[var(--ag-dark)] dark:text-[var(--foreground)] group-hover:text-[var(--ag-red)] transition-colors border-b-2 border-transparent group-hover:border-[var(--ag-red)] pb-0.5">
                  {sub.title}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Side: Featured Products */}
        <div className="col-span-4 border-l border-[var(--ag-gray-200)] dark:border-neutral-800 pl-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--ag-gray-500)] mb-6">
            Featured Bestsellers
          </h3>
          <div className="flex flex-col gap-4">
            {data.featured.map((prod) => (
              <Link
                key={prod.title}
                href={prod.href}
                className="group flex items-center gap-4 bg-[var(--ag-gray-100)] dark:bg-neutral-800 p-3 rounded-[var(--radius-md)] border border-transparent hover:border-[var(--ag-red)] hover:bg-white dark:hover:bg-neutral-700 hover:shadow-sm transition-all"
                onClick={onClose}
              >
                <div className="w-14 h-14 rounded-[var(--radius-sm)] overflow-hidden bg-white dark:bg-neutral-700 shrink-0 border border-[var(--ag-gray-200)] dark:border-neutral-600">
                  <img
                    src={prod.image}
                    alt={prod.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[var(--ag-dark)] dark:text-[var(--foreground)] truncate group-hover:text-[var(--ag-red)] transition-colors">
                    {prod.title}
                  </h4>
                  <p className="text-sm font-extrabold text-[var(--ag-red)] mt-0.5">
                    {prod.price}
                  </p>
                </div>
                <ArrowRight size={14} className="text-[var(--ag-gray-500)] group-hover:text-[var(--ag-red)] group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA strip */}
      <div className="w-full bg-[var(--ag-gray-100)] dark:bg-neutral-800 border-t border-[var(--ag-gray-200)] dark:border-neutral-700 py-3 px-8 text-center">
        <Link
          href={data.ctaHref}
          onClick={onClose}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--ag-red)] hover:text-[var(--ag-red-hover)] transition-colors hover:underline"
        >
          {data.ctaText}
        </Link>
      </div>
    </motion.div>
  );
}
