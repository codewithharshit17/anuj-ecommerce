import Hero from "@/components/store/hero";
import Categories from "@/components/store/categories";
import FeaturedProducts from "@/components/store/featured-products";
import WhyUs from "@/components/store/why-us";
import Testimonials from "@/components/store/testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <WhyUs />
      <Testimonials />
    </>
  );
}