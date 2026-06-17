// apps/storefront/components/store/layout/Header.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Heart, User, ShoppingBag, Menu, X, ArrowRight, Plus, Trash2, History, TrendingUp } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { useUIStore } from "@/components/store/ui-store";
import { searchProducts } from "@/lib/actions/product-actions";
import { StorefrontProduct } from "../products/ProductCard";
import AnnouncementBar from "./AnnouncementBar";
import MegaMenu from "./MegaMenu";
import ThemeToggle from "@/components/store/ui/ThemeToggle";
import { AnimatePresence, motion } from "framer-motion";

const navCategories = [
  "Stationery",
  "Office Supplies",
  "Art Supplies",
  "Craft Material",
  "Best Sellers",
  "Birthday/Party Items",
];

const searchCategories = [
  "All Categories",
  "Stationery",
  "Office Supplies",
  "Art Supplies",
  "Craft Material",
  "Best Sellers",
  "Birthday/Party Items",
];

// Popular stationery searches
const trendingSearches = [
  "Gel Pens",
  "Notebooks",
  "Brush Pens",
  "Fountain Pens",
  "Muji",
  "Washi Tape",
];

export default function Header() {
  const router = useRouter();
  const { items, addItem } = useCartStore();
  const { setCartOpen, setMobileMenuOpen, wishlist } = useUIStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<StorefrontProduct[]>([]);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Search enhancement states
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeSelectionIndex, setActiveSelectionIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("kapi_recent_searches");
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Monitor Scroll Position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch search results on query change
  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      const categoryId = selectedCategory !== "All Categories" 
        ? `col-${selectedCategory.toLowerCase().replace(/\s+/g, "-")}` 
        : undefined;

      try {
        const products = await searchProducts(searchQuery, 5);
        setSearchResults(products || []);
        setActiveSelectionIndex(-1); // Reset selection on new results
      } catch (err) {
        console.error(err);
      }
    };

    const delayDebounce = setTimeout(fetchResults, 200);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery, selectedCategory]);

  const saveSearchQuery = (query: string) => {
    if (!query.trim()) return;
    const cleanQuery = query.trim();
    const updated = [
      cleanQuery,
      ...recentSearches.filter((q) => q !== cleanQuery),
    ].slice(0, 3);
    setRecentSearches(updated);
    localStorage.setItem("kapi_recent_searches", JSON.stringify(updated));
  };

  const clearRecentSearches = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem("kapi_recent_searches");
  };

  const handleRecentClick = (q: string) => {
    setSearchQuery(q);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleQuickAdd = (e: React.MouseEvent, prod: StorefrontProduct) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: prod.id,
      name: prod.name,
      price: prod.price,
      image: prod.images.find(i => i.isPrimary)?.url || prod.images[0]?.url || "",
      quantity: 1,
    });
    setCartOpen(true);
    setIsSearchFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // If empty query, user can cycle through trending list
    const isQueryEmpty = !searchQuery.trim();
    const listToCycle = isQueryEmpty ? trendingSearches : searchResults;
    const totalItems = listToCycle.length;

    if (totalItems === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSelectionIndex((prev) => (prev + 1 >= totalItems ? 0 : prev + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSelectionIndex((prev) => (prev - 1 < 0 ? totalItems - 1 : prev - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeSelectionIndex >= 0 && activeSelectionIndex < totalItems) {
        if (isQueryEmpty) {
          const queryText = trendingSearches[activeSelectionIndex];
          setSearchQuery(queryText);
          saveSearchQuery(queryText);
          setActiveSelectionIndex(-1);
        } else {
          const highlighted = searchResults[activeSelectionIndex];
          saveSearchQuery(searchQuery);
          setIsSearchFocused(false);
          router.push(`/products/${highlighted.slug}`);
        }
      } else {
        saveSearchQuery(searchQuery);
        setIsSearchFocused(false);
        router.push(`/products?q=${searchQuery}`);
      }
    } else if (e.key === "Escape") {
      setIsSearchFocused(false);
      if (searchInputRef.current) {
        searchInputRef.current.blur();
      }
    }
  };

  const handleNavHover = (category: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredCategory(category);
    }, 120); // 120ms anti-jitter delay
  };

  const handleNavLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 200);
  };

  return (
    <div className="w-full flex flex-col z-[150] bg-white dark:bg-neutral-900 border-b border-[var(--ag-gray-200)] dark:border-neutral-800 relative">
      {/* ZONE A: Announcement Bar */}
      <div
        className={`w-full overflow-hidden transition-all duration-300 ${
          isScrolled ? "h-0 opacity-0 pointer-events-none" : "h-10 opacity-100"
        }`}
      >
        <AnnouncementBar />
      </div>

      {/* STICKY CONTAINER FOR ZONE B & C */}
      <header
        className={`w-full sticky top-0 z-[140] bg-white dark:bg-neutral-900 transition-shadow duration-300 ${
          isScrolled ? "shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.5)]" : ""
        }`}
      >
        {/* ZONE B: Main Header strip */}
        <div
          className={`max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between gap-6 transition-all duration-300 ${
            isScrolled ? "py-2.5" : "py-4.5"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <img src="/logo.jpg" alt="KAPI PEN Store Logo" className="h-12 w-auto object-contain" />
            <div className="hidden sm:block">
              <span className="text-xl font-display font-black tracking-tight leading-none text-[var(--ag-dark)]">
                KAPI PEN Store
              </span>
            </div>
          </Link>

          {/* Search bar pill */}
          <div className="flex-1 max-w-xl mx-auto relative hidden md:block">
            <div
              className={`flex items-center w-full rounded-full border border-[var(--ag-gray-200)] dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-1.5 transition-all duration-200 ${
                isSearchFocused
                  ? "border-[var(--ag-red)] shadow-[0_0_0_3px_rgba(229,60,60,0.12)]"
                  : ""
              }`}
            >
              {/* Category dropdown */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent text-xs font-bold text-[var(--ag-gray-800)] dark:text-[var(--ag-gray-200)] outline-none cursor-pointer pr-2 border-r border-[var(--ag-gray-200)] dark:border-neutral-700 mr-3 h-full"
              >
                {searchCategories.map((cat) => (
                  <option key={cat} value={cat} className="dark:bg-neutral-800">
                    {cat}
                  </option>
                ))}
              </select>

              {/* Input */}
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search premium pens, notebooks, and art supplies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
                onKeyDown={handleKeyDown}
                className="flex-1 text-sm font-semibold outline-none bg-transparent text-[var(--ag-dark)] dark:text-[var(--foreground)] placeholder:text-[var(--ag-gray-500)]"
              />

              {/* Clear Query */}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-1 rounded-full hover:bg-[var(--ag-gray-100)] dark:hover:bg-neutral-700 mr-2 transition-colors cursor-pointer"
                >
                  <X size={14} className="text-[var(--ag-gray-500)]" />
                </button>
              )}

              {/* Search button */}
              <button
                onClick={() => {
                  saveSearchQuery(searchQuery);
                  setIsSearchFocused(false);
                  router.push(`/products?q=${searchQuery}`);
                }}
                className="w-8 h-8 rounded-full bg-[var(--ag-red)] hover:bg-[var(--ag-red-hover)] text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                aria-label="Submit search"
              >
                <Search size={14} />
              </button>
            </div>

            {/* Search Dropdown with animations */}
            <AnimatePresence>
              {isSearchFocused && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 right-0 mt-2 bg-white dark:bg-neutral-800 rounded-[var(--radius-xl)] border border-[var(--ag-gray-200)] dark:border-neutral-700 shadow-2xl overflow-hidden z-[160]"
                >
                  {/* Empty state details (Trending & Recents) */}
                  {!searchQuery.trim() ? (
                    <div className="p-5 flex flex-col gap-5 text-left">
                      {recentSearches.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-2 text-[10px] font-black uppercase tracking-wider text-[var(--ag-gray-500)]">
                            <span className="flex items-center gap-1"><History size={11} /> Recent Searches</span>
                            <button
                              onMouseDown={clearRecentSearches}
                              className="text-[var(--ag-red)] hover:underline flex items-center gap-0.5 cursor-pointer"
                            >
                              <Trash2 size={10} /> Clear
                            </button>
                          </div>
                          <div className="flex flex-col gap-1">
                            {recentSearches.map((q) => (
                              <button
                                key={q}
                                onMouseDown={() => handleRecentClick(q)}
                                className="text-left text-xs sm:text-sm font-semibold text-[var(--ag-dark)] dark:text-gray-300 py-1.5 px-2.5 rounded-lg hover:bg-[var(--ag-gray-100)] dark:hover:bg-neutral-700/50 transition-colors w-full cursor-pointer"
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-1 mb-2 text-[10px] font-black uppercase tracking-wider text-[var(--ag-gray-500)]">
                          <TrendingUp size={11} /> Trending Searches
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {trendingSearches.map((q, idx) => {
                            const isHighlighted = activeSelectionIndex === idx;
                            return (
                              <button
                                key={q}
                                onMouseDown={() => {
                                  setSearchQuery(q);
                                  saveSearchQuery(q);
                                }}
                                className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                                  isHighlighted
                                    ? "bg-[var(--ag-red)] text-white border-[var(--ag-red)] shadow-sm scale-102"
                                    : "bg-[var(--ag-gray-100)] dark:bg-neutral-700 text-[var(--ag-dark)] dark:text-gray-200 border-[var(--ag-gray-200)] dark:border-neutral-650 hover:bg-[var(--ag-red)]/10 hover:text-[var(--ag-red)]"
                                }`}
                              >
                                {q}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Query Results matching products
                    searchResults.length === 0 ? (
                      <div className="p-6 text-center text-sm font-semibold text-[var(--ag-gray-500)]">
                        No matching products found.
                      </div>
                    ) : (
                      <div className="flex flex-col text-left">
                        <div className="px-4 py-2 bg-[var(--ag-gray-100)] dark:bg-neutral-700 border-b border-[var(--ag-gray-200)] dark:border-neutral-600 text-[10px] font-black text-[var(--ag-gray-500)] dark:text-gray-400 uppercase tracking-wider">
                          Suggested Products
                        </div>
                        <div className="divide-y divide-[var(--ag-gray-100)] dark:divide-neutral-700/70">
                          {searchResults.map((prod, idx) => {
                            const isHighlighted = activeSelectionIndex === idx;
                            return (
                              <Link
                                key={prod.id}
                                href={`/products/${prod.slug}`}
                                onMouseDown={() => saveSearchQuery(searchQuery)}
                                onMouseEnter={() => setActiveSelectionIndex(idx)}
                                className={`flex items-center gap-3 p-3 transition-colors ${
                                  isHighlighted ? "bg-[var(--ag-gray-100)] dark:bg-neutral-700" : "hover:bg-[var(--ag-gray-100)] dark:hover:bg-neutral-700/50"
                                }`}
                              >
                                <div className="w-10 h-10 rounded-[var(--radius-md)] overflow-hidden bg-[var(--ag-gray-100)] dark:bg-neutral-800 border border-[var(--ag-gray-200)] dark:border-neutral-750 shrink-0">
                                  <img src={prod.images.find(i => i.isPrimary)?.url || prod.images[0]?.url || ""} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-xs sm:text-sm font-bold text-[var(--ag-dark)] dark:text-white truncate">{prod.name}</h4>
                                  <p className="text-[10px] font-bold text-[var(--ag-gray-500)] dark:text-neutral-400">{prod.category?.name}</p>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                  <div className="text-right">
                                    <span className="text-sm font-extrabold text-[var(--ag-red)]">₹{prod.price}</span>
                                  </div>
                                  <button
                                    onMouseDown={(e) => handleQuickAdd(e, prod)}
                                    className="p-1.5 rounded-full bg-[var(--ag-red)] text-white hover:bg-[var(--ag-red-hover)] transition-all active:scale-95 shadow-sm cursor-pointer"
                                    title="Quick Add to Cart"
                                  >
                                    <Plus size={13} className="stroke-[3]" />
                                  </button>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                        <Link
                          href={`/products?q=${searchQuery}`}
                          onMouseDown={() => saveSearchQuery(searchQuery)}
                          className="px-4 py-3.5 border-t border-[var(--ag-gray-200)] dark:border-neutral-700 bg-[var(--ag-gray-100)] dark:bg-neutral-800 text-center text-xs font-black text-[var(--ag-red)] hover:bg-[var(--ag-gray-200)] dark:hover:bg-neutral-700 transition-colors block"
                        >
                          See All Search Results →
                        </Link>
                      </div>
                    )
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action icon triggers */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <ThemeToggle />


            {/* Hamburger (mobile) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-[var(--ag-gray-100)] dark:hover:bg-neutral-800 text-[var(--ag-dark)] dark:text-[var(--foreground)] transition-colors"
              aria-label="Open mobile menu"
            >
              <Menu size={20} />
            </button>

            {/* Wishlist Link */}
            <Link
              href="/products"
              className="p-2.5 rounded-full hover:bg-[var(--ag-gray-100)] dark:hover:bg-neutral-800 text-[var(--ag-dark)] dark:text-[var(--foreground)] transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart size={20} className={wishlist.length > 0 ? "fill-[var(--ag-red)] text-[var(--ag-red)]" : ""} />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-[var(--ag-red)] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Account Icon */}
            <Link
              href="/account/login"
              className="p-2.5 rounded-full hover:bg-[var(--ag-gray-100)] dark:hover:bg-neutral-800 text-[var(--ag-dark)] dark:text-[var(--foreground)] transition-colors"
              aria-label="Account"
            >
              <User size={20} />
            </Link>

            {/* Cart Icon trigger */}
            <button
              onClick={() => setCartOpen(true)}
              className="p-2.5 rounded-full hover:bg-[var(--ag-gray-100)] dark:hover:bg-neutral-800 text-[var(--ag-dark)] dark:text-[var(--foreground)] transition-colors relative"
              aria-label="Open Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 1.4 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                  className="absolute top-1.5 right-1.5 bg-[var(--ag-red)] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>

        {/* ZONE C: Nav Menu rows (sticky) */}
        <div className="w-full border-t border-[var(--ag-gray-200)] dark:border-neutral-800 hidden md:block">
          <div className="max-w-7xl mx-auto px-8 flex justify-center relative">
            <nav className="flex items-center gap-8 h-12" onMouseLeave={handleNavLeave}>
              {navCategories.map((category) => (
                <div
                  key={category}
                  className="h-full flex items-center"
                  onMouseEnter={() => handleNavHover(category)}
                >
                  <Link
                    href={`/collections/${category.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-sm font-bold text-[var(--ag-gray-800)] hover:text-[var(--ag-red)] transition-colors relative py-3"
                  >
                    {category}
                    {hoveredCategory === category && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--ag-red)]"
                      />
                    )}
                  </Link>
                </div>
              ))}
            </nav>

            {/* Render full-width MegaMenu */}
            <AnimatePresence>
              {hoveredCategory && (
                <div onMouseEnter={() => handleNavHover(hoveredCategory)}>
                  <MegaMenu
                    category={hoveredCategory}
                    onClose={() => setHoveredCategory(null)}
                  />
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>
    </div>
  );
}
