// apps/storefront/app/(store)/page.tsx
import HeroCarousel from "@/components/store/home/HeroCarousel";
import TrustBar from "@/components/store/home/TrustBar";
import CategoryGrid from "@/components/store/home/CategoryGrid";
import FeaturedBrands from "@/components/store/home/FeaturedBrands";
import ProductCarousel from "@/components/store/home/ProductCarousel";
import PromoCards from "@/components/store/home/PromoCards";
import BudgetSection from "@/components/store/home/BudgetSection";
import ReviewsCarousel from "@/components/store/home/ReviewsCarousel";
import BlogSection from "@/components/store/home/BlogSection";
import { getCategories } from "@/lib/actions/product-actions";
import prisma from "@/lib/prisma";

export default async function Home() {
  const currentDate = new Date();
  
  const [categories, activePromotions] = await Promise.all([
    getCategories(),
    prisma.promotion.findMany({
      where: {
        isActive: true,
        isDeleted: false,
        startDate: { lte: currentDate },
        endDate: { gte: currentDate },
      },
      orderBy: {
        displayOrder: "asc",
      },
    }),
  ]);

  const mappedCategories = categories.map((cat) => ({
    id: cat.id,
    title: cat.name,
    image: cat.imageUrl || "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=200&auto=format&fit=crop&q=80",
    href: `/collections/${cat.slug}`,
  }));

  // Map promotions to fetch target slugs
  const promotionsWithSlugs = await Promise.all(
    activePromotions.map(async (promo) => {
      let slug = "";
      if (promo.redirectType === "PRODUCT") {
        const prod = await prisma.product.findUnique({
          where: { id: promo.redirectId },
          select: { slug: true },
        });
        slug = prod?.slug || "";
      } else if (promo.redirectType === "CATEGORY") {
        const cat = await prisma.category.findUnique({
          where: { id: promo.redirectId },
          select: { slug: true },
        });
        slug = cat?.slug || "";
      }
      return {
        id: promo.id,
        title: promo.title,
        subtitle: promo.subtitle || "",
        imageUrl: promo.imageUrl,
        buttonText: promo.buttonText,
        redirectType: promo.redirectType,
        slug,
      };
    })
  );

  // Render a responsive grid of 9 columns if few categories, otherwise a scrollable 18-column track
  const columns = mappedCategories.length > 9 ? 18 : 9;

  return (
    <>
      {/* 1. Hero Section */}
      <HeroCarousel promotions={promotionsWithSlugs} />

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
        title="Curated Collections"
        subtitle="Explore premium notebooks, pens, and art essentials from our live catalog."
        categories={mappedCategories}
        columns={columns}
      />

      {/* 4. Featured Brands Showcase */}
      <FeaturedBrands />

      {/* 5. Best Sellers Carousel */}
      <ProductCarousel
        title="Best Sellers"
        subtitle="Most loved and highly rated tools from our premium collection."
        collectionId="featured"
        limit={8}
      />

      {/* 6. Trending This Week */}
      <ProductCarousel
        title="Trending This Week"
        subtitle="Popular stationery items flying off the shelves."
        collectionId="trending"
        limit={6}
      />

      {/* 7. New Arrivals */}
      <ProductCarousel
        title="New Arrivals"
        subtitle="Fresh additions to our writing, office, and celebration catalogs."
        collectionId="new-arrivals"
        limit={6}
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

    </>
  );
}