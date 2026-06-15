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

import Header from "@/components/store/layout/Header";
import Footer from "@/components/store/layout/Footer";
import CartDrawer from "@/components/store/cart/CartDrawer";
import MobileMenu from "@/components/store/layout/MobileMenu";
import WhatsAppFAB from "@/components/store/ui/WhatsAppFAB";
import FloatingCartButton from "@/components/store/ui/FloatingCartButton";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--ag-gray-100)]">
      {/* ── Sticky Header (Zones A, B, and C) ── */}
      <Header />

      {/* ── Main content ── */}
      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>

      {/* ── Footer ── */}
      <Footer />

      {/* ── Viewport-fixed overlays ── */}
      <CartDrawer />
      <MobileMenu />
      <WhatsAppFAB />
      <FloatingCartButton />
    </div>
  );
}
