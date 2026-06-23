// apps/storefront/app/(store)/collections/[handle]/page.tsx
"use client";

import { useEffect, useState, use, useCallback } from "react";
import Link from "next/link";
import { ChevronRight, X } from "lucide-react";
import { StorefrontProduct } from "@/components/store/products/ProductCard";
import { getProductsByCategory, getCategoryBySlug } from "@/lib/actions/product-actions";
import FilterSidebar from "@/components/store/collection/FilterSidebar";
import ProductGrid from "@/components/store/collection/ProductGrid";
import SortDropdown from "@/components/store/collection/SortDropdown";

interface PageProps {
  params: Promise<{ handle: string }>;
}

interface Collection {
  id: string;
  title: string;
  handle: string;
  thumbnail: string;
}

export default function CollectionPage({ params }: PageProps) {
  const { handle } = use(params);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<StorefrontProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  // Filter states
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState("");
  const [sortBy, setSortBy] = useState("Most Popular");
  const [offset, setOffset] = useState(0);
  const limit = 8;
  const [hasMore, setHasMore] = useState(true);

  // Fetch collection details
  useEffect(() => {
    const fetchCollection = async () => {
      if (handle === "best-sellers" || handle === "featured") {
        setCollection({
          id: `col-${handle}`,
          title: handle === "best-sellers" ? "Best Sellers" : "Featured Products",
          handle: handle,
          thumbnail: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600",
        });
        return;
      }

      try {
        const cat = await getCategoryBySlug(handle);
        if (cat) {
          setCollection({
            id: cat.id,
            title: cat.name,
            handle: cat.slug,
            thumbnail: cat.imageUrl || "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600",
          });
        } else {
          setCollection({
            id: `col-${handle}`,
            title: handle.charAt(0).toUpperCase() + handle.slice(1).replace(/-/g, " "),
            handle: handle,
            thumbnail: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600",
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCollection();
  }, [handle]);

  const fetchProducts = useCallback(async (currentOffset: number, reset = false) => {
    setLoading(true);
    try {
      const collectionId = handle;
      let fetchedProducts = await getProductsByCategory(collectionId) as StorefrontProduct[];
      
      // Filter by brands
      if (selectedBrands && selectedBrands.length > 0) {
        // Assume brand is part of category name or slug for now
        // We really need a brand field on Product schema. But for now we just don't filter.
      }

      // Sort
      if (sortBy === "Price: Low to High") {
        fetchedProducts.sort((a, b) => (a.price) - (b.price));
      } else if (sortBy === "Price: High to Low") {
        fetchedProducts.sort((a, b) => (b.price) - (a.price));
      } else if (sortBy === "Newest First") {
        fetchedProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      
      const totalCount = fetchedProducts.length;
      fetchedProducts = fetchedProducts.slice(currentOffset, currentOffset + limit);

      // Filter locally for properties Medusa Mock doesn't handle natively
      let filtered = [...fetchedProducts];

      // Local price range filtering
      if (priceRange.min) {
        filtered = filtered.filter((p) => (p.price) >= parseFloat(priceRange.min));
      }
      if (priceRange.max) {
        filtered = filtered.filter((p) => (p.price) <= parseFloat(priceRange.max));
      }

      // Local stock filtering
      if (inStockOnly) {
        filtered = filtered.filter((p) => (p.variants[0]?.stock || 0) > 0);
      }

      // Local discount filtering
      if (selectedDiscount) {
        const discThreshold = parseFloat(selectedDiscount);
        filtered = filtered.filter((p) => {
          const price = p.price;
          const origPrice = p.mrp;
          const discount = origPrice > price ? ((origPrice - price) / origPrice) * 100 : 0;
          return discount >= discThreshold;
        });
      }

      if (reset) {
        setProducts(filtered);
      } else {
        setProducts((prev) => [...prev, ...filtered]);
      }

      setCount(totalCount);
      setHasMore(currentOffset + limit < totalCount);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [handle, selectedBrands, priceRange.min, priceRange.max, inStockOnly, selectedDiscount, sortBy, limit]);

  // Fetch products (reset offset on filters change)
  useEffect(() => {
    let active = true;
    const resetAndFetch = async () => {
      if (!active) return;
      setOffset(0);
      setProducts([]);
      setHasMore(true);
      await fetchProducts(0, true);
    };
    const frame = requestAnimationFrame(resetAndFetch);
    return () => {
      active = false;
      cancelAnimationFrame(frame);
    };
  }, [fetchProducts]);

  const handleLoadMore = () => {
    const nextOffset = offset + limit;
    setOffset(nextOffset);
    fetchProducts(nextOffset);
  };

  // Remove single active filter chips
  const removeBrand = (brand: string) => {
    setSelectedBrands(selectedBrands.filter((b) => b !== brand));
  };

  const resetAllFilters = () => {
    setSelectedBrands([]);
    setPriceRange({ min: "", max: "" });
    setInStockOnly(false);
    setSelectedDiscount("");
  };

  const hasActiveFilters =
    selectedBrands.length > 0 ||
    priceRange.min !== "" ||
    priceRange.max !== "" ||
    inStockOnly ||
    selectedDiscount !== "";

  return (
    <main className="min-h-screen bg-background text-foreground select-none">
      
      {/* Black Banner: Title and Breadcrumb */}
      <div className="bg-[#1A1A1A] text-white py-12 px-6 sm:px-8 border-b border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center sm:items-start relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-white/60 mb-3 font-semibold">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-white/95">Collections</span>
            <ChevronRight size={12} />
            <span className="text-[var(--ag-yellow)]">{collection?.title || "Collection"}</span>
          </nav>
          
          <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight mt-1 text-white">
            {collection?.title || "Collection"}
          </h1>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10 bg-radial from-white to-transparent translate-x-1/3 -translate-y-1/3" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Left column: FilterSidebar */}
        <FilterSidebar
          selectedBrands={selectedBrands}
          onChangeBrands={setSelectedBrands}
          priceRange={priceRange}
          onChangePrice={setPriceRange}
          inStockOnly={inStockOnly}
          onChangeStock={setInStockOnly}
          selectedDiscount={selectedDiscount}
          onChangeDiscount={setSelectedDiscount}
        />

        {/* Right column: Results & Sorting */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card text-card-foreground p-4 border border-border rounded-[var(--radius-lg)]">
            <div className="text-xs font-bold text-foreground">
              Showing {products.length} of {count} products
            </div>
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap bg-card text-card-foreground p-3 border border-border rounded-[var(--radius-lg)]">
              <span className="text-[10px] font-black uppercase text-[var(--ag-gray-500)] mr-1 tracking-wider">
                Filters:
              </span>
              {selectedBrands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => removeBrand(brand)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--ag-red)]/10 hover:bg-[var(--ag-red)] hover:text-white text-[var(--ag-red)] text-xs font-bold rounded-full transition-all"
                >
                  {brand} <X size={11} />
                </button>
              ))}
              {(priceRange.min || priceRange.max) && (
                <button
                  onClick={() => setPriceRange({ min: "", max: "" })}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--ag-red)]/10 hover:bg-[var(--ag-red)] hover:text-white text-[var(--ag-red)] text-xs font-bold rounded-full transition-all"
                >
                  Price: ₹{priceRange.min || "0"} - ₹{priceRange.max || "Max"} <X size={11} />
                </button>
              )}
              {inStockOnly && (
                <button
                  onClick={() => setInStockOnly(false)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--ag-red)]/10 hover:bg-[var(--ag-red)] hover:text-white text-[var(--ag-red)] text-xs font-bold rounded-full transition-all"
                >
                  In Stock <X size={11} />
                </button>
              )}
              {selectedDiscount && (
                <button
                  onClick={() => setSelectedDiscount("")}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--ag-red)]/10 hover:bg-[var(--ag-red)] hover:text-white text-[var(--ag-red)] text-xs font-bold rounded-full transition-all"
                >
                  Discount: {selectedDiscount}%+ <X size={11} />
                </button>
              )}
              <button
                onClick={resetAllFilters}
                className="text-xs font-bold text-[var(--ag-gray-500)] hover:text-[var(--ag-red)] underline hover:no-underline ml-auto"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Product Grid */}
          <ProductGrid
            products={products}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
          />
        </div>

      </div>
    </main>
  );
}
