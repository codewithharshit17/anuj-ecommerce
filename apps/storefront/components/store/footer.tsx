import Link from "next/link";
import {
  Instagram,
  Facebook,
  Twitter,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Shield,
  Truck,
  RotateCcw,
  CreditCard,
} from "lucide-react";

const trustFeatures = [
  { icon: Truck, title: "Free Shipping", desc: "On orders above ₹999" },
  { icon: Shield, title: "100% Genuine", desc: "Authentic products only" },
  { icon: RotateCcw, title: "Easy Returns", desc: "Hassle-free 7-day returns" },
  { icon: CreditCard, title: "Secure Payment", desc: "256-bit SSL encryption" },
];

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "All Products", href: "/products" },
  { label: "New Arrivals", href: "/products" },
  { label: "Best Sellers", href: "/products" },
  { label: "Deals & Offers", href: "/products" },
  { label: "Gift Cards", href: "/" },
];

const categories = [
  { label: "Pens & Writing", href: "/products" },
  { label: "Notebooks", href: "/products" },
  { label: "Art Supplies", href: "/products" },
  { label: "Markers", href: "/products" },
  { label: "Pencils", href: "/products" },
  { label: "Office Supplies", href: "/products" },
];

const support = [
  { label: "Contact Us", href: "/" },
  { label: "FAQs", href: "/" },
  { label: "Shipping Policy", href: "/" },
  { label: "Return Policy", href: "/" },
  { label: "Privacy Policy", href: "/" },
  { label: "Terms of Service", href: "/" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#0F1829" }}>
      {/* Trust Features Strip */}
      <div
        className="border-b"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <div key={feat.title} className="flex items-center gap-3.5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(232,68,42,0.15)",
                    }}
                  >
                    <Icon size={18} style={{ color: "#E8442A" }} />
                  </div>
                  <div>
                    <div
                      className="text-sm font-bold leading-tight"
                      style={{ color: "white" }}
                    >
                      {feat.title}
                    </div>
                    <div
                      className="text-xs mt-0.5"
                      style={{ color: "rgba(245,240,235,0.5)" }}
                    >
                      {feat.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-md"
                style={{ background: "linear-gradient(135deg, #E8442A, #F5A623)" }}
              >
                K
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight">
                  KAPI <span style={{ color: "#E8442A" }}>PEN</span>
                </span>
                <p
                  className="text-[10px] tracking-widest uppercase"
                  style={{ color: "rgba(245,240,235,0.4)" }}
                >
                  Premium Stationery
                </p>
              </div>
            </div>

            <p
              className="text-sm leading-relaxed mb-6"
              style={{ color: "rgba(245,240,235,0.55)" }}
            >
              India's finest destination for premium stationery, art supplies, and
              creative tools. Trusted by 50,000+ students, artists, and professionals.
            </p>

            {/* Contact Info */}
            <div className="space-y-2.5 mb-6">
              {[
                { Icon: Mail, text: "hello@kapipens.in" },
                { Icon: Phone, text: "+91 98765 43210" },
                { Icon: MapPin, text: "Mumbai, Maharashtra, India" },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5">
                  <Icon
                    size={13}
                    style={{ color: "rgba(245,166,35,0.8)", flexShrink: 0 }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: "rgba(245,240,235,0.5)" }}
                  >
                    {text}
                  </span>
                </div>
              ))}
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5">
              {[
                { Icon: Instagram, href: "#", label: "Instagram" },
                { Icon: Facebook, href: "#", label: "Facebook" },
                { Icon: Twitter, href: "#", label: "Twitter" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(245,240,235,0.6)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      "rgba(232,68,42,0.3)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      "rgba(255,255,255,0.08)";
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "rgba(245,240,235,0.6)";
                  }}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-sm font-bold uppercase tracking-widest mb-5"
              style={{ color: "rgba(245,240,235,0.35)", letterSpacing: "0.1em" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-1.5 text-sm transition-all group"
                    style={{ color: "rgba(245,240,235,0.55)" }}
                  >
                    <ChevronRight
                      size={13}
                      className="opacity-0 -ml-3.5 group-hover:opacity-100 group-hover:ml-0 transition-all"
                      style={{ color: "#E8442A" }}
                    />
                    <span className="group-hover:text-white transition-colors">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4
              className="text-sm font-bold uppercase tracking-widest mb-5"
              style={{ color: "rgba(245,240,235,0.35)", letterSpacing: "0.1em" }}
            >
              Categories
            </h4>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat.label}>
                  <Link
                    href={cat.href}
                    className="flex items-center gap-1.5 text-sm transition-all group"
                    style={{ color: "rgba(245,240,235,0.55)" }}
                  >
                    <ChevronRight
                      size={13}
                      className="opacity-0 -ml-3.5 group-hover:opacity-100 group-hover:ml-0 transition-all"
                      style={{ color: "#E8442A" }}
                    />
                    <span className="group-hover:text-white transition-colors">
                      {cat.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter + Support */}
          <div>
            <h4
              className="text-sm font-bold uppercase tracking-widest mb-5"
              style={{ color: "rgba(245,240,235,0.35)", letterSpacing: "0.1em" }}
            >
              Stay Updated
            </h4>
            <p
              className="text-sm mb-4"
              style={{ color: "rgba(245,240,235,0.55)" }}
            >
              Get exclusive deals, new arrivals, and stationery inspiration.
            </p>

            {/* Newsletter Input */}
            <div className="flex gap-2 mb-8">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl text-sm outline-none border transition-all focus:border-[#E8442A]"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  borderColor: "rgba(255,255,255,0.12)",
                  color: "white",
                }}
              />
              <button
                className="px-3.5 py-2.5 rounded-xl text-sm font-bold text-white flex-shrink-0 transition-all hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, #E8442A, #C7321A)",
                  boxShadow: "0 4px 14px rgba(232,68,42,0.35)",
                }}
              >
                <Mail size={15} />
              </button>
            </div>

            <h4
              className="text-sm font-bold uppercase tracking-widest mb-4"
              style={{ color: "rgba(245,240,235,0.35)", letterSpacing: "0.1em" }}
            >
              Support
            </h4>
            <ul className="space-y-2">
              {support.slice(0, 4).map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "rgba(245,240,235,0.5)" }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className="border-t"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p
              className="text-xs"
              style={{ color: "rgba(245,240,235,0.35)" }}
            >
              © {new Date().getFullYear()} KAPI PEN. All rights reserved. Made
              with ❤️ in India.
            </p>
            <div className="flex items-center gap-2">
              {["Visa", "Mastercard", "UPI", "Paytm", "RazorPay"].map((pay) => (
                <div
                  key={pay}
                  className="px-2.5 py-1 rounded-md text-[9px] font-bold tracking-wide"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    color: "rgba(245,240,235,0.4)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {pay}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}