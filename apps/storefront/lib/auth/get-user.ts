/**
 * get-user.ts
 *
 * Server-side user retrieval helpers.
 *
 * - `getUser()`       → Supabase Auth user (lightweight, no DB call)
 * - `getPrismaUser()` → Full Prisma User record with relations
 *
 * Both are `async` and designed for Server Components / Server Actions.
 * They use the cookie-based Supabase server client, so they only work
 * in a server context (not in `"use client"` components).
 */

import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { User as PrismaUser, Address } from "@prisma/client";

// ── Types ────────────────────────────────────────────────────────────

export type AuthUser = SupabaseUser;

export type PrismaUserWithRelations = PrismaUser & {
  addresses: Address[];
};

// ── Supabase Auth user ───────────────────────────────────────────────

/**
 * Returns the currently authenticated Supabase Auth user, or `null`
 * if the session is invalid / missing.
 *
 * Prefers `getUser()` over `getSession()` because `getUser()` always
 * validates the JWT against the Supabase Auth server (more secure).
 */
export async function getUser(): Promise<AuthUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return user;
}

// ── Prisma user ──────────────────────────────────────────────────────

/**
 * Fetches the full Prisma User record (with addresses) for the
 * currently authenticated user.
 *
 * Returns `null` if the user is not authenticated or if the Prisma
 * record hasn't been synced yet.
 */
export async function getPrismaUser(): Promise<PrismaUserWithRelations | null> {
  const user = await getUser();
  if (!user) return null;

  try {
    const prismaUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { addresses: true },
    });

    return prismaUser;
  } catch (error) {
    console.error("[get-user] Failed to fetch Prisma user:", error);
    return null;
  }
}
