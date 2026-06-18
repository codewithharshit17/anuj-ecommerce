/**
 * auth-store.ts
 *
 * Client-side auth state management with Zustand.
 *
 * This store mirrors the Supabase Auth session state on the client.
 * It is NOT persisted to localStorage — the source of truth is always
 * the Supabase session (stored in HTTP-only cookies by the SSR middleware).
 *
 * Usage:
 * ```tsx
 * "use client";
 * import { useAuthStore } from "@/lib/store/auth-store";
 *
 * function MyComponent() {
 *   const { user, isAuthenticated, loading } = useAuthStore();
 *   // ...
 * }
 * ```
 *
 * Call `useAuthStore.getState().initialize()` once at app mount
 * (e.g. in a top-level AuthProvider component) to hydrate the store
 * from the current Supabase session and subscribe to auth changes.
 */

import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

// ── Types ────────────────────────────────────────────────────────────

interface AuthState {
  /** The authenticated Supabase user, or `null` */
  user: User | null;

  /** `true` while the initial session check is in progress */
  loading: boolean;

  /** Derived: `true` when `user` is not `null` */
  isAuthenticated: boolean;
}

interface AuthActions {
  /** Set the user and update `isAuthenticated` */
  setUser: (user: User | null) => void;

  /** Clear the user (logout) */
  clearUser: () => void;

  /** Set the loading state */
  setLoading: (loading: boolean) => void;

  /**
   * Hydrate the store from the current Supabase session and
   * subscribe to future auth state changes. Call once at app mount.
   *
   * Returns a cleanup function to unsubscribe.
   */
  initialize: () => Promise<() => void>;
}

// ── Store ────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState & AuthActions>()((set) => ({
  // State
  user: null,
  loading: true,
  isAuthenticated: false,

  // Actions
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      loading: false,
    }),

  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
      loading: false,
    }),

  setLoading: (loading) => set({ loading }),

  initialize: async () => {
    const supabase = createClient();

    // 1. Check existing session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    set({
      user: session?.user ?? null,
      isAuthenticated: !!session?.user,
      loading: false,
    });

    // 2. Subscribe to auth state changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      set({
        user: session?.user ?? null,
        isAuthenticated: !!session?.user,
        loading: false,
      });
    });

    // Return cleanup
    return () => subscription.unsubscribe();
  },
}));
