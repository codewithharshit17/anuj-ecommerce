import AnnouncementBar from "@/components/store/announcement-bar";
import Header from "@/components/store/header";
import Navbar from "@/components/store/navbar";
import Hero from "@/components/store/hero";
import Categories from "@/components/store/categories";
import FeaturedProducts from "@/components/store/featured-products";
import Footer from "@/components/store/footer";

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <Navbar />
      <Hero />
      <Categories />
      <FeaturedProducts />
      <Footer />
    </>
  );
}