/**
 * Profile Page — `/account/profile`
 *
 * Displays the authenticated user's profile data fetched from Prisma.
 * Supports inline editing of first and last names.
 */

import { getPrismaUser } from "@/lib/auth/get-user";
import ProfileForm from "./ProfileForm";

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

  // Cast user safely to pass serialization boundary
  const initialUser = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    createdAt: user.createdAt.toISOString(),
  };

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

      <ProfileForm initialUser={initialUser} />
    </div>
  );
}
