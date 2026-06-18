/**
 * Account Layout — `/account/*`
 *
 * Shared layout for all authenticated account pages (profile, orders,
 * addresses). Server component that:
 * 1. Calls `requireAuth()` to protect all child routes
 * 2. Fetches the Prisma user for display
 * 3. Renders a sidebar navigation + content area
 */

import Link from "next/link";
import { requireAuth } from "@/lib/auth/require-auth";
import { getPrismaUser } from "@/lib/auth/get-user";
import { logout } from "@/lib/actions/auth/logout";
import {
  User,
  Package,
  MapPin,
  LogOut,
  ChevronRight,
} from "lucide-react";

// ── Navigation items ─────────────────────────────────────────────────

const NAV_ITEMS = [
  {
    href: "/account/profile",
    label: "My Profile",
    icon: User,
    description: "Personal information",
  },
  {
    href: "/account/orders",
    label: "My Orders",
    icon: Package,
    description: "Track & manage orders",
  },
  {
    href: "/account/addresses",
    label: "Addresses",
    icon: MapPin,
    description: "Saved delivery addresses",
  },
] as const;

// ── Layout ───────────────────────────────────────────────────────────

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Protect all account routes
  await requireAuth("/account/profile");

  // Fetch user for sidebar display
  const prismaUser = await getPrismaUser();

  const displayName = [prismaUser?.firstName, prismaUser?.lastName]
    .filter(Boolean)
    .join(" ") || "User";

  const initials = [prismaUser?.firstName?.[0], prismaUser?.lastName?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-[var(--ag-gray-100)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="font-display text-h1 text-[var(--ag-dark)] tracking-tight">
            My Account
          </h1>
          <p className="text-sm text-[var(--ag-gray-500)] mt-1">
            Manage your profile, orders, and addresses
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── Sidebar ── */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="bg-white dark:bg-[var(--card)] border border-[var(--ag-gray-200)] dark:border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
              {/* User info */}
              <div className="p-5 border-b border-[var(--ag-gray-200)] dark:border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--ag-red), var(--ag-yellow))",
                    }}
                  >
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-[var(--ag-dark)] truncate">
                      {displayName}
                    </p>
                    <p className="text-xs text-[var(--ag-gray-500)] truncate">
                      {prismaUser?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-2">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-[var(--ag-dark)] hover:bg-[var(--ag-gray-100)] dark:hover:bg-[var(--muted)] transition-colors group"
                  >
                    <item.icon
                      size={18}
                      className="text-[var(--ag-gray-500)] group-hover:text-[var(--ag-red)] transition-colors shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className="text-[11px] text-[var(--ag-gray-500)]">
                        {item.description}
                      </p>
                    </div>
                    <ChevronRight
                      size={14}
                      className="text-[var(--ag-gray-500)] group-hover:text-[var(--ag-red)] transition-colors shrink-0"
                    />
                  </Link>
                ))}
              </nav>

              {/* Logout */}
              <div className="p-2 pt-0 border-t border-[var(--ag-gray-200)] dark:border-[var(--border)] mt-1">
                <form action={logout}>
                  <button
                    type="submit"
                    className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-[var(--ag-red)] hover:bg-[var(--ag-red)]/5 transition-colors group"
                  >
                    <LogOut size={18} className="shrink-0" />
                    <span className="text-sm font-semibold">Sign Out</span>
                  </button>
                </form>
              </div>
            </div>
          </aside>

          {/* ── Content ── */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
