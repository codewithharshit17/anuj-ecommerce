// apps/storefront/components/store/auth/AuthGate.tsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Simple local storage mock user session
export function checkAuth(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("ag-user");
}

export function loginMockUser(email: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("ag-user", JSON.stringify({ email, name: email.split("@")[0] }));
  }
}

export function logoutMockUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("ag-user");
  }
}

interface AuthGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AuthGate({ children, fallback }: AuthGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const authStatus = checkAuth();
    setIsAuthenticated(authStatus);

    if (!authStatus) {
      // Redirect to login with current path encoded as redirect param
      router.push(`/account/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [pathname, router]);

  if (isAuthenticated === null) {
    // Loading state
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--ag-gray-100)]">
        <div className="w-10 h-10 border-4 border-[var(--ag-red)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}
