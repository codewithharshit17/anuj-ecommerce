"use client";

// apps/storefront/app/(store)/page.tsx
import HeroCarousel from "@/components/store/home/HeroCarousel";
import TrustBar from "@/components/store/home/TrustBar";
import CategoryGrid, { CategoryItem } from "@/components/store/home/CategoryGrid";
import FeaturedBrands from "@/components/store/home/FeaturedBrands";
import ProductCarousel from "@/components/store/home/ProductCarousel";
import PromoCards from "@/components/store/home/PromoCards";
import BudgetSection from "@/components/store/home/BudgetSection";
import ReviewsCarousel from "@/components/store/home/ReviewsCarousel";
import BlogSection from "@/components/store/home/BlogSection";
import Newsletter from "@/components/store/home/Newsletter";

// Mock category data matching the required counts
const stationeryCategories: CategoryItem[] = [
  { id: "1", title: "Gel Pens", image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=200&auto=format&fit=crop&q=80", href: "/collections/stationery?category=Pens" },
  { id: "2", title: "Rollerball Pens", image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=200&auto=format&fit=crop&q=80", href: "/collections/stationery?category=Pens" },
  { id: "3", title: "Party Decor", image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=200&auto=format&fit=crop&q=80", href: "/collections/birthday-party-items" },
  { id: "4", title: "Ballpoint Pens", image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=200&auto=format&fit=crop&q=80", href: "/collections/stationery?category=Pens" },
  { id: "5", title: "Highlighters", image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=200&auto=format&fit=crop&q=80", href: "/collections/stationery" },
  { id: "6", title: "Fineliners", image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=200&auto=format&fit=crop&q=80", href: "/collections/art-supplies" },
  { id: "7", title: "Wooden Pencils", image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=200&auto=format&fit=crop&q=80", href: "/collections/stationery?category=Pencils" },
  { id: "8", title: "Mech Pencils", image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=200&auto=format&fit=crop&q=80", href: "/collections/stationery?category=Pencils" },
  { id: "9", title: "Erasers", image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=200&auto=format&fit=crop&q=80", href: "/collections/stationery" },
  { id: "10", title: "Refills", image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=200&auto=format&fit=crop&q=80", href: "/collections/stationery" },
  { id: "11", title: "Pencil Cases", image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=200&auto=format&fit=crop&q=80", href: "/collections/stationery" },
  { id: "12", title: "Desk Organizers", image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=200&auto=format&fit=crop&q=80", href: "/collections/stationery" },
  { id: "13", title: "Staplers", image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=200&auto=format&fit=crop&q=80", href: "/collections/office-supplies" },
  { id: "14", title: "Rulers", image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=200&auto=format&fit=crop&q=80", href: "/collections/stationery" },
  { id: "15", title: "Adhesive Tapes", image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=200&auto=format&fit=crop&q=80", href: "/collections/craft-material" },
  { id: "16", title: "Sticky Notes", image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=200&auto=format&fit=crop&q=80", href: "/collections/office-supplies" },
  { id: "17", title: "Bookmarks", image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=200&auto=format&fit=crop&q=80", href: "/collections/stationery" },
  { id: "18", title: "Gift Wraps", image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=200&auto=format&fit=crop&q=80", href: "/collections/craft-material" },
];

const officeCategories: CategoryItem[] = [
  { id: "o1", title: "Notebooks", image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=200&auto=format&fit=crop&q=80", href: "/collections/office-supplies?category=Notebooks" },
  { id: "o2", title: "Diaries", image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=200&auto=format&fit=crop&q=80", href: "/collections/office-supplies" },
  { id: "o3", title: "Planners", image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=200&auto=format&fit=crop&q=80", href: "/collections/office-supplies" },
  { id: "o4", title: "File Folders", image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=200&auto=format&fit=crop&q=80", href: "/collections/office-supplies" },
  { id: "o5", title: "Calculators", image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=200&auto=format&fit=crop&q=80", href: "/collections/office-supplies" },
  { id: "o6", title: "Desk Pads", image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=200&auto=format&fit=crop&q=80", href: "/collections/office-supplies" },
  { id: "o7", title: "Paper Cutters", image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=200&auto=format&fit=crop&q=80", href: "/collections/office-supplies" },
  { id: "o8", title: "Scissors", image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=200&auto=format&fit=crop&q=80", href: "/collections/office-supplies" },
  { id: "o9", title: "Card Holders", image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=200&auto=format&fit=crop&q=80", href: "/collections/office-supplies" },
];

const artCategories: CategoryItem[] = [
  { id: "a1", title: "Brush Pens", image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=200&auto=format&fit=crop&q=80", href: "/collections/art-supplies" },
  { id: "a2", title: "Watercolor", image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=200&auto=format&fit=crop&q=80", href: "/collections/art-supplies" },
  { id: "a3", title: "Acrylic Paints", image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=200&auto=format&fit=crop&q=80", href: "/collections/art-supplies" },
  { id: "a4", title: "Sketchbooks", image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=200&auto=format&fit=crop&q=80", href: "/collections/art-supplies" },
  { id: "a5", title: "Paintbrushes", image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=200&auto=format&fit=crop&q=80", href: "/collections/art-supplies" },
  { id: "a6", title: "Art Markers", image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=200&auto=format&fit=crop&q=80", href: "/collections/art-supplies" },
];

export default function Home() {
  return (
    <>
      {/* 1. Hero Section */}
      <HeroCarousel />

      {/* 2. Trust Bar */}
      <TrustBar />

      {/* 3. Shop By Category */}
      <div className="bg-white dark:bg-neutral-900 pt-8 pb-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-display font-black text-[var(--ag-dark)] dark:text-[var(--foreground)] tracking-tight">
            Shop By Category
          </h2>
          <p className="text-sm text-[var(--ag-gray-500)] mt-2 font-medium">
            Browse our curated collections of premium writing instruments, office essentials, and fine art supplies.
          </p>
        </div>
      </div>
      <CategoryGrid
        title="Stationery Essentials"
        subtitle="Shop top categories in premium writing, organizing, and daily essentials."
        categories={stationeryCategories}
        columns={18}
      />
      <CategoryGrid
        title="Office & Writing"
        subtitle="Refined notebooks, calendars, and structural desktop accessories."
        categories={officeCategories}
        columns={9}
      />
      <CategoryGrid
        title="Fine Art Supplies"
        subtitle="Professional markers, acid-free sketchbooks, and pigments."
        categories={artCategories}
        columns={6}
      />

      {/* 4. Featured Brands Showcase */}
      <FeaturedBrands />

      {/* 5. Best Sellers Carousel */}
      <ProductCarousel
        title="Best Sellers"
        subtitle="Most loved and highly rated tools from our premium collection."
        collectionId="col-bestsellers"
        limit={8}
      />

      {/* 6. Trending This Week */}
      <ProductCarousel
        title="Trending This Week"
        subtitle="Popular stationery items flying off the shelves."
        limit={6}
        filterFn={(p) => p.name.includes("Pilot") || p.name.includes("Muji")}
      />

      {/* 7. New Arrivals */}
      <ProductCarousel
        title="New Arrivals"
        subtitle="Fresh additions to our writing, office, and celebration catalogs."
        limit={6}
        filterFn={(p) => p.slug.includes("lamy") || p.slug.includes("birthday") || p.slug.includes("tombow") || p.slug.includes("balloons")}
      />

      {/* 8. Offers & Deals */}
      <div className="bg-[var(--ag-gray-100)] dark:bg-neutral-950/40 py-8 border-b border-[var(--ag-gray-200)] dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center md:text-left">
          <h2 className="text-xl sm:text-2xl font-display font-black text-[var(--ag-dark)] dark:text-[var(--foreground)] section-title-underline pb-1">
            Offers & Deals
          </h2>
          <p className="text-sm text-[var(--ag-gray-500)] mt-2 font-medium">
            Discover limited-time discounts and curated budget collections.
          </p>
        </div>
      </div>
      <PromoCards />
      <BudgetSection />

      {/* 9. Customer Reviews */}
      <ReviewsCarousel />

      {/* 10. Blog / Guides Section */}
      <BlogSection />

      {/* 11. Newsletter Subscription Section */}
      <Newsletter />
    </>
  );
}