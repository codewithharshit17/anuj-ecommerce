/**
 * ReviewsTab — Fixed right-edge vertical pill (scooboo.in spec)
 *
 * Position: fixed right-0 top-1/2 -translate-y-1/2 z-40
 * Black pill, white vertical text "★ Reviews"
 * Clicking links to /pages/reviews
 */

import Link from "next/link";

export default function ReviewsTab() {
  return (
    <Link
      href="/pages/reviews"
      aria-label="Read customer reviews"
      className={[
        // Position
        "fixed right-0 top-1/2 -translate-y-1/2 z-40",
        // Shape & color
        "bg-black text-white",
        "rounded-l-lg",
        // Sizing
        "px-2 py-4",
        // Interaction
        "hover:bg-[#1A1A1A] transition-colors duration-200",
        // Shadow
        "shadow-lg",
      ].join(" ")}
    >
      <span
        className="writing-mode-vertical text-xs font-semibold tracking-widest whitespace-nowrap select-none"
        aria-hidden="true"
      >
        ★ Reviews
      </span>
    </Link>
  );
}
