import { products } from "@/data/products";
import { notFound } from "next/navigation";
import ProductPurchasePanel from "@/components/store/product-purchase-panel";
import Link from "next/link";
import {
  Star,
  Truck,
  Shield,
  RotateCcw,
  Check,
  ChevronRight,
  Package,
} from "lucide-react";

const productDetails: Record<
  string,
  { description: string; features: string[]; category: string }
> = {
  "reynolds-trimax": {
    category: "Pens",
    description:
      "The Reynolds Trimax is India's iconic writing companion, trusted by millions for its smooth ink flow, ergonomic grip, and consistent performance. Whether for exams, office work, or everyday writing, the Trimax delivers reliable, comfortable writing from first stroke to last.",
    features: [
      "Smooth & consistent ink flow",
      "Ergonomic triangular grip for comfort",
      "Long-lasting ink — writes up to 3km",
      "Compatible with standard refills",
      "Ideal for exams, office & everyday use",
    ],
  },
  "pilot-v7": {
    category: "Pens",
    description:
      "The Pilot V7 Hi-Tecpoint roller ball pen features a precision metal tip that delivers an ultra-smooth, consistently fine 0.7mm line. Its liquid ink system ensures bold, vibrant lines that resist fading, smearing, and water.",
    features: [
      "0.7mm precision metal tip",
      "Vibrant, water-resistant ink",
      "Smooth rollerball writing experience",
      "Clear barrel for easy ink monitoring",
      "Cap-off protection for up to 24 hours",
    ],
  },
  "classmate-notebook": {
    category: "Notebooks",
    description:
      "Classmate Notebooks are the gold standard for Indian students — featuring high-quality cream-ruled pages, durable covers, and consistent margins. Designed for long writing sessions without fatigue.",
    features: [
      "High-quality ruled pages (70 GSM)",
      "Durable hard cover with spine reinforcement",
      "Consistent margins & ruling lines",
      "Smudge-resistant paper surface",
      "Available in 100, 140, and 200 pages",
    ],
  },
  "apsara-pencils": {
    category: "Pencils",
    description:
      "Apsara Pencils are crafted from premium cedar wood, housing a smooth graphite core that writes clearly, sharpens evenly, and erases cleanly. The go-to pencil for students, artists, and casual writers alike.",
    features: [
      "Premium cedar wood barrel",
      "Smooth HB graphite core",
      "Even sharpening — no breaking",
      "Clean erasing with minimal residue",
      "Set of 10 pencils per pack",
    ],
  },
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = products.find((p) => p.slug === slug);

  if (!product) notFound();

  const originalPrice = Math.round(product.price * 2.2);
  const discount = Math.round(
    ((originalPrice - product.price) / originalPrice) * 100
  );
  const savings = originalPrice - product.price;

  const details = productDetails[slug] ?? {
    category: "Stationery",
    description:
      "Premium quality stationery product. Perfect for school, college, office, and everyday writing needs.",
    features: [
      "Premium quality material",
      "Genuine & authentic product",
      "Fast shipping across India",
      "Ideal for daily use",
      "Trusted by thousands of customers",
    ],
  };

  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <main
      className="min-h-screen"
      style={{ background: "linear-gradient(180deg, white 0%, var(--brand-cream) 100%)" }}
    >
      {/* Breadcrumb */}
      <div className="border-b" style={{ background: "white", borderColor: "#EAE4DD" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-1.5 text-xs" style={{ color: "var(--muted-foreground)" }}>
            <Link href="/" className="hover:text-[var(--brand-coral)] transition-colors font-medium">Home</Link>
            <ChevronRight size={12} />
            <Link href="/products" className="hover:text-[var(--brand-coral)] transition-colors font-medium">Products</Link>
            <ChevronRight size={12} />
            <span className="font-medium" style={{ color: "var(--brand-navy)" }}>{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* ── Main Product Section ── */}
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 mb-16">

          {/* Left: Images */}
          <div>
            <div
              className="rounded-2xl overflow-hidden border relative group"
              style={{
                background: "#F9F6F3",
                borderColor: "#EAE4DD",
                aspectRatio: "1/1",
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Discount badge */}
              <div
                className="absolute top-4 left-4 text-sm font-black px-3 py-1.5 rounded-xl shadow-md text-white"
                style={{ background: "var(--brand-coral)" }}
              >
                {discount}% OFF
              </div>
            </div>

            {/* Thumbnail strip (decorative) */}
            <div className="flex gap-2 mt-3">
              {[product.image, product.image, product.image].map((img, i) => (
                <div
                  key={i}
                  className="w-16 h-16 rounded-xl overflow-hidden border-2 cursor-pointer transition-all"
                  style={{
                    borderColor: i === 0 ? "var(--brand-coral)" : "#EAE4DD",
                    background: "#F9F6F3",
                  }}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div>
            {/* Category badge */}
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold mb-3"
              style={{
                background: "rgba(232,68,42,0.08)",
                color: "var(--brand-coral)",
              }}
            >
              <Package size={11} />
              {details.category}
            </div>

            <h1
              className="text-2xl sm:text-3xl font-black leading-tight mb-4"
              style={{ color: "var(--brand-navy)" }}
            >
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    fill={s <= 4 ? "#F5A623" : "none"}
                    style={{ color: s <= 4 ? "#F5A623" : "#DDD" }}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold" style={{ color: "var(--brand-navy)" }}>4.8</span>
              <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>(248 reviews)</span>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-lg"
                style={{ background: "#DCFCE7", color: "#16A34A" }}
              >
                In Stock
              </span>
            </div>

            {/* Pricing */}
            <div
              className="flex items-baseline gap-3 p-4 rounded-xl mb-6"
              style={{ background: "rgba(232,68,42,0.05)", border: "1px solid rgba(232,68,42,0.1)" }}
            >
              <span
                className="text-3xl font-black"
                style={{ color: "var(--brand-coral)" }}
              >
                ₹{product.price}
              </span>
              <span
                className="text-lg line-through"
                style={{ color: "var(--muted-foreground)" }}
              >
                ₹{originalPrice}
              </span>
              <span
                className="text-sm font-bold px-2.5 py-1 rounded-lg"
                style={{ background: "#DCFCE7", color: "#16A34A" }}
              >
                Save ₹{savings}
              </span>
            </div>

            {/* Description */}
            <p
              className="text-sm leading-relaxed mb-6"
              style={{ color: "var(--muted-foreground)" }}
            >
              {details.description}
            </p>

            {/* Purchase Panel (quantity + buttons) */}
            <ProductPurchasePanel
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
            />

            {/* Delivery & Returns */}
            <div className="mt-6 space-y-2.5">
              {[
                { Icon: Truck, text: "Free delivery on orders above ₹999" },
                { Icon: RotateCcw, text: "Easy 7-day return policy" },
                { Icon: Shield, text: "100% genuine & authentic product" },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5">
                  <Icon size={14} style={{ color: "#16A34A", flexShrink: 0 }} />
                  <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Product Details Tabs ── */}
        <div
          className="rounded-2xl border bg-white mb-14 overflow-hidden"
          style={{ borderColor: "#EAE4DD" }}
        >
          <div className="p-6 border-b" style={{ borderColor: "#EAE4DD" }}>
            <h2 className="text-lg font-black" style={{ color: "var(--brand-navy)" }}>
              Product Details
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x" style={{ "--tw-divide-opacity": 1 } as React.CSSProperties}>
            <div className="p-6">
              <h3 className="text-sm font-bold mb-4" style={{ color: "var(--brand-navy)" }}>Key Features</h3>
              <ul className="space-y-2.5">
                {details.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: "#DCFCE7" }}
                    >
                      <Check size={11} style={{ color: "#16A34A" }} />
                    </div>
                    <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6">
              <h3 className="text-sm font-bold mb-4" style={{ color: "var(--brand-navy)" }}>Specifications</h3>
              <div className="space-y-2">
                {[
                  ["Brand", product.name.split(" ")[0]],
                  ["Category", details.category],
                  ["SKU", `KP-${product.id.toString().padStart(4, "0")}`],
                  ["Availability", "In Stock"],
                  ["Ships In", "1-2 business days"],
                ].map(([key, val]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between py-2 border-b last:border-0 text-sm"
                    style={{ borderColor: "#F5F0EB" }}
                  >
                    <span style={{ color: "var(--muted-foreground)" }}>{key}</span>
                    <span className="font-semibold" style={{ color: "var(--brand-navy)" }}>
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Related Products ── */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="flex items-end justify-between mb-6">
              <h2 className="text-xl font-black section-title-underline" style={{ color: "var(--brand-navy)" }}>
                You Might Also Like
              </h2>
              <Link
                href="/products"
                className="text-sm font-semibold flex items-center gap-1 transition-colors"
                style={{ color: "var(--brand-coral)" }}
              >
                View All <ChevronRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedProducts.map((p, i) => {
                const origP = Math.round(p.price * 2.2);
                const disc = Math.round(((origP - p.price) / origP) * 100);
                return (
                  <Link
                    key={p.id}
                    href={`/products/${p.slug}`}
                    className="group rounded-2xl overflow-hidden border bg-white transition-all hover:-translate-y-1.5 hover:shadow-xl"
                    style={{ borderColor: "#EAE4DD" }}
                  >
                    <div
                      className="overflow-hidden"
                      style={{ aspectRatio: "4/3", background: "#F9F6F3" }}
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3
                        className="font-bold text-sm mb-1.5 group-hover:text-[var(--brand-coral)] transition-colors"
                        style={{ color: "var(--brand-navy)" }}
                      >
                        {p.name}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <span
                          className="font-black"
                          style={{ color: "var(--brand-coral)" }}
                        >
                          ₹{p.price}
                        </span>
                        <span
                          className="text-xs line-through"
                          style={{ color: "var(--muted-foreground)" }}
                        >
                          ₹{origP}
                        </span>
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                          style={{ background: "#DCFCE7", color: "#16A34A" }}
                        >
                          {disc}% off
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}