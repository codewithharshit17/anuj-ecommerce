import { requireAdmin } from "@/lib/auth/require-admin";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side auth guard — redirects to /admin/login if not authenticated admin
  const admin = await requireAdmin();

  const adminName =
    admin.firstName || admin.lastName
      ? `${admin.firstName ?? ""} ${admin.lastName ?? ""}`.trim()
      : admin.email;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex">
      {/* Sidebar Navigation */}
      <AdminSidebar adminName={adminName} adminEmail={admin.email} />

      {/* Main Panel Content */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="h-14 border-b border-zinc-200 bg-white px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
              Admin Portal
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-500 font-mono">
              {admin.email}
            </span>
            <div className="size-7 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
              <span className="text-xs font-bold text-red-600 uppercase">
                {adminName.charAt(0)}
              </span>
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-grow p-8 bg-zinc-50">
          {children}
        </main>
      </div>
    </div>
  );
}
