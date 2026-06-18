/**
 * AuthProvider.tsx
 *
 * Top-level client component that initializes the Zustand auth store
 * on mount. Place this in the root layout (or store layout) to ensure
 * the auth state is hydrated as early as possible.
 *
 * Updates to automatically sync and merge guest wishlists and carts to the DB.
 */
"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { useUIStore } from "@/components/store/ui-store";
import { useCartStore } from "@/lib/store/cart-store";
import { mergeWishlistAction } from "@/lib/actions/wishlist";
import { mergeCartAction } from "@/lib/actions/cart";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialize = useAuthStore((s) => s.initialize);
  const { isAuthenticated, loading } = useAuthStore();

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    initialize().then((unsubscribe) => {
      cleanup = unsubscribe;
    });

    return () => {
      cleanup?.();
    };
  }, [initialize]);

  // Synchronize Wishlist and Cart database state on auth changes
  useEffect(() => {
    if (loading) return;

    const syncUserData = async () => {
      if (isAuthenticated) {
        try {
          // 1. Wishlist Sync
          const guestWishlistItems = useUIStore.getState().wishlist;
          const mergedWishlistIds = await mergeWishlistAction(guestWishlistItems);
          useUIStore.getState().setWishlist(mergedWishlistIds);

          // 2. Cart Sync
          const guestCartItems = useCartStore.getState().items;
          const mergedCartItems = await mergeCartAction(guestCartItems);
          useCartStore.getState().setCartItems(mergedCartItems);
        } catch (err) {
          console.error("[AuthProvider] Data sync failed:", err);
        }
      } else {
        // Reset state on logout
        useUIStore.getState().setWishlist([]);
        useCartStore.getState().setCartItems([]);
      }
    };

    syncUserData();
  }, [isAuthenticated, loading]);

  return <>{children}</>;
}
