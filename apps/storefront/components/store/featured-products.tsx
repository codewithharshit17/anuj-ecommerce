import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import ProductCard from "./product-card";
import { products } from "@/data/products";

const badges = ["sale", "new", "hot", "sale"] as const;

export default function FeaturedProducts() {
  return (
    <section
      className="py-16"
      style={{ background: "linear-gradient(180deg, white 0%, var(--brand-cream) 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-3"
              style={{
                background: "rgba(232,68,42,0.08)",
                color: "var(--brand-coral)",
                border: "1px solid rgba(232,68,42,0.15)",
              }}
            >
              <TrendingUp size={11} />
              Trending Now
            </div>
            <h2 className="section-title section-title-underline">
              Featured Products
            </h2>
            <p className="section-subtitle mt-4">
              Hand-picked bestsellers loved by students & professionals alike.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-bold px-5 py-2.5 rounded-xl border-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex-shrink-0 border-[#E8442A] text-[#E8442A] hover:bg-[#E8442A] hover:text-white"
          >
            View All Products
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              id={product.id}
              slug={product.slug}
              name={product.name}
              price={product.price}
              image={product.image}
              badge={badges[i % badges.length]}
              rating={4 + (i % 3) * 0.3}
              reviewCount={80 + i * 37}
            />
          ))}
        </div>

        {/* Bottom CTA banner */}
        <div
          className="mt-14 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #1A2340 0%, #2D3A5F 100%)",
          }}
        >
          <div
            className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
            style={{
              background: "radial-gradient(circle, #F5A623, transparent)",
              transform: "translate(30%, -30%)",
            }}
          />
          <div className="relative z-10">
            <h3 className="text-xl font-black text-white mb-1">
              Free Shipping on Your First Order
            </h3>
            <p className="text-sm" style={{ color: "rgba(245,240,235,0.65)" }}>
              Use code{" "}
              <span
                className="font-bold px-1.5 py-0.5 rounded"
                style={{ background: "rgba(245,166,35,0.2)", color: "#F5A623" }}
              >
                KAPI10
              </span>{" "}
              at checkout and save 10%
            </p>
          </div>
          <Link
            href="/products"
            className="relative z-10 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #E8442A, #F5A623)",
              boxShadow: "0 4px 16px rgba(232,68,42,0.4)",
            }}
          >
            Shop Now
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}