/**
 * Profile Page — `/account/profile`
 *
 * Displays the authenticated user's profile data fetched from Prisma.
 * Read-only for now — edit functionality can be added later.
 */

import { getPrismaUser } from "@/lib/auth/get-user";
import { Mail, Calendar, User, Shield } from "lucide-react";

export const metadata = {
  title: "My Profile — KAPI PEN",
};

export default async function ProfilePage() {
  const user = await getPrismaUser();

  if (!user) {
    return (
      <div className="bg-white dark:bg-[var(--card)] border border-[var(--ag-gray-200)] dark:border-[var(--border)] rounded-2xl p-8 text-center shadow-sm">
        <p className="text-sm text-[var(--ag-gray-500)]">
          Unable to load profile. Please try again.
        </p>
      </div>
    );
  }

  const displayName = [user.firstName, user.lastName]
    .filter(Boolean)
    .join(" ") || "—";

  const memberSince = new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(user.createdAt));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-h2 text-[var(--ag-dark)] tracking-tight">
          My Profile
        </h2>
        <p className="text-sm text-[var(--ag-gray-500)] mt-1">
          Your personal information
        </p>
      </div>

      {/* Profile card */}
      <div className="bg-white dark:bg-[var(--card)] border border-[var(--ag-gray-200)] dark:border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
        {/* Banner */}
        <div
          className="h-24 w-full"
          style={{
            background:
              "linear-gradient(135deg, var(--ag-red), var(--ag-yellow))",
          }}
        />

        {/* Avatar + name */}
        <div className="px-6 -mt-10">
          <div className="flex items-end gap-4">
            <div className="w-20 h-20 rounded-2xl border-4 border-white dark:border-[var(--card)] bg-white dark:bg-[var(--card)] flex items-center justify-center shadow-md">
              <span
                className="text-2xl font-bold"
                style={{ color: "var(--ag-red)" }}
              >
                {(user.firstName?.[0] ?? "").toUpperCase()}
                {(user.lastName?.[0] ?? "").toUpperCase()}
              </span>
            </div>
            <div className="pb-1">
              <h3 className="font-bold text-lg text-[var(--ag-dark)]">
                {displayName}
              </h3>
              <p className="text-xs text-[var(--ag-gray-500)]">
                Member since {memberSince}
              </p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 pt-6 space-y-4">
          <ProfileField
            icon={User}
            label="First Name"
            value={user.firstName || "—"}
          />
          <ProfileField
            icon={User}
            label="Last Name"
            value={user.lastName || "—"}
          />
          <ProfileField
            icon={Mail}
            label="Email Address"
            value={user.email}
          />
          <ProfileField
            icon={Calendar}
            label="Member Since"
            value={memberSince}
          />
          <ProfileField
            icon={Shield}
            label="Account ID"
            value={user.id.slice(0, 8) + "••••"}
          />
        </div>
      </div>
    </div>
  );
}

// ── Helper component ─────────────────────────────────────────────────

function ProfileField({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-[var(--ag-gray-200)]/50 dark:border-[var(--border)]/50 last:border-0">
      <div className="w-9 h-9 rounded-xl bg-[var(--ag-gray-100)] dark:bg-[var(--muted)] flex items-center justify-center shrink-0">
        <Icon size={16} className="text-[var(--ag-gray-500)]" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--ag-gray-500)]">
          {label}
        </p>
        <p className="text-sm font-semibold text-[var(--ag-dark)] truncate">
          {value}
        </p>
      </div>
    </div>
  );
}
