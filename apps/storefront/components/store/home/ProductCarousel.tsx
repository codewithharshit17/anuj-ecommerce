// apps/storefront/components/store/home/ProductCarousel.tsx
"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getMedusaClient, MedusaProduct } from "@/lib/medusa/client";
import ProductCard from "../products/ProductCard";
import { motion } from "framer-motion";

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  collectionId?: string;
  limit?: number;
  filterFn?: (p: MedusaProduct) => boolean;
}

export default function ProductCarousel({
  title,
  subtitle,
  collectionId,
  limit = 8,
  filterFn,
}: ProductCarouselProps) {
  const medusa = getMedusaClient();
  const [products, setProducts] = useState<MedusaProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    loop: false,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query: any = { limit: 40 };
        if (collectionId) {
          query.collection_id = [collectionId];
        }
        const { products: fetched } = await medusa.store.product.list(query);
        let list = fetched || [];
        if (filterFn) {
          list = list.filter(filterFn);
        }
        setProducts(list.slice(0, limit));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [collectionId, limit]);

  return (
    <section className="py-12 bg-white dark:bg-neutral-900 border-b border-[var(--ag-gray-200)] dark:border-neutral-800 select-none">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-black text-[var(--ag-dark)] dark:text-[var(--foreground)] section-title-underline pb-1">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-[var(--ag-gray-500)] mt-2 font-medium">
                {subtitle}
              </p>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex gap-2">
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="w-9 h-9 rounded-full border border-[var(--ag-gray-200)] dark:border-neutral-750 flex items-center justify-center hover:bg-[var(--ag-gray-100)] dark:hover:bg-neutral-800 text-[var(--ag-dark)] dark:text-white disabled:opacity-40 disabled:hover:bg-transparent transition-all select-none"
              aria-label="Previous slide"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="w-9 h-9 rounded-full border border-[var(--ag-gray-200)] dark:border-neutral-750 flex items-center justify-center hover:bg-[var(--ag-gray-100)] dark:hover:bg-neutral-800 text-[var(--ag-dark)] dark:text-white disabled:opacity-40 disabled:hover:bg-transparent transition-all select-none"
              aria-label="Next slide"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Viewport */}
        <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="flex gap-5">
            {loading ? (
              [1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="flex-[0_0_50%] md:flex-[0_0_33.333%] lg:flex-[0_0_25%] min-w-0"
                >
                  <div className="w-full aspect-[4/5] rounded-[var(--radius-lg)] border border-[var(--ag-gray-200)] dark:border-neutral-800 bg-white dark:bg-[#1E1E1E] skeleton h-[360px]" />
                </div>
              ))
            ) : products.length === 0 ? (
              <div className="w-full py-16 text-center text-sm font-semibold text-[var(--ag-gray-500)]">
                No products found.
              </div>
            ) : (
              products.map((product) => (
                <div
                  key={product.id}
                  className="flex-[0_0_50%] md:flex-[0_0_33.333%] lg:flex-[0_0_25%] min-w-0"
                >
                  <ProductCard product={product} />
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
