/**
 * Addresses Page — `/account/addresses`
 *
 * Displays the user's saved delivery addresses. Shows an empty state
 * if none exist. Ready for future address management (add/edit/delete).
 */

import { requireAuth } from "@/lib/auth/require-auth";
import prisma from "@/lib/prisma";
import { MapPin, Plus, Home, Star } from "lucide-react";

export const metadata = {
  title: "My Addresses — KAPI PEN",
};

export default async function AddressesPage() {
  const user = await requireAuth("/account/addresses");

  const addresses = await prisma.address.findMany({
    where: { userId: user.id },
    orderBy: { isDefault: "desc" },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-h2 text-[var(--ag-dark)] tracking-tight">
            My Addresses
          </h2>
          <p className="text-sm text-[var(--ag-gray-500)] mt-1">
            Manage your delivery addresses
          </p>
        </div>

        {addresses.length > 0 && (
          <button
            disabled
            className="inline-flex items-center gap-1.5 bg-[var(--ag-red)] text-white font-bold text-xs px-4 py-2 rounded-xl opacity-60 cursor-not-allowed"
            title="Coming soon"
          >
            <Plus size={14} />
            Add Address
          </button>
        )}
      </div>

      {addresses.length === 0 ? (
        /* ── Empty state ── */
        <div className="bg-white dark:bg-[var(--card)] border border-[var(--ag-gray-200)] dark:border-[var(--border)] rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[var(--ag-gray-100)] dark:bg-[var(--muted)] flex items-center justify-center mx-auto mb-4">
            <MapPin size={28} className="text-[var(--ag-gray-500)]" />
          </div>
          <h3 className="font-bold text-base text-[var(--ag-dark)] mb-1">
            No addresses saved
          </h3>
          <p className="text-sm text-[var(--ag-gray-500)] mb-6 max-w-xs mx-auto">
            Add a delivery address to speed up your checkout process.
          </p>
          <button
            disabled
            className="inline-flex items-center gap-2 bg-[var(--ag-red)] text-white font-bold text-sm px-5 py-2.5 rounded-xl opacity-60 cursor-not-allowed"
            title="Coming soon"
          >
            <Plus size={16} />
            Add Your First Address
          </button>
        </div>
      ) : (
        /* ── Address cards ── */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`bg-white dark:bg-[var(--card)] border rounded-2xl p-5 shadow-sm relative ${
                address.isDefault
                  ? "border-[var(--ag-red)]/30 ring-1 ring-[var(--ag-red)]/10"
                  : "border-[var(--ag-gray-200)] dark:border-[var(--border)]"
              }`}
            >
              {/* Default badge */}
              {address.isDefault && (
                <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold text-[var(--ag-red)] bg-[var(--ag-red)]/8 px-2 py-0.5 rounded-md">
                  <Star size={10} />
                  Default
                </div>
              )}

              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-xl bg-[var(--ag-gray-100)] dark:bg-[var(--muted)] flex items-center justify-center shrink-0 mt-0.5">
                  <Home size={16} className="text-[var(--ag-gray-500)]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--ag-dark)]">
                    {address.line1}
                  </p>
                  {address.line2 && (
                    <p className="text-xs text-[var(--ag-gray-500)]">
                      {address.line2}
                    </p>
                  )}
                  <p className="text-xs text-[var(--ag-gray-500)] mt-0.5">
                    {address.city}, {address.state} — {address.pincode}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
