"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Package,
  FolderTree,
  BarChart3,
  Settings,
  LogOut,
  User,
  Store,
  Boxes,
} from "lucide-react";
import { adminLogout } from "@/lib/actions/auth/admin-logout";
import { useTransition } from "react";

interface AdminSidebarProps {
  adminName: string;
  adminEmail: string;
}

const MENU_ITEMS = [
  {
    group: "GENERAL",
    items: [
      { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
      { name: "Customers", href: "/admin/customers", icon: Users },
    ],
  },
  {
    group: "CATALOG",
    items: [
      { name: "Products", href: "/admin/products", icon: Package },
      { name: "Categories", href: "/admin/categories", icon: FolderTree },
      { name: "Inventory", href: "/admin/inventory", icon: Boxes },
    ],
  },
  {
    group: "ANALYTICS",
    items: [
      { name: "Reports", href: "/admin/reports", icon: BarChart3 },
    ],
  },
  {
    group: "SYSTEM",
    items: [
      { name: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export default function AdminSidebar({ adminName, adminEmail }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await adminLogout();
    });
  };

  return (
    <aside className="w-64 bg-white text-zinc-900 flex flex-col h-screen fixed left-0 top-0 z-30 border-r border-zinc-200">
      {/* Brand Header */}
      <div className="h-14 flex items-center px-5 border-b border-zinc-200 shrink-0">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5 group">
          <div className="size-7 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-sm shadow-red-950/25 shrink-0">
            <span className="text-xs font-black text-white tracking-tight">K</span>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold tracking-tight text-zinc-900 group-hover:text-zinc-700 transition-colors leading-none">
              Personal Marketing Store
            </p>
            <p className="text-[9px] font-semibold text-red-500 uppercase tracking-[0.15em] leading-none mt-0.5">
              Admin Portal
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 no-scrollbar">
        {MENU_ITEMS.map((group) => (
          <div key={group.group}>
            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.18em] px-3 mb-1.5">
              {group.group}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  item.href === "/admin/dashboard"
                    ? pathname === "/admin/dashboard"
                    : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group relative",
                        isActive
                          ? "bg-red-600 text-white shadow-sm shadow-red-900/15"
                          : "text-zinc-650 hover:text-zinc-900 hover:bg-zinc-50"
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-[15px] shrink-0 transition-colors",
                          isActive
                            ? "text-white"
                            : "text-zinc-400 group-hover:text-zinc-600"
                        )}
                      />
                      <span className="truncate">{item.name}</span>
                      {isActive && (
                        <span className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-white/80 rounded-r-full" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer — User Identity + Actions */}
      <div className="shrink-0 border-t border-zinc-200 p-3 space-y-1">
        {/* Admin identity */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-zinc-50">
          <div className="size-7 rounded-full bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
            <User className="size-3.5 text-red-500" />
          </div>
          <div className="overflow-hidden flex-1 min-w-0">
            <p className="text-xs font-semibold text-zinc-800 truncate leading-tight">
              {adminName}
            </p>
            <p className="text-[10px] text-zinc-500 truncate leading-tight" title={adminEmail}>
              {adminEmail}
            </p>
          </div>
        </div>

        {/* View Storefront */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-zinc-550 hover:text-zinc-800 hover:bg-zinc-50 transition-colors group"
        >
          <Store className="size-3.5 shrink-0 group-hover:text-zinc-700 transition-colors" />
          <span>View Storefront</span>
        </Link>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={isPending}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-zinc-550 hover:text-red-600 hover:bg-red-50 transition-colors group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="size-3.5 shrink-0 group-hover:text-red-550 transition-colors" />
          <span>{isPending ? "Signing out…" : "Sign Out"}</span>
        </button>
      </div>
    </aside>
  );
}
