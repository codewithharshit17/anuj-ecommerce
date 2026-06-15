"use client";

/**
 * MobileBottomNav — Fixed bottom bar, mobile only (scooboo.in spec)
 *
 * Position: fixed bottom-0 left-0 right-0 z-50, hidden md:hidden
 * Background: #FFFFFF, top border 1px solid #E8EAED
 * Three icons: Home, Search, Cart (with count badge)
 *
 * NOTE: Gives padding-bottom to the page on mobile to prevent layout
 *       overlap — add `pb-14 md:pb-0` to the main page wrapper.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";

const NAV_ITEMS = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Search",
    href: "/search",
    icon: Search,
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const items = useCartStore((state) => state.items);
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      className={[
        // Position & visibility
        "fixed bottom-0 left-0 right-0 z-50",
        "md:hidden", // desktop hidden
        // Appearance
        "bg-white border-t border-[#E8EAED]",
        // Safe area for iPhones
        "pb-safe",
      ].join(" ")}
      aria-label="Mobile navigation"
    >
      <div className="flex items-stretch h-14">
        {/* Home & Search */}
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={[
                "flex-1 flex flex-col items-center justify-center gap-0.5",
                "text-[10px] font-medium transition-colors duration-150",
                active
                  ? "text-[#E53C3C]"
                  : "text-[#666666] hover:text-[#E53C3C]",
              ].join(" ")}
            >
              <Icon
                className={[
                  "w-5 h-5 transition-colors duration-150",
                  active ? "text-[#E53C3C]" : "text-[#666666]",
                ].join(" ")}
                strokeWidth={active ? 2.5 : 2}
              />
              <span>{label}</span>
            </Link>
          );
        })}

        {/* Cart — with count badge */}
        <Link
          href="/cart"
          aria-label={`Cart — ${cartCount} items`}
          aria-current={isActive("/cart") ? "page" : undefined}
          className={[
            "flex-1 flex flex-col items-center justify-center gap-0.5",
            "text-[10px] font-medium transition-colors duration-150",
            isActive("/cart")
              ? "text-[#E53C3C]"
              : "text-[#666666] hover:text-[#E53C3C]",
          ].join(" ")}
        >
          <span className="relative">
            <ShoppingCart
              className={[
                "w-5 h-5 transition-colors duration-150",
                isActive("/cart") ? "text-[#E53C3C]" : "text-[#666666]",
              ].join(" ")}
              strokeWidth={isActive("/cart") ? 2.5 : 2}
            />
            {cartCount > 0 && (
              <span
                aria-hidden="true"
                className={[
                  "absolute -top-1.5 -right-1.5",
                  "w-4 h-4 rounded-full",
                  "bg-[#E53C3C] text-white",
                  "text-[9px] font-bold",
                  "flex items-center justify-center",
                ].join(" ")}
              >
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </span>
          <span>Cart</span>
        </Link>
      </div>
    </nav>
  );
}
