import { Star, Zap, Headphones, Award, RefreshCcw } from "lucide-react";

const stats = [
  { value: "50K+", label: "Happy Customers" },
  { value: "1200+", label: "Products Listed" },
  { value: "4.9★", label: "Average Rating" },
  { value: "2-Day", label: "Delivery Time" },
];

const features = [
  {
    icon: Award,
    title: "100% Genuine Products",
    desc: "Every item is sourced directly from authorized distributors. No counterfeits, ever.",
    color: "#E8442A",
    bg: "rgba(232,68,42,0.08)",
  },
  {
    icon: Zap,
    title: "Lightning Fast Delivery",
    desc: "Order before 2 PM and get same-day dispatch. Delivered within 2 business days.",
    color: "#F5A623",
    bg: "rgba(245,166,35,0.08)",
  },
  {
    icon: RefreshCcw,
    title: "Easy 7-Day Returns",
    desc: "Not satisfied? Return it within 7 days for a full refund — no questions asked.",
    color: "#4A9B8E",
    bg: "rgba(74,155,142,0.08)",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    desc: "Our stationery experts are here to help you find exactly what you need.",
    color: "#9B59B6",
    bg: "rgba(155,89,182,0.08)",
  },
];

export default function WhyUs() {
  return (
    <section className="py-16 px-4 sm:px-6 relative overflow-hidden" style={{ background: "white" }}>
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #1A2340 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Stats bar */}
        <div
          className="rounded-2xl p-6 mb-14 grid grid-cols-2 md:grid-cols-4 gap-6"
          style={{
            background: "linear-gradient(135deg, #1A2340 0%, #2D3A5F 100%)",
            boxShadow: "0 20px 60px rgba(26,35,64,0.2)",
          }}
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center py-2 ${
                i < stats.length - 1 ? "border-r border-white/10" : ""
              }`}
            >
              <div
                className="text-2xl sm:text-3xl font-black mb-1"
                style={{
                  background: "linear-gradient(135deg, #E8442A, #F5A623)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {stat.value}
              </div>
              <div className="text-xs font-medium" style={{ color: "rgba(245,240,235,0.55)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Section header */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-3"
            style={{
              background: "rgba(232,68,42,0.08)",
              color: "var(--brand-coral)",
              border: "1px solid rgba(232,68,42,0.15)",
            }}
          >
            <Star size={11} fill="currentColor" />
            Why Customers Love Us
          </div>
          <h2 className="section-title" style={{ color: "var(--brand-navy)" }}>
            The KAPI PEN Difference
          </h2>
          <p className="section-subtitle mt-3 max-w-xl mx-auto">
            We're not just another stationery shop. We're your partner in creativity and productivity.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="group rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-default"
                style={{
                  borderColor: "#EAE4DD",
                  background: "white",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = feat.color + "40";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "#EAE4DD";
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: feat.bg }}
                >
                  <Icon size={22} style={{ color: feat.color }} />
                </div>
                <h3
                  className="font-bold text-base mb-2"
                  style={{ color: "var(--brand-navy)" }}
                >
                  {feat.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
