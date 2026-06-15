"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Search, ShoppingCart, User, Heart, X, Menu } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";

export default function Header() {
  const items = useCartStore((state) => state.items);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  // Sticky header on scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md border-b border-[#EAE4DD]"
            : "bg-white border-b border-[#EAE4DD]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4 h-[68px]">

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-[#F5F0EB] transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu size={20} color="var(--brand-navy)" />
            </button>

            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              {/* Brand mark */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center font-display text-white font-bold text-sm shadow-md group-hover:shadow-lg transition-shadow"
                style={{ background: "linear-gradient(135deg, #E8442A, #F5A623)" }}
              >
                K
              </div>
              <div className="hidden sm:block">
                <span
                  className="text-xl font-black tracking-tight leading-none"
                  style={{ color: "var(--brand-navy)", fontFamily: "Inter, sans-serif" }}
                >
                  KAPI
                  <span style={{ color: "var(--brand-coral)" }}> PEN</span>
                </span>
                <p className="text-[10px] font-medium tracking-widest uppercase" style={{ color: "var(--muted-foreground)", letterSpacing: "0.12em" }}>
                  Premium Stationery
                </p>
              </div>
            </Link>

            {/* ── Search Bar (desktop) ── */}
            <div className="hidden md:flex flex-1 max-w-xl mx-4">
              <div
                className="relative flex items-center w-full rounded-xl border-2 transition-all duration-200 group"
                style={{
                  borderColor: searchQuery ? "var(--brand-coral)" : "#EAE4DD",
                  background: searchQuery ? "#FFF8F6" : "#F9F6F3",
                }}
              >
                <Search
                  size={16}
                  className="absolute left-3.5 transition-colors"
                  style={{ color: searchQuery ? "var(--brand-coral)" : "var(--muted-foreground)" }}
                />
                <input
                  type="text"
                  placeholder="Search pens, notebooks, art supplies…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-transparent text-sm font-medium outline-none placeholder:text-gray-400"
                  style={{ color: "var(--brand-navy)" }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-12 p-1 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <X size={14} color="var(--muted-foreground)" />
                  </button>
                )}
                <button
                  className="absolute right-0 h-full px-3.5 rounded-r-xl flex items-center justify-center text-white text-sm font-semibold transition-all"
                  style={{ background: "var(--brand-coral)", minWidth: "44px" }}
                  aria-label="Search"
                >
                  <Search size={15} />
                </button>
              </div>
            </div>

            {/* ── Icon Group ── */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Mobile search */}
              <button
                className="md:hidden p-2.5 rounded-xl hover:bg-[#F5F0EB] transition-colors relative"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
              >
                <Search size={20} style={{ color: "var(--brand-navy)" }} />
              </button>

              {/* Wishlist */}
              <Link
                href="/"
                className="hidden sm:flex p-2.5 rounded-xl hover:bg-[#F5F0EB] transition-colors group"
                aria-label="Wishlist"
              >
                <Heart
                  size={20}
                  className="transition-colors group-hover:fill-red-100"
                  style={{ color: "var(--brand-navy)" }}
                />
              </Link>

              {/* Account */}
              <Link
                href="/login"
                className="p-2.5 rounded-xl hover:bg-[#F5F0EB] transition-colors group"
                aria-label="Account"
              >
                <User
                  size={20}
                  className="transition-colors"
                  style={{ color: "var(--brand-navy)" }}
                />
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2.5 rounded-xl hover:bg-orange-50 transition-colors group"
                aria-label={`Cart (${cartCount} items)`}
              >
                <ShoppingCart
                  size={20}
                  className="transition-colors group-hover:stroke-[var(--brand-coral)]"
                  style={{ color: "var(--brand-navy)" }}
                />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center leading-none animate-scaleIn"
                    style={{
                      background: "var(--brand-coral)",
                      minWidth: "18px",
                      minHeight: "18px",
                      fontSize: "10px",
                      padding: "2px 4px",
                      boxShadow: "0 2px 6px rgba(232,68,42,0.4)",
                    }}
                  >
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div
            className="md:hidden px-4 pb-3 border-t animate-fadeInUp"
            style={{ borderColor: "#EAE4DD" }}
          >
            <div
              className="relative flex items-center w-full rounded-xl border-2 mt-2"
              style={{ borderColor: "var(--brand-coral)", background: "#FFF8F6" }}
            >
              <Search size={16} className="absolute left-3.5" style={{ color: "var(--brand-coral)" }} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search products…"
                className="w-full pl-10 pr-4 py-2.5 bg-transparent text-sm outline-none"
                style={{ color: "var(--brand-navy)" }}
              />
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl animate-fadeInLeft flex flex-col"
          >
            <div
              className="flex items-center justify-between p-4 border-b"
              style={{ borderColor: "#EAE4DD" }}
            >
              <span className="font-bold text-lg" style={{ color: "var(--brand-navy)" }}>
                Menu
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {[
                { label: "Home", href: "/" },
                { label: "All Products", href: "/products" },
                { label: "Pens", href: "/products" },
                { label: "Notebooks", href: "/products" },
                { label: "Art Supplies", href: "/products" },
                { label: "Markers", href: "/products" },
                { label: "Pencils", href: "/products" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-orange-50"
                  style={{ color: "var(--brand-navy)" }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t" style={{ borderColor: "#EAE4DD" }}>
              <Link
                href="/login"
                className="flex items-center gap-2 text-sm font-medium"
                style={{ color: "var(--muted-foreground)" }}
              >
                <User size={16} />
                Sign In / Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}