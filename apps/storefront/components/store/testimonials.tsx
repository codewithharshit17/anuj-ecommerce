import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Design Student",
    avatar: "PS",
    text: "KAPI PEN has the best selection of art supplies I've found online. Fast shipping and everything arrived perfectly packed!",
    rating: 5,
    color: "#E8442A",
  },
  {
    name: "Arjun Mehta",
    role: "Software Engineer",
    avatar: "AM",
    text: "I've been ordering my notebooks and pens from here for over a year. The quality is always consistent and prices are fair.",
    rating: 5,
    color: "#4A9B8E",
  },
  {
    name: "Sneha Rao",
    role: "School Teacher",
    avatar: "SR",
    text: "Love how easy it is to find classroom supplies here. The bulk ordering options are a lifesaver for teachers!",
    rating: 5,
    color: "#F5A623",
  },
];

export default function Testimonials() {
  return (
    <section
      className="py-16 px-4 sm:px-6"
      style={{ background: "linear-gradient(180deg, var(--brand-cream) 0%, white 100%)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-3"
            style={{
              background: "rgba(245,166,35,0.1)",
              color: "#C88F00",
              border: "1px solid rgba(245,166,35,0.2)",
            }}
          >
            <Star size={11} fill="currentColor" />
            Loved by Thousands
          </div>
          <h2 className="section-title" style={{ color: "var(--brand-navy)" }}>
            What Our Customers Say
          </h2>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl group"
              style={{ borderColor: "#EAE4DD" }}
            >
              {/* Quote icon */}
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center mb-5"
                style={{ background: t.color + "15" }}
              >
                <Quote size={14} style={{ color: t.color }} />
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={13}
                    fill={s <= t.rating ? "#F5A623" : "none"}
                    style={{ color: s <= t.rating ? "#F5A623" : "#DDD" }}
                  />
                ))}
              </div>

              {/* Text */}
              <p
                className="text-sm leading-relaxed mb-5 italic"
                style={{ color: "var(--muted-foreground)" }}
              >
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: t.color }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div
                    className="text-sm font-bold"
                    style={{ color: "var(--brand-navy)" }}
                  >
                    {t.name}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {t.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Overall rating */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 py-5 rounded-2xl" style={{ background: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.15)" }}>
          <div className="text-5xl font-black" style={{ color: "var(--brand-navy)" }}>4.9</div>
          <div>
            <div className="flex gap-0.5 mb-1">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={18} fill="#F5A623" style={{ color: "#F5A623" }} />
              ))}
            </div>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              Based on <span className="font-semibold" style={{ color: "var(--brand-navy)" }}>2,400+ verified reviews</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
