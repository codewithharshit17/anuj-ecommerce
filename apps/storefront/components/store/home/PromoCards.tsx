// apps/storefront/components/store/home/PromoCards.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface PromoCard {
  image: string;
  categoryName: string;
  tagline: string;
  ctaText: string;
  href: string;
}

const promoCards: PromoCard[] = [
  {
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop&q=80",
    categoryName: "Party Supplies",
    tagline: "Balloons, candles & decor",
    ctaText: "Shop Party",
    href: "/collections/birthday-party-items",
  },
  {
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&auto=format&fit=crop&q=80",
    categoryName: "Premium Journals",
    tagline: "Unruled, dotted & thread-bound",
    ctaText: "Explore Books",
    href: "/collections/office-supplies",
  },
  {
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&auto=format&fit=crop&q=80",
    categoryName: "Organizer Tools",
    tagline: "Aesthetic desk organization products",
    ctaText: "Shop Desk",
    href: "/collections/stationery",
  },
];

export default function PromoCards() {
  return (
    <section className="py-12 bg-white dark:bg-neutral-900 select-none">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promoCards.map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.15)" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="relative w-full aspect-[4/3] md:aspect-[3/4] lg:aspect-[4/3] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--ag-gray-800)] group shadow-md"
            >
              {/* Background Image */}
              <img
                src={card.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-1.04"
                loading="lazy"
              />
              {/* Dark Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

              {/* Card Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--ag-yellow)] mb-1">
                  {card.tagline}
                </span>
                <h3 className="text-xl font-display font-black mb-4">
                  {card.categoryName}
                </h3>
                <div>
                  <Link
                    href={card.href}
                    className="inline-flex items-center justify-center px-4 py-2 border-2 border-white hover:bg-white hover:text-[var(--ag-dark)] text-white text-xs font-bold rounded-[var(--radius-sm)] transition-colors"
                  >
                    {card.ctaText}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
