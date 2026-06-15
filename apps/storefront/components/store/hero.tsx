import Link from "next/link";
import { ArrowRight, Star, Truck, Shield, Zap } from "lucide-react";

const trustBadges = [
  { icon: Truck, label: "Free Shipping ₹999+" },
  { icon: Shield, label: "100% Genuine" },
  { icon: Zap, label: "Fast Delivery" },
];

const floatingItems = [
  { emoji: "✏️", label: "Premium Pencils", top: "12%", left: "5%", delay: "0s" },
  { emoji: "📓", label: "Notebooks", top: "65%", left: "3%", delay: "0.8s" },
  { emoji: "🎨", label: "Art Supplies", top: "20%", right: "5%", delay: "0.4s" },
  { emoji: "🖊️", label: "Pens", top: "70%", right: "4%", delay: "1.2s" },
];

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0F1829 0%, #1A2340 40%, #1E2D54 100%)",
        minHeight: "580px",
      }}
    >
      {/* Background decorative circles */}
      <div
        className="absolute top-[-120px] right-[-120px] w-[500px] h-[500px] rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #E8442A, transparent)" }}
      />
      <div
        className="absolute bottom-[-80px] left-[-80px] w-[350px] h-[350px] rounded-full opacity-8"
        style={{ background: "radial-gradient(circle, #F5A623, transparent)" }}
      />
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating items (decorative) */}
      {floatingItems.map((item, i) => (
        <div
          key={i}
          className="absolute hidden lg:flex flex-col items-center gap-1 animate-float"
          style={{
            top: item.top,
            left: (item as any).left,
            right: (item as any).right,
            animationDelay: item.delay,
            animationDuration: "4s",
          }}
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg backdrop-blur-sm border"
            style={{
              background: "rgba(255,255,255,0.08)",
              borderColor: "rgba(255,255,255,0.12)",
            }}
          >
            {item.emoji}
          </div>
          <span className="text-[10px] font-medium opacity-50" style={{ color: "#F5F0EB" }}>
            {item.label}
          </span>
        </div>
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* ── Left: Content ── */}
          <div className="relative z-10 animate-fadeInLeft">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-6">
              <div
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase border"
                style={{
                  background: "rgba(245,166,35,0.15)",
                  borderColor: "rgba(245,166,35,0.3)",
                  color: "#F5A623",
                }}
              >
                <Star size={10} fill="currentColor" />
                India's Premium Stationery Store
              </div>
            </div>

            {/* Headline */}
            <h1
              className="text-4xl sm:text-5xl md:text-[3.25rem] font-black leading-[1.1] tracking-tight mb-5"
              style={{ color: "white" }}
            >
              Everything You Need
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #E8442A, #F5A623)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                For School, Office
              </span>
              <br />
              & Creative Work
            </h1>

            {/* Subtext */}
            <p
              className="text-base sm:text-lg leading-relaxed mb-8 max-w-lg"
              style={{ color: "rgba(245,240,235,0.75)" }}
            >
              Discover premium pens, notebooks, art supplies, and stationery
              essentials — curated for students, professionals, and creators.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 mb-10">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0"
                style={{
                  background: "linear-gradient(135deg, #E8442A, #C7321A)",
                  boxShadow: "0 4px 20px rgba(232,68,42,0.4)",
                }}
              >
                Shop Now
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 border-2 hover:-translate-y-0.5"
                style={{
                  color: "white",
                  borderColor: "rgba(255,255,255,0.25)",
                  background: "rgba(255,255,255,0.06)",
                  backdropFilter: "blur(8px)",
                }}
              >
                Explore Categories
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4">
              {trustBadges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={badge.label}
                    className="flex items-center gap-1.5 text-xs font-medium"
                    style={{ color: "rgba(245,240,235,0.65)" }}
                  >
                    <Icon size={13} style={{ color: "#F5A623" }} />
                    {badge.label}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Right: Visual ── */}
          <div className="relative z-10 hidden md:flex justify-center items-center animate-fadeInRight">
            <div className="relative">
              {/* Main product showcase card */}
              <div
                className="relative rounded-3xl overflow-hidden shadow-2xl"
                style={{
                  width: "380px",
                  height: "420px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=760&q=80"
                  alt="Premium stationery collection"
                  className="w-full h-full object-cover opacity-80"
                  style={{ mixBlendMode: "luminosity" }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 40%, rgba(15,24,41,0.8) 100%)",
                  }}
                />
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-white text-base font-bold">New Arrival</p>
                  <p className="text-sm" style={{ color: "rgba(245,240,235,0.75)" }}>
                    Reynolds Trimax — Starting ₹45
                  </p>
                </div>
              </div>

              {/* Floating stat cards */}
              <div
                className="absolute -top-4 -left-6 px-4 py-3 rounded-2xl shadow-xl animate-float"
                style={{
                  background: "white",
                  animationDelay: "0.5s",
                  animationDuration: "3.5s",
                }}
              >
                <div className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
                  Happy Customers
                </div>
                <div
                  className="text-xl font-black"
                  style={{ color: "var(--brand-navy)" }}
                >
                  50,000+
                </div>
              </div>

              <div
                className="absolute -bottom-4 -right-6 px-4 py-3 rounded-2xl shadow-xl animate-float"
                style={{
                  background: "white",
                  animationDelay: "1s",
                  animationDuration: "4s",
                }}
              >
                <div className="flex items-center gap-1 mb-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={12}
                      fill="#F5A623"
                      style={{ color: "#F5A623" }}
                    />
                  ))}
                </div>
                <div className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
                  4.9 / 5 Rating
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full"
          style={{ height: "40px" }}
        >
          <path
            d="M0 40 C360 0 1080 0 1440 40 L1440 40 L0 40Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}