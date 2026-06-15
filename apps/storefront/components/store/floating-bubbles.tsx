"use client";

/**
 * FloatingBubbles — Fixed bottom-right viewport elements (scooboo.in spec)
 *
 * A. Cart bubble (bottom-right, always visible):
 *    - Red circle w-14 h-14 bg-brand-primary (#E53C3C), shopping bag icon
 *    - Shows cart count badge when items > 0
 *
 * B. WhatsApp bubble (stacks above cart, mobile only):
 *    - WhatsApp green (#25D366), opens WhatsApp chat
 *    - Hidden on md+ screens (desktop doesn't show it per scooboo.in)
 */

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";

const WHATSAPP_NUMBER = "918288880584"; // +91 82888-80584 (scooboo.in business number)
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hi! I'd like to enquire about your products."
);

function CartBubble({ cartCount }: { cartCount: number }) {
  return (
    <Link
      href="/cart"
      aria-label={`Cart — ${cartCount} item${cartCount !== 1 ? "s" : ""}`}
      className={[
        // Size & shape
        "w-14 h-14 rounded-full",
        // Color — brand-primary per spec
        "bg-[#E53C3C]",
        // Layout
        "flex items-center justify-center",
        // Elevation
        "shadow-lg",
        // Interaction
        "hover:bg-[#c0392b] active:scale-95",
        "transition-all duration-200",
        // Relative for badge positioning
        "relative",
      ].join(" ")}
    >
      <ShoppingBag className="w-6 h-6 text-white" strokeWidth={2} />

      {/* Badge */}
      {cartCount > 0 && (
        <span
          aria-hidden="true"
          className={[
            "absolute -top-1 -right-1",
            "w-5 h-5 rounded-full",
            "bg-[#FFB800] text-[#1A1A1A]",
            "text-[10px] font-bold",
            "flex items-center justify-center",
            "shadow-sm border border-white",
          ].join(" ")}
        >
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}
    </Link>
  );
}

function WhatsAppBubble() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={[
        // Mobile only (stacks above cart bubble)
        "md:hidden",
        // Size & shape
        "w-14 h-14 rounded-full",
        // WhatsApp green
        "bg-[#25D366]",
        // Layout
        "flex items-center justify-center",
        // Elevation
        "shadow-lg",
        // Interaction
        "hover:bg-[#1ebe57] active:scale-95",
        "transition-all duration-200",
      ].join(" ")}
    >
      {/* WhatsApp SVG icon */}
      <svg
        viewBox="0 0 24 24"
        fill="white"
        className="w-7 h-7"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
  );
}

export default function FloatingBubbles() {
  const items = useCartStore((state) => state.items);
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3"
      aria-label="Quick actions"
    >
      {/* WhatsApp — mobile only, stacks above cart */}
      <WhatsAppBubble />

      {/* Cart bubble — always visible */}
      <CartBubble cartCount={cartCount} />
    </div>
  );
}
