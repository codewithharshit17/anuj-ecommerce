/**
 * Settings Page — `/admin/settings`
 *
 * Placeholder for upcoming admin configuration options.
 */
import { Settings, Hammer } from "lucide-react";

export const metadata = {
  title: "Settings — Personal Marketing Store Admin",
};

export default function AdminSettingsPage() {
  return (
    <div className="max-w-3xl">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Settings className="size-4 text-zinc-500" />
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
            System
          </p>
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight font-display">
          Settings
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Manage admin portal and system configuration.
        </p>
      </div>

      {/* Coming soon card */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-12 flex flex-col items-center justify-center text-center gap-4 shadow-sm">
        <div className="size-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
          <Hammer className="size-6 text-zinc-500 dark:text-zinc-400" />
        </div>
        <div>
          <p className="text-base font-semibold text-zinc-900 dark:text-zinc-200">
            Coming Soon
          </p>
          <p className="text-sm text-zinc-500 mt-1 max-w-xs">
            Admin settings will be available in an upcoming release. Check back soon.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 text-amber-800 dark:text-amber-500 text-xs font-semibold">
          <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
          In Development
        </span>
      </div>
    </div>
  );
}
