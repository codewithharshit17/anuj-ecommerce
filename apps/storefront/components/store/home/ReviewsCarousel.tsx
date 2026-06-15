// apps/storefront/components/store/home/ReviewsCarousel.tsx
"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  productName: string;
}

const mockReviews: Review[] = [
  {
    id: "rev-1",
    name: "Aarav Sharma",
    rating: 5,
    text: "The Pilot V5 is incredibly smooth! I've been writing exams with it, and it writes flawlessly without smearing. Absolute favorite pen.",
    productName: "Pilot Hi-Tecpoint V5",
  },
  {
    id: "rev-2",
    name: "Sneha Patel",
    rating: 5,
    text: "Lamy Safari is worth every single rupee. The matte black body feels extremely premium and the writing flow is consistent.",
    productName: "Lamy Safari Fountain Pen",
  },
  {
    id: "rev-3",
    name: "Rohan Das",
    rating: 4,
    text: "The Classmate notebook is durable and the page quality is awesome. No ink bleeding through the paper. Highly recommended for students.",
    productName: "Classmate Premium Notebook",
  },
  {
    id: "rev-4",
    name: "Priya Nair",
    rating: 5,
    text: "Tombow pastel brush pens are perfect for calligraphy. The dual tips are super useful and the ink blends beautifully.",
    productName: "Tombow Dual Brush Pen Set",
  },
  {
    id: "rev-5",
    name: "Amit Verma",
    rating: 5,
    text: "Micron pens are standard for sketching. Waterproof pigment ink is amazing. I will buy this set again once these run out.",
    productName: "Sakura Pigma Micron Set",
  },
];

export default function ReviewsCarousel() {
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <section className="py-12 bg-white dark:bg-neutral-900 select-none">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-black text-[var(--ag-dark)] section-title-underline pb-1">
              Customer Reviews
            </h2>
            <p className="text-sm text-[var(--ag-gray-500)] mt-2 font-medium">
              See what fellow stationery lovers say about our products.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex gap-2">
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="w-9 h-9 rounded-full border border-[var(--ag-gray-200)] flex items-center justify-center hover:bg-[var(--ag-gray-100)] text-[var(--ag-dark)] disabled:opacity-40 disabled:hover:bg-transparent transition-all select-none"
              aria-label="Previous reviews"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="w-9 h-9 rounded-full border border-[var(--ag-gray-200)] flex items-center justify-center hover:bg-[var(--ag-gray-100)] text-[var(--ag-dark)] disabled:opacity-40 disabled:hover:bg-transparent transition-all select-none"
              aria-label="Next reviews"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Carousel Viewport */}
        <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="flex gap-5">
            {mockReviews.map((rev) => (
              <div
                key={rev.id}
                className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0"
              >
                <div className="bg-white dark:bg-[#1E1E1E] border border-[var(--ag-gray-200)] rounded-[var(--radius-lg)] p-6 flex flex-col justify-between h-full min-h-[200px] shadow-xs">
                  <div>
                    {/* Stars */}
                    <div className="flex items-center gap-0.5 mb-3 text-[var(--ag-yellow)]">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={13}
                          className={s <= rev.rating ? "fill-current text-[var(--ag-yellow)]" : "text-gray-200"}
                        />
                      ))}
                    </div>

                    {/* Text content */}
                    <p className="text-[var(--text-sm)] text-[var(--ag-gray-800)] font-medium leading-relaxed line-clamp-3 italic mb-4">
                      "{rev.text}"
                    </p>
                  </div>

                  {/* Reviewer Meta */}
                  <div className="flex items-center gap-3 border-t border-[var(--ag-gray-200)] pt-4 mt-2">
                    <div className="w-9 h-9 rounded-full bg-[var(--ag-red)] text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {getInitials(rev.name)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[var(--ag-dark)] truncate">
                        {rev.name}
                      </h4>
                      <p className="text-[10px] text-[var(--ag-gray-500)] truncate">
                        Verified buyer of {rev.productName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
