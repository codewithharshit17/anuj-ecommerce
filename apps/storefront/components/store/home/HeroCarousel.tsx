// apps/storefront/components/store/home/HeroCarousel.tsx
"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Slide {
  image: string;
  mobileImage: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
}

const slides: Slide[] = [
  {
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=1600&auto=format&fit=crop&q=80",
    mobileImage: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&auto=format&fit=crop&q=80",
    title: "Elevate Your Writing",
    subtitle: "Discover our premium selection of Japanese needle-point pens and luxury writing tools.",
    ctaText: "Shop Fine Pens",
    ctaHref: "/collections/stationery",
  },
  {
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=1600&auto=format&fit=crop&q=80",
    mobileImage: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&auto=format&fit=crop&q=80",
    title: "Uncompromising Quality",
    subtitle: "Premium thread-bound notebooks and leather diaries designed for seamless creativity.",
    ctaText: "Shop Notebooks",
    ctaHref: "/collections/office-supplies",
  },
  {
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1600&auto=format&fit=crop&q=80",
    mobileImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80",
    title: "Craft Your Vision",
    subtitle: "Fine art markers, sketchbooks, and pigments from the world's most trusted brands.",
    ctaText: "Explore Art Supplies",
    ctaHref: "/collections/art-supplies",
  },
];

export default function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4500, stopOnInteraction: true }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="relative w-full overflow-hidden select-none group" aria-label="Hero carousel">
      {/* Viewport */}
      <div className="overflow-hidden w-full" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] min-w-0 relative aspect-[4/3] md:aspect-[21/8]"
            >
              {/* Desktop Image */}
              <img
                src={slide.image}
                alt=""
                className="hidden md:block absolute inset-0 w-full h-full object-cover brightness-[0.7]"
              />
              {/* Mobile Image */}
              <img
                src={slide.mobileImage}
                alt=""
                className="block md:hidden absolute inset-0 w-full h-full object-cover brightness-[0.65]"
              />

              {/* Text Content */}
              <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-16 md:px-24 text-white z-10 max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--ag-yellow)] mb-3 animate-fadeInUp">
                  Curated Collection
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black leading-tight tracking-tight mb-4 drop-shadow-sm animate-fadeInUp">
                  {slide.title}
                </h2>
                <p className="text-sm sm:text-base text-white/80 font-medium mb-6 drop-shadow-sm leading-relaxed animate-fadeInUp">
                  {slide.subtitle}
                </p>
                <div className="animate-fadeInUp">
                  <Link
                    href={slide.ctaHref}
                    className="inline-flex items-center justify-center px-6 py-3.5 bg-[var(--ag-red)] hover:bg-[var(--ag-red-hover)] text-white font-bold text-sm rounded-[var(--radius-md)] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  >
                    {slide.ctaText}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nav Arrow Buttons */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all select-none z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all select-none z-20"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2.5 z-20">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === selectedIndex ? "w-6 bg-[var(--ag-red)]" : "w-2 bg-white/50 hover:bg-white"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
