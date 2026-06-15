import ProductCard from "@/components/store/product-card";
import { products } from "@/data/products";
import Link from "next/link";
import {
  SlidersHorizontal,
  ChevronRight,
  Grid3x3,
  List,
  Search,
} from "lucide-react";

const badges = ["sale", "new", "hot", "sale"] as const;

const filters = [
  { label: "All", count: products.length, active: true },
  { label: "Pens", count: 2, active: false },
  { label: "Notebooks", count: 1, active: false },
  { label: "Pencils", count: 1, active: false },
];

const sortOptions = [
  "Best Sellers",
  "Price: Low to High",
  "Price: High to Low",
  "Newest First",
  "Top Rated",
];

export default function ProductsPage() {
  return (
    <main
      className="min-h-screen"
      style={{ background: "linear-gradient(180deg, white 0%, var(--brand-cream) 100%)" }}
    >
      {/* Page Header */}
      <div
        className="border-b relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1A2340 0%, #2D3A5F 100%)",
          borderColor: "rgba(255,255,255,0.06)",
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #E8442A, transparent)",
            transform: "translate(30%, -30%)",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs mb-4" style={{ color: "rgba(245,240,235,0.5)" }}>
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span style={{ color: "rgba(245,240,235,0.9)" }}>All Products</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
            All Products
          </h1>
          <p style={{ color: "rgba(245,240,235,0.6)" }} className="text-sm">
            {products.length} products · Free shipping on orders above ₹999
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* ── Toolbar ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">

          {/* Category filter pills */}
          <div className="flex items-center gap-2 flex-wrap flex-1">
            {filters.map((f) => (
              <button
                key={f.label}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all border"
                style={
                  f.active
                    ? {
                        background: "var(--brand-coral)",
                        color: "white",
                        borderColor: "var(--brand-coral)",
                        boxShadow: "0 4px 12px rgba(232,68,42,0.3)",
                      }
                    : {
                        background: "white",
                        color: "var(--brand-navy)",
                        borderColor: "#EAE4DD",
                      }
                }
              >
                {f.label}
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                  style={
                    f.active
                      ? { background: "rgba(255,255,255,0.25)", color: "white" }
                      : { background: "#F5F0EB", color: "var(--muted-foreground)" }
                  }
                >
                  {f.count}
                </span>
              </button>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Sort */}
            <select
              className="px-3 py-2 rounded-xl border text-sm font-medium outline-none appearance-none pr-8 cursor-pointer transition-all focus:border-[var(--brand-coral)]"
              style={{
                borderColor: "#EAE4DD",
                color: "var(--brand-navy)",
                background: `white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237A7A8A' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") no-repeat right 10px center`,
              }}
            >
              {sortOptions.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>

            {/* Filter button */}
            <button
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-semibold transition-all hover:border-[var(--brand-coral)] hover:text-[var(--brand-coral)]"
              style={{
                borderColor: "#EAE4DD",
                color: "var(--brand-navy)",
                background: "white",
              }}
            >
              <SlidersHorizontal size={14} />
              Filters
            </button>

            {/* View toggles */}
            <div
              className="flex rounded-xl overflow-hidden border"
              style={{ borderColor: "#EAE4DD" }}
            >
              <button
                className="w-9 h-9 flex items-center justify-center transition-colors"
                style={{
                  background: "var(--brand-navy)",
                  color: "white",
                }}
              >
                <Grid3x3 size={14} />
              </button>
              <button
                className="w-9 h-9 flex items-center justify-center transition-colors hover:bg-[#F5F0EB]"
                style={{ color: "var(--muted-foreground)", background: "white" }}
              >
                <List size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Results count ── */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            Showing{" "}
            <span className="font-semibold" style={{ color: "var(--brand-navy)" }}>
              {products.length}
            </span>{" "}
            products
          </p>
          <div className="hidden sm:flex items-center gap-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
            <Search size={13} />
            Try searching for "gel pen", "notebook"…
          </div>
        </div>

        {/* ── Product Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              id={product.id}
              slug={product.slug}
              name={product.name}
              price={product.price}
              image={product.image}
              badge={badges[i % badges.length]}
              rating={4 + (i % 3) * 0.3}
              reviewCount={80 + i * 37}
            />
          ))}
        </div>

        {/* ── Empty State (shown when no products) ── */}
        {products.length === 0 && (
          <div className="flex flex-col items-center py-24 text-center">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5 text-3xl shadow-inner"
              style={{ background: "#F5F0EB" }}
            >
              📦
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: "var(--brand-navy)" }}>
              No products found
            </h3>
            <p className="text-sm mb-6" style={{ color: "var(--muted-foreground)" }}>
              Try adjusting your filters or search for something else.
            </p>
            <button
              className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:-translate-y-0.5"
              style={{ background: "var(--brand-coral)" }}
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* ── Pagination (decorative) ── */}
        {products.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className="w-10 h-10 rounded-xl font-semibold text-sm transition-all border"
                style={
                  page === 1
                    ? {
                        background: "var(--brand-coral)",
                        color: "white",
                        borderColor: "var(--brand-coral)",
                        boxShadow: "0 4px 12px rgba(232,68,42,0.3)",
                      }
                    : {
                        background: "white",
                        color: "var(--brand-navy)",
                        borderColor: "#EAE4DD",
                      }
                }
              >
                {page}
              </button>
            ))}
            <button
              className="w-10 h-10 rounded-xl font-semibold text-sm transition-all border hover:border-[var(--brand-coral)] hover:text-[var(--brand-coral)]"
              style={{
                background: "white",
                color: "var(--muted-foreground)",
                borderColor: "#EAE4DD",
              }}
            >
              →
            </button>
          </div>
        )}
      </div>
    </main>
  );
}