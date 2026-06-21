/**
 * AuthProvider.tsx
 *
 * Top-level client component that initializes the Zustand auth store
 * on mount. Place this in the root layout (or store layout) to ensure
 * the auth state is hydrated as early as possible.
 *
 * Updates to automatically sync and merge guest carts to the DB.
 */
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { useCartStore } from "@/lib/store/cart-store";
import { mergeCartAction, fetchDbCart } from "@/lib/actions/cart";
import { createClient } from "@/lib/supabase/client";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialize = useAuthStore((s) => s.initialize);
  const { isAuthenticated, loading } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    initialize().then((unsubscribe) => {
      cleanup = unsubscribe;
    });

    return () => {
      cleanup?.();
    };
  }, [initialize]);

  // Synchronize auth state and refresh router cache on navigation changes (e.g., Server Action redirect)
  useEffect(() => {
    const syncSession = async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const currentStoreUser = useAuthStore.getState().user;

      if (session?.user?.id !== currentStoreUser?.id) {
        useAuthStore.setState({
          user: session?.user ?? null,
          isAuthenticated: !!session?.user,
          loading: false,
        });
        router.refresh();
      }
    };

    syncSession();
  }, [pathname, router]);

  // Synchronize cart database state on auth changes
  useEffect(() => {
    if (loading) return;

    const syncUserData = async () => {
      const cartStore = useCartStore.getState();
      if (isAuthenticated) {
        try {
          const guestCartItems = cartStore.items;
          const currentUserId = useAuthStore.getState().user?.id;

          if (cartStore.userId !== currentUserId) {
            let finalItems;
            if (cartStore.userId === null) {
              finalItems = await mergeCartAction(guestCartItems);
            } else {
              finalItems = await fetchDbCart();
            }
            cartStore.setCartItems(finalItems);
            cartStore.setUserId(currentUserId || null);
          } else {
            // Just refresh from DB to make sure we are in sync
            const dbItems = await fetchDbCart();
            cartStore.setCartItems(dbItems);
          }
        } catch (err) {
          console.error("[AuthProvider] Data sync failed:", err);
        }
      } else {
        // Reset state on logout
        // Only clear if the cart currently belongs to a logged-in user
        if (cartStore.userId !== null) {
          cartStore.setCartItems([]);
          cartStore.setUserId(null);
        }
      }
    };

    syncUserData();
  }, [isAuthenticated, loading]);

  return <>{children}</>;
}
