// apps/storefront/components/store/home/HeroCarousel.tsx
"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Sparkles, Award } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Slide {
  image: string;
  mobileImage: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  tagline: string;
}

const slides: Slide[] = [
  {
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=1600&auto=format&fit=crop&q=80",
    mobileImage: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&auto=format&fit=crop&q=80",
    tagline: "Japanese Craftsmanship",
    title: "Elevate Your Daily Writing",
    subtitle: "Discover our premium selection of Japanese needle-point pens and luxury writing tools.",
    ctaText: "Shop Fine Pens",
    ctaHref: "/collections/stationery",
  },
  {
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=1600&auto=format&fit=crop&q=80",
    mobileImage: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&auto=format&fit=crop&q=80",
    tagline: "Italian Leathers & Fine Bounds",
    title: "Uncompromising Paper Quality",
    subtitle: "Premium thread-bound notebooks and leather diaries designed for seamless creativity.",
    ctaText: "Shop Notebooks",
    ctaHref: "/collections/office-supplies",
  },
  {
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1600&auto=format&fit=crop&q=80",
    mobileImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80",
    tagline: "Professional Art Supplies",
    title: "Craft Your Perfect Vision",
    subtitle: "Fine art markers, sketchbooks, and pigments from the world's most trusted brands.",
    ctaText: "Explore Art Supplies",
    ctaHref: "/collections/art-supplies",
  },
];

export default function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: true }),
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
    const initCarousel = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setScrollSnaps(emblaApi.scrollSnapList());
    };
    const frame = requestAnimationFrame(initCarousel);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      cancelAnimationFrame(frame);
    };
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
                className="hidden md:block absolute inset-0 w-full h-full object-cover brightness-[0.6]"
              />
              {/* Mobile Image */}
              <img
                src={slide.mobileImage}
                alt=""
                className="block md:hidden absolute inset-0 w-full h-full object-cover brightness-[0.55]"
              />

              {/* Text Content overlaying the slide */}
              <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-16 md:px-24 text-white z-10 max-w-2xl">
                <AnimatePresence mode="wait">
                  {selectedIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="flex flex-col items-start"
                    >
                      <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-[var(--ag-yellow)] mb-3 bg-white/10 dark:bg-black/25 backdrop-blur-xs px-3 py-1 rounded-full border border-white/10">
                        <Sparkles size={10} className="stroke-[3]" />
                        {slide.tagline}
                      </span>
                      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black leading-tight tracking-tight mb-4 drop-shadow-md">
                        {slide.title}
                      </h2>
                      <p className="text-xs sm:text-sm md:text-base text-white/80 font-medium mb-7 drop-shadow-sm leading-relaxed max-w-xl">
                        {slide.subtitle}
                      </p>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link
                          href={slide.ctaHref}
                          className="inline-flex items-center justify-center px-7 py-4 bg-[var(--ag-red)] hover:bg-[var(--ag-red-hover)] text-white font-black text-sm rounded-[var(--radius-lg)] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                        >
                          {slide.ctaText}
                        </Link>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Trust Indicator (Pill badge over hero bottom-left) */}
      <div className="absolute bottom-6 left-6 sm:left-16 z-25 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 dark:bg-black/35 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold shadow-md pointer-events-none">
        <Award size={12} className="text-[var(--ag-yellow)]" />
        <span>Free Shipping above ₹999 Across India</span>
      </div>

      {/* Nav Arrow Buttons */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all select-none z-20 hover:scale-105"
        aria-label="Previous slide"
      >
        <ChevronLeft size={22} className="stroke-[2.5]" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all select-none z-20 hover:scale-105"
        aria-label="Next slide"
      >
        <ChevronRight size={22} className="stroke-[2.5]" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 right-6 sm:right-16 flex justify-center gap-2.5 z-20">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === selectedIndex ? "w-7 bg-[var(--ag-red)]" : "w-2 bg-white/40 hover:bg-white"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
