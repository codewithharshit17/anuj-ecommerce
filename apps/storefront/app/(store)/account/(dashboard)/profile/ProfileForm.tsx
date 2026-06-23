"use client";

import { useState } from "react";
import { User, Mail, Calendar, Shield, Edit2, Check, X, Loader2 } from "lucide-react";
import { updateProfile, UpdateProfileState } from "@/lib/actions/auth/update-profile";

interface ProfileFormProps {
  initialUser: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    createdAt: Date | string;
  };
}

export default function ProfileForm({ initialUser }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [state, setState] = useState<UpdateProfileState>({});
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    try {
      const result = await updateProfile(state, formData);
      if (result.success) {
        setIsEditing(false);
        setState({});
        // Reload page data
        window.location.reload();
      } else {
        setState(result);
      }
    } catch (err) {
      console.error(err);
      setState({ error: "Failed to update profile." });
    } finally {
      setIsPending(false);
    }
  };

  const memberSince = new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(initialUser.createdAt));

  const displayName = [initialUser.firstName, initialUser.lastName]
    .filter(Boolean)
    .join(" ") || "—";

  return (
    <div className="bg-card text-card-foreground border border-border rounded-2xl overflow-hidden shadow-sm">
      {/* Banner */}
      <div
        className="h-24 w-full flex items-end justify-end p-4"
        style={{
          background:
            "linear-gradient(135deg, var(--ag-red), var(--ag-yellow))",
        }}
      >
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 bg-white/90 hover:bg-white text-[var(--ag-dark)] font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm backdrop-blur-xs transition-all cursor-pointer"
          >
            <Edit2 size={12} />
            Edit Profile
          </button>
        )}
      </div>

      {/* Avatar + name */}
      <div className="px-6 -mt-10">
        <div className="flex items-end gap-4">
          <div className="w-20 h-20 rounded-2xl border-4 border-card bg-card flex items-center justify-center shadow-md">
            <span
              className="text-2xl font-bold"
              style={{ color: "var(--ag-red)" }}
            >
              {(initialUser.firstName?.[0] ?? "").toUpperCase()}
              {(initialUser.lastName?.[0] ?? "").toUpperCase()}
            </span>
          </div>
          <div className="pb-1">
            <h3 className="font-bold text-lg text-foreground">
              {displayName}
            </h3>
            <p className="text-xs text-[var(--ag-gray-500)]">
              Member since {memberSince}
            </p>
          </div>
        </div>
      </div>

      {/* Details / Form */}
      <div className="p-6 pt-6">
        {state.error && (
          <div className="mb-4 text-xs font-semibold text-[var(--ag-red)] bg-[var(--ag-red)]/8 p-3 rounded-lg border border-[var(--ag-red)]/15">
            {state.error}
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Name Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--ag-gray-500)]">
                  First Name
                </label>
                <input
                  name="firstName"
                  type="text"
                  defaultValue={initialUser.firstName || ""}
                  required
                  disabled={isPending}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:border-[var(--ag-red)] focus:ring-4 focus:ring-[var(--ag-red)]/10 outline-none transition-all disabled:opacity-50"
                />
                {state.errors?.firstName && (
                  <span className="text-[10px] font-semibold text-[var(--ag-red)] mt-0.5">
                    {state.errors.firstName}
                  </span>
                )}
              </div>

              {/* Last Name Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--ag-gray-500)]">
                  Last Name
                </label>
                <input
                  name="lastName"
                  type="text"
                  defaultValue={initialUser.lastName || ""}
                  required
                  disabled={isPending}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:border-[var(--ag-red)] focus:ring-4 focus:ring-[var(--ag-red)]/10 outline-none transition-all disabled:opacity-50"
                />
                {state.errors?.lastName && (
                  <span className="text-[10px] font-semibold text-[var(--ag-red)] mt-0.5">
                    {state.errors.lastName}
                  </span>
                )}
              </div>
            </div>

            {/* Read-only details during editing */}
            <div className="pt-4 border-t border-[var(--ag-gray-200)]/50 dark:border-[var(--border)]/50 space-y-4">
              <ProfileField icon={Mail} label="Email Address" value={initialUser.email} />
              <ProfileField icon={Calendar} label="Member Since" value={memberSince} />
              <ProfileField icon={Shield} label="Account ID" value={initialUser.id.slice(0, 8) + "••••"} />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-1.5 bg-[var(--ag-red)] hover:bg-[var(--ag-red-hover)] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {isPending ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Check size={12} />
                )}
                Save Changes
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center gap-1.5 border border-[var(--ag-gray-200)] dark:border-neutral-800 text-[var(--ag-gray-800)] dark:text-gray-300 font-bold text-xs px-4 py-2 rounded-xl hover:bg-[var(--ag-gray-100)] dark:hover:bg-neutral-800 transition-all cursor-pointer"
              >
                <X size={12} />
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <ProfileField icon={User} label="First Name" value={initialUser.firstName || "—"} />
            <ProfileField icon={User} label="Last Name" value={initialUser.lastName || "—"} />
            <ProfileField icon={Mail} label="Email Address" value={initialUser.email} />
            <ProfileField icon={Calendar} label="Member Since" value={memberSince} />
            <ProfileField icon={Shield} label="Account ID" value={initialUser.id.slice(0, 8) + "••••"} />
          </div>
        )}
      </div>
    </div>
  );
}

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
        <p className="text-sm font-semibold text-foreground truncate">
          {value}
        </p>
      </div>
    </div>
  );
}
