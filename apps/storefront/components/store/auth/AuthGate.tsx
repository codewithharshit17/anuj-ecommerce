/**
 * AuthGate.tsx
 *
 * Client-side auth guard component. Wrap any component tree that
 * requires authentication — if the user is not signed in, they are
 * redirected to the login page.
 *
 * Uses the Zustand auth store (backed by Supabase session cookies).
 *
 * For server-side protection, use `requireAuth()` from `@/lib/auth`
 * instead — it's faster and more secure.
 */
"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/auth-store";

interface AuthGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AuthGate({ children, fallback }: AuthGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading } = useAuthStore();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(`/account/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [loading, isAuthenticated, pathname, router]);

  // Loading — show spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--ag-gray-100)]">
        <div className="w-10 h-10 border-4 border-[var(--ag-red)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not authenticated — show fallback or nothing
  if (!isAuthenticated) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}
