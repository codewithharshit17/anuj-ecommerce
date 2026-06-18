/**
 * login.ts — Server Action
 *
 * Handles email/password authentication via Supabase Auth.
 * On first login, also syncs the user to Prisma (covers edge cases
 * where the sync failed during signup).
 */
"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { syncUserToPrisma } from "@/lib/auth/sync-user";

// ── Types ────────────────────────────────────────────────────────────

export interface LoginState {
  error?: string;
  success?: boolean;
}

// ── Server Action ────────────────────────────────────────────────────

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = (formData.get("email") as string | null)?.trim().toLowerCase();
  const password = formData.get("password") as string | null;
  const redirectTo = (formData.get("redirectTo") as string | null) || "/";

  // 1. Validate
  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  // 2. Authenticate
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // 3. Sync to Prisma (idempotent — handles first-login edge case)
  if (data.user) {
    await syncUserToPrisma(data.user);
  }

  // 4. Redirect
  redirect(redirectTo);
}
