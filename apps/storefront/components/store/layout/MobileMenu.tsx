// apps/storefront/components/store/layout/MobileMenu.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, ShoppingBag, Heart, User, Home, Package } from "lucide-react";
import { useUIStore } from "@/components/store/ui-store";
import { useCartStore } from "@/lib/store/cart-store";
import Link from "next/link";
import ThemeToggle from "@/components/store/ui/ThemeToggle";

interface SubCategory {
  title: string;
  href: string;
}

interface NavItem {
  title: string;
  href: string;
  subcategories?: SubCategory[];
}

const navItems: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "All Products", href: "/products" },
  {
    title: "Stationery",
    href: "/collections/stationery",
    subcategories: [
      { title: "Pens & Refills", href: "/collections/stationery?category=Pens" },
      { title: "Notebooks & Diaries", href: "/collections/office-supplies?category=Notebooks" },
      { title: "Pencils & Erasers", href: "/collections/stationery?category=Pencils" },
      { title: "Desk Organizers", href: "/collections/stationery" },
    ],
  },
  {
    title: "Office Supplies",
    href: "/collections/office-supplies",
    subcategories: [
      { title: "Notebooks", href: "/collections/office-supplies?category=Notebooks" },
      { title: "Files & Folders", href: "/collections/office-supplies" },
      { title: "Calculators", href: "/collections/office-supplies" },
    ],
  },
  {
    title: "Art Supplies",
    href: "/collections/art-supplies",
    subcategories: [
      { title: "Markers & Liners", href: "/collections/art-supplies" },
      { title: "Sketchbooks", href: "/collections/art-supplies" },
      { title: "Paints", href: "/collections/art-supplies" },
    ],
  },
  {
    title: "Craft Material",
    href: "/collections/craft-material",
    subcategories: [
      { title: "Washi Tapes", href: "/collections/craft-material" },
      { title: "Adhesives", href: "/collections/craft-material" },
    ],
  },
  { title: "Best Sellers", href: "/collections/best-sellers" },
  {
    title: "Birthday/Party Items",
    href: "/collections/birthday-party-items",
    subcategories: [
      { title: "Party Decoration", href: "/collections/birthday-party-items" },
      { title: "Candles & Poppers", href: "/collections/birthday-party-items" },
    ],
  },
];

export default function MobileMenu() {
  const { isMobileMenuOpen, setMobileMenuOpen, setCartOpen } = useUIStore();
  const items = useCartStore((state) => state.items);
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Lock scroll when open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const openCart = () => {
    setMobileMenuOpen(false);
    setCartOpen(true);
  };

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[250] md:hidden flex" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "-100vw" }}
            animate={{ x: 0 }}
            exit={{ x: "-100vw" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="w-full max-w-[320px] bg-white dark:bg-neutral-900 h-full relative z-10 flex flex-col shadow-2xl border-r border-transparent dark:border-neutral-800"
          >
            {/* Header */}
            <div className="p-4 border-b border-[var(--ag-gray-200)] dark:border-neutral-800 flex items-center justify-between bg-white dark:bg-neutral-900">
              <div className="flex items-center gap-2">
                <img src="/logo.jpg" alt="KAPI PEN Store Logo" className="h-8 w-auto object-contain" />
                <span className="font-display font-black text-sm leading-tight tracking-tight text-[var(--ag-dark)] dark:text-[var(--foreground)]">
                  KAPI PEN<br/>Store
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <ThemeToggle />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-[var(--ag-gray-100)] dark:hover:bg-neutral-800 text-[var(--ag-gray-800)] dark:text-[var(--foreground)]"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Navigation List */}
            <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1 bg-white dark:bg-neutral-900">
              {navItems.map((item, index) => {
                const hasSubs = item.subcategories && item.subcategories.length > 0;
                const isExpanded = expandedIndex === index;

                return (
                  <div key={item.title} className="border-b border-[var(--ag-gray-100)] dark:border-neutral-800 pb-1 last:border-0">
                    <div className="flex items-center justify-between">
                      {hasSubs ? (
                        <button
                          onClick={() => toggleExpand(index)}
                          className="w-full flex items-center justify-between text-left py-3 px-2 rounded-lg hover:bg-[var(--ag-gray-100)] dark:hover:bg-neutral-800 font-semibold text-sm text-[var(--ag-dark)] dark:text-[var(--foreground)] transition-colors"
                        >
                          <span>{item.title}</span>
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown size={16} />
                          </motion.div>
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={handleLinkClick}
                          className="w-full block py-3 px-2 rounded-lg hover:bg-[var(--ag-gray-100)] dark:hover:bg-neutral-800 font-semibold text-sm text-[var(--ag-dark)] dark:text-[var(--foreground)] transition-colors"
                        >
                          {item.title}
                        </Link>
                      )}
                    </div>

                    {/* Subcategories Accordion */}
                    <AnimatePresence initial={false}>
                      {hasSubs && isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden bg-[var(--ag-gray-100)] dark:bg-neutral-800 rounded-lg mt-1 ml-2"
                        >
                          <div className="py-2 px-3 flex flex-col gap-2">
                            {item.subcategories!.map((sub) => (
                              <Link
                                key={sub.title}
                                href={sub.href}
                                onClick={handleLinkClick}
                                className="py-1.5 px-2 text-xs font-semibold text-[var(--ag-gray-800)] dark:text-[var(--ag-gray-300)] hover:text-[var(--ag-red)] transition-colors"
                              >
                                {sub.title}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            {/* Bottom Strip Action Bar */}
            <div className="border-t border-[var(--ag-gray-200)] dark:border-neutral-800 p-4 bg-[var(--ag-gray-100)] dark:bg-neutral-800 flex items-center justify-around">
              <Link
                href="/"
                onClick={handleLinkClick}
                className="flex flex-col items-center gap-1 text-[var(--ag-gray-800)] dark:text-[var(--foreground)] hover:text-[var(--ag-red)] transition-colors"
                aria-label="Home"
              >
                <Home size={20} />
                <span className="text-[10px] font-bold">Home</span>
              </Link>
              <button
                onClick={openCart}
                className="flex flex-col items-center gap-1 text-[var(--ag-gray-800)] dark:text-[var(--foreground)] hover:text-[var(--ag-red)] transition-colors relative"
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 right-2 bg-[var(--ag-red)] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
                <span className="text-[10px] font-bold">Cart</span>
              </button>
              <Link
                href="/products"
                onClick={handleLinkClick}
                className="flex flex-col items-center gap-1 text-[var(--ag-gray-800)] dark:text-[var(--foreground)] hover:text-[var(--ag-red)] transition-colors"
                aria-label="Wishlist"
              >
                <Heart size={20} />
                <span className="text-[10px] font-bold">Wishlist</span>
              </Link>
              <Link
                href="/account/login"
                onClick={handleLinkClick}
                className="flex flex-col items-center gap-1 text-[var(--ag-gray-800)] dark:text-[var(--foreground)] hover:text-[var(--ag-red)] transition-colors"
                aria-label="Account"
              >
                <User size={20} />
                <span className="text-[10px] font-bold">Account</span>
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
