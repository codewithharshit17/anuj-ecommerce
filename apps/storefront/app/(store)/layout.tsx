/**
 * (store) Layout — wraps all storefront pages
 *
 * Integrates all Section 2 global chrome elements:
 * - AnnouncementBar (Zone A — top black bar)
 * - Header (Zone B — sticky main header with logo, search, icons)
 * - Navbar (Zone C — navigation menu rows)
 * - ReviewsTab (fixed right-edge vertical pill)
 * - FloatingBubbles (fixed bottom-right Cart + WhatsApp)
 * - MobileBottomNav (fixed bottom bar, mobile only)
 *
 * Bottom padding on mobile ensures content is not obscured by the
 * fixed MobileBottomNav bar (h-14 = 3.5rem = 56px).
 */

import AnnouncementBar from "@/components/store/announcement-bar";
import Header from "@/components/store/header";
import Navbar from "@/components/store/navbar";
import Footer from "@/components/store/footer";
import ReviewsTab from "@/components/store/reviews-tab";
import FloatingBubbles from "@/components/store/floating-bubbles";
import MobileBottomNav from "@/components/store/mobile-bottom-nav";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Zone A: Announcement bar (collapses on scroll via Header logic) ── */}
      <AnnouncementBar />

      {/* ── Zone B + C: Sticky header + navigation ── */}
      <Header />
      <Navbar />

      {/* ── Main content ── */}
      {/* pb-14 md:pb-0 prevents MobileBottomNav overlap on small screens */}
      <main className="flex-1 pb-14 md:pb-0">
        {children}
      </main>

      {/* ── Footer ── */}
      <Footer />

      {/* ── Viewport-fixed persistent elements ── */}
      {/* Reviews tab — right edge vertical pill */}
      <ReviewsTab />

      {/* Cart + WhatsApp floating bubbles — bottom right */}
      <FloatingBubbles />

      {/* Mobile bottom navigation bar */}
      <MobileBottomNav />
    </div>
  );
}
