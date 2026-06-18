/**
 * AuthProvider.tsx
 *
 * Top-level client component that initializes the Zustand auth store
 * on mount. Place this in the root layout (or store layout) to ensure
 * the auth state is hydrated as early as possible.
 *
 * This component renders nothing visible — it only manages the auth
 * subscription lifecycle.
 */
"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/auth-store";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    initialize().then((unsubscribe) => {
      cleanup = unsubscribe;
    });

    return () => {
      cleanup?.();
    };
  }, [initialize]);

  return <>{children}</>;
}
