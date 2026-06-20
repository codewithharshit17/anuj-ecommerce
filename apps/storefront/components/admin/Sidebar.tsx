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
  ArrowLeft,
  User,
} from "lucide-react";

interface SidebarProps {
  adminName: string;
}

const MENU_ITEMS = [
  {
    group: "GENERAL",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Customers", href: "/admin/customers", icon: Users },
      { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    ],
  },
  {
    group: "CATALOG",
    items: [
      { name: "Products", href: "/admin/products", icon: Package },
      { name: "Categories", href: "/admin/categories", icon: FolderTree },
    ],
  },
  {
    group: "BUSINESS TOOLS",
    items: [
      { name: "Reports", href: "/admin/reports", icon: BarChart3 },
    ],
  },
];

export default function Sidebar({ adminName }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-zinc-950 text-zinc-100 flex flex-col h-screen fixed left-0 top-0 z-30 border-r border-zinc-900 shadow-xl">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-md">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight font-display text-gradient-coral">
            KAPI PEN
          </span>
          <span className="text-[10px] bg-red-500/10 text-red-500 font-semibold px-2 py-0.5 rounded-full border border-red-500/20">
            ADMIN
          </span>
        </Link>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 no-scrollbar">
        {MENU_ITEMS.map((group) => (
          <div key={group.group} className="space-y-2">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-3">
              {group.group}
            </h3>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                        isActive
                          ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                          : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
                      )}
                    >
                      <Icon className={cn("size-4 shrink-0 transition-transform duration-200 group-hover:scale-110", isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-100")} />
                      <span>{item.name}</span>
                      {isActive && (
                        <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-white rounded-r-full" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Admin User Info / Actions Footer */}
      <div className="p-4 border-t border-zinc-900 bg-zinc-950/50 flex flex-col gap-2">
        <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg">
          <div className="size-8 rounded-full bg-red-600/10 border border-red-600/20 flex items-center justify-center shrink-0">
            <User className="size-4 text-red-500" />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-zinc-100 truncate">
              {adminName}
            </p>
            <p className="text-xs text-zinc-500 truncate">Administrator</p>
          </div>
        </div>
        
        <Link
          href="/"
          className="flex items-center gap-2 mt-2 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-lg transition-colors duration-200"
        >
          <ArrowLeft className="size-3" />
          <span>Exit to Storefront</span>
        </Link>
      </div>
    </aside>
  );
}
