"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const navItems = [
  { label: "Home", href: "/" },
  {
    label: "Stationery",
    href: "/products",
    children: [
      { label: "Gel Pens", href: "/products" },
      { label: "Ball Pens", href: "/products" },
      { label: "Fountain Pens", href: "/products" },
      { label: "Rollerball Pens", href: "/products" },
      { label: "Ink & Cartridges", href: "/products" },
    ],
  },
  {
    label: "Notebooks",
    href: "/products",
    children: [
      { label: "Ruled Notebooks", href: "/products" },
      { label: "Dotted Notebooks", href: "/products" },
      { label: "Grid Notebooks", href: "/products" },
      { label: "Spiral Notebooks", href: "/products" },
      { label: "Pocket Notebooks", href: "/products" },
    ],
  },
  {
    label: "Art Supplies",
    href: "/products",
    children: [
      { label: "Watercolours", href: "/products" },
      { label: "Acrylic Paints", href: "/products" },
      { label: "Sketch Pencils", href: "/products" },
      { label: "Crayons & Pastels", href: "/products" },
      { label: "Brushes", href: "/products" },
    ],
  },
  { label: "Markers", href: "/products" },
  { label: "Pencils", href: "/products" },
  {
    label: "Deals",
    href: "/products",
    isHighlighted: true,
  },
];

export default function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <nav
      className="hidden md:block border-b z-40"
      style={{ background: "white", borderColor: "#EAE4DD" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ul className="flex items-center gap-0">
          {navItems.map((item) => (
            <li
              key={item.label}
              className="relative"
              onMouseEnter={() => item.children && setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={item.href}
                className={`flex items-center gap-1 px-3.5 py-3.5 text-sm font-semibold transition-all duration-150 relative group ${
                  item.isHighlighted ? "" : ""
                }`}
                style={{
                  color: item.isHighlighted
                    ? "var(--brand-coral)"
                    : "var(--brand-navy)",
                  letterSpacing: "-0.01em",
                }}
              >
                {item.label}
                {item.children && (
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${
                      activeDropdown === item.label ? "rotate-180" : ""
                    }`}
                    style={{ opacity: 0.6 }}
                  />
                )}
                {/* Active/hover underline */}
                <span
                  className="absolute bottom-0 left-3.5 right-3.5 h-0.5 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
                  style={{
                    background: item.isHighlighted
                      ? "var(--brand-coral)"
                      : "var(--brand-coral)",
                  }}
                />
              </Link>

              {/* Dropdown */}
              {item.children && activeDropdown === item.label && (
                <div
                  className="absolute top-full left-0 pt-1 z-50 animate-scaleIn"
                  style={{ minWidth: "200px" }}
                >
                  <div
                    className="rounded-xl border shadow-xl overflow-hidden"
                    style={{
                      background: "white",
                      borderColor: "#EAE4DD",
                      boxShadow: "0 12px 40px rgba(26,35,64,0.14)",
                    }}
                  >
                    {/* Dropdown header accent */}
                    <div
                      className="h-1"
                      style={{
                        background:
                          "linear-gradient(90deg, var(--brand-coral), var(--brand-gold))",
                      }}
                    />
                    <ul className="py-2">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <Link
                            href={child.href}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-orange-50 group"
                            style={{ color: "var(--brand-navy)" }}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors"
                              style={{
                                background: "var(--brand-coral)",
                                opacity: 0.4,
                              }}
                            />
                            <span className="group-hover:text-[var(--brand-coral)] transition-colors">
                              {child.label}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="px-4 pb-3 pt-1 border-t" style={{ borderColor: "#F5F0EB" }}>
                      <Link
                        href={item.href}
                        className="text-xs font-semibold transition-colors"
                        style={{ color: "var(--brand-coral)" }}
                      >
                        View all {item.label} →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}