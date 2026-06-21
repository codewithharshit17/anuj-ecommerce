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
import { mergeCartAction } from "@/lib/actions/cart";
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
      if (isAuthenticated) {
        try {
          const guestCartItems = useCartStore.getState().items;
          const mergedCartItems = await mergeCartAction(guestCartItems);
          useCartStore.getState().setCartItems(mergedCartItems);
        } catch (err) {
          console.error("[AuthProvider] Data sync failed:", err);
        }
      } else {
        // Reset state on logout
        useCartStore.getState().setCartItems([]);
      }
    };

    syncUserData();
  }, [isAuthenticated, loading]);

  return <>{children}</>;
}
