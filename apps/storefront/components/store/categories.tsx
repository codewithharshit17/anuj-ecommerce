import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Pens & Writing",
    description: "Gel, ball, fountain & more",
    emoji: "🖊️",
    gradient: "linear-gradient(135deg, #E8442A 0%, #FF6B4A 100%)",
    textColor: "#FFFFFF",
    href: "/products",
    count: "200+ products",
  },
  {
    name: "Notebooks",
    description: "Ruled, dotted, grid & more",
    emoji: "📓",
    gradient: "linear-gradient(135deg, #1A2340 0%, #2D3A5F 100%)",
    textColor: "#FFFFFF",
    href: "/products",
    count: "150+ products",
  },
  {
    name: "Art Supplies",
    description: "Paints, brushes, canvases",
    emoji: "🎨",
    gradient: "linear-gradient(135deg, #4A9B8E 0%, #38B2A3 100%)",
    textColor: "#FFFFFF",
    href: "/products",
    count: "180+ products",
  },
  {
    name: "Markers",
    description: "Permanent, whiteboard, fabric",
    emoji: "🖍️",
    gradient: "linear-gradient(135deg, #F5A623 0%, #FFD08A 100%)",
    textColor: "#1A2340",
    href: "/products",
    count: "80+ products",
  },
  {
    name: "Pencils",
    description: "HB, mechanical, sketching",
    emoji: "✏️",
    gradient: "linear-gradient(135deg, #9B59B6 0%, #C39BD3 100%)",
    textColor: "#FFFFFF",
    href: "/products",
    count: "60+ products",
  },
  {
    name: "Office Supplies",
    description: "Staplers, files, organizers",
    emoji: "📎",
    gradient: "linear-gradient(135deg, #2D3A5F 0%, #4A5A7F 100%)",
    textColor: "#FFFFFF",
    href: "/products",
    count: "120+ products",
  },
];

export default function Categories() {
  return (
    <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-3"
            style={{
              background: "rgba(232,68,42,0.08)",
              color: "var(--brand-coral)",
              border: "1px solid rgba(232,68,42,0.15)",
            }}
          >
            ✦ Shop by Category
          </div>
          <h2 className="section-title section-title-underline">
            Explore Our Collections
          </h2>
          <p className="section-subtitle mt-4">
            From everyday essentials to premium creative tools — find everything you need.
          </p>
        </div>

        <Link
          href="/products"
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:gap-2.5"
          style={{ color: "var(--brand-coral)" }}
        >
          View All
          <ArrowRight size={15} />
        </Link>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={cat.href}
            className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            style={{ minHeight: "160px" }}
          >
            {/* Background gradient */}
            <div
              className="absolute inset-0 transition-opacity"
              style={{ background: cat.gradient }}
            />

            {/* Hover overlay */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.2) 100%)",
              }}
            />

            {/* Decorative circle */}
            <div
              className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-20"
              style={{ background: "rgba(255,255,255,0.4)" }}
            />
            <div
              className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-10"
              style={{ background: "rgba(255,255,255,0.4)" }}
            />

            {/* Content */}
            <div className="relative z-10 p-5 flex flex-col h-full justify-between" style={{ minHeight: "160px" }}>
              <div>
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300 inline-block">
                  {cat.emoji}
                </div>
                <h3
                  className="font-bold text-sm leading-tight mb-0.5"
                  style={{ color: cat.textColor }}
                >
                  {cat.name}
                </h3>
                <p
                  className="text-xs leading-relaxed opacity-80"
                  style={{ color: cat.textColor }}
                >
                  {cat.description}
                </p>
              </div>

              <div
                className="text-[10px] font-semibold opacity-70 flex items-center gap-1 mt-3"
                style={{ color: cat.textColor }}
              >
                {cat.count}
                <ArrowRight
                  size={10}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}