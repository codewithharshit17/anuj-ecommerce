// apps/storefront/app/(store)/products/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, SlidersHorizontal, Grid3x3, List, Search } from "lucide-react";
import ProductCard from "@/components/store/products/ProductCard";
import SkeletonCard from "@/components/store/ui/SkeletonCard";
import { StorefrontProduct } from "@/components/store/products/ProductCard";
import { getProducts, getProductsByCategory, searchProducts } from "@/lib/actions/product-actions";

const badges = ["sale", "new", "hot", "sale"] as const;

const categoriesList = [
  { label: "All", value: "" },
  { label: "Pens", value: "pens" },
  { label: "Notebooks", value: "notebooks" },
  { label: "Art Supplies", value: "art-supplies" },
];

const sortOptions = [
  "Most Popular",
  "Price: Low to High",
  "Price: High to Low",
  "Newest First",
];

export default function ProductsPage() {
  const [products, setProducts] = useState<StorefrontProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");
  const [sortBy, setSortBy] = useState("Most Popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let fetchedProds: StorefrontProduct[] = [];
        if (searchQuery) {
          fetchedProds = await searchProducts(searchQuery, 40) as StorefrontProduct[];
          if (activeCategory) {
             fetchedProds = fetchedProds.filter(p => p.category?.slug === activeCategory);
          }
        } else if (activeCategory) {
          fetchedProds = await getProductsByCategory(activeCategory) as StorefrontProduct[];
        } else {
          fetchedProds = await getProducts() as StorefrontProduct[];
        }
        
        // Sorting
        if (sortBy === "Price: Low to High") {
          fetchedProds.sort((a, b) => (a.price) - (b.price));
        } else if (sortBy === "Price: High to Low") {
          fetchedProds.sort((a, b) => (b.price) - (a.price));
        } else if (sortBy === "Newest First") {
          fetchedProds.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        setProducts(fetchedProds || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debounce);
  }, [activeCategory, sortBy, searchQuery]);

  return (
    <main
      className="min-h-screen bg-[var(--ag-gray-100)] select-none"
    >
      {/* Page Header */}
      <div className="bg-[#1A1A1A] text-white py-10 border-b border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-white/60 mb-4 font-semibold">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-white/95">All Products</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-white mb-2 tracking-tight">
            All Products
          </h1>
          <p className="text-sm text-white/60 font-medium">
            Explore our curated catalog of luxury pens, notebooks, and art supplies.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 bg-radial from-white to-transparent translate-x-1/3 -translate-y-1/3" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 flex flex-col gap-6">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 border border-[var(--ag-gray-200)] rounded-[var(--radius-lg)] shadow-xs">
          
          {/* Category Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {categoriesList.map((cat) => {
              const isActive = activeCategory === cat.value;
              return (
                <button
                  key={cat.label}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                    isActive
                      ? "bg-[var(--ag-red)] text-white border-[var(--ag-red)] shadow-sm"
                      : "bg-white text-[var(--ag-gray-800)] border-[var(--ag-gray-200)] hover:bg-[var(--ag-gray-100)]"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3 self-end md:self-auto flex-wrap">
            {/* Search Input */}
            <div className="relative flex items-center bg-[var(--ag-gray-100)] border border-[var(--ag-gray-200)] rounded-full px-3 py-1.5 max-w-[200px]">
              <Search size={13} className="text-[var(--ag-gray-500)] mr-2" />
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs font-semibold outline-none text-[var(--ag-dark)] placeholder:text-[var(--ag-gray-500)] w-full"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-[var(--radius-sm)] border border-[var(--ag-gray-200)] text-xs font-bold bg-white outline-none cursor-pointer pr-8 focus:border-[var(--ag-red)] appearance-none"
              style={{
                background: `white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%231A1A1A' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") no-repeat right 10px center`,
                backgroundSize: "10px",
              }}
            >
              {sortOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

            {/* View toggles */}
            <div className="flex rounded-[var(--radius-sm)] overflow-hidden border border-[var(--ag-gray-200)] bg-white shrink-0">
              <button
                onClick={() => setViewMode("grid")}
                className={`w-9 h-9 flex items-center justify-center transition-colors ${
                  viewMode === "grid" ? "bg-[var(--ag-dark)] text-white" : "text-[var(--ag-gray-500)] hover:bg-[var(--ag-gray-100)]"
                }`}
                aria-label="Grid view"
              >
                <Grid3x3 size={14} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`w-9 h-9 flex items-center justify-center transition-colors ${
                  viewMode === "list" ? "bg-[var(--ag-dark)] text-white" : "text-[var(--ag-gray-500)] hover:bg-[var(--ag-gray-100)]"
                }`}
                aria-label="List view"
              >
                <List size={14} />
              </button>
            </div>
          </div>

        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-[var(--ag-gray-500)]">
            Showing {products.length} products
          </p>
        </div>

        {/* Product Grid / List */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <SkeletonCard key={n} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center bg-white border border-[var(--ag-gray-200)] rounded-[var(--radius-lg)] shadow-xs">
            <div className="w-16 h-16 rounded-full bg-[var(--ag-gray-100)] flex items-center justify-center mb-4 text-[var(--ag-gray-500)] text-2xl">
              📦
            </div>
            <h3 className="font-display font-black text-lg text-[var(--ag-dark)] mb-1">
              No products found
            </h3>
            <p className="text-sm text-[var(--ag-gray-500)] mb-4 max-w-xs">
              Try modifying your search query or choosing a different category pill.
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                : "flex flex-col gap-4"
            }
          >
            {products.map((product, i) => (
              <div key={product.id}>
                {viewMode === "grid" ? (
                  <ProductCard product={product} />
                ) : (
                  <div className="bg-white border border-[var(--ag-gray-200)] p-4 rounded-[var(--radius-lg)] flex gap-4 items-center">
                    <img src={product.images.find(i => i.isPrimary)?.url || product.images[0]?.url || ""} alt="" className="w-20 h-20 object-cover rounded-[var(--radius-sm)] border shrink-0 bg-[var(--ag-gray-100)]" />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-[var(--ag-gray-500)] uppercase tracking-wider">{product.category?.name}</span>
                      <h4 className="font-bold text-sm text-[var(--ag-dark)] truncate">{product.name}</h4>
                      <p className="text-xs text-[var(--ag-gray-500)] line-clamp-1 mt-0.5">{product.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-base font-extrabold text-[var(--ag-red)]">₹{product.price}</span>
                      <div className="mt-2">
                        <Link href={`/products/${product.slug}`} className="px-3.5 py-1.5 bg-[var(--ag-dark)] text-white text-[10px] font-black rounded-[var(--radius-sm)] hover:bg-[var(--ag-red)] transition-colors">
                          VIEW
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}