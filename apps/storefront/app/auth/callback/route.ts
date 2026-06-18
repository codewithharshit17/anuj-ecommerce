/**
 * auth/callback/route.ts
 *
 * Handles the OAuth callback from Supabase (PKCE flow).
 *
 * 1. Exchanges the authorization `code` for a session.
 * 2. Syncs the authenticated user to the Prisma `User` table.
 * 3. Redirects to the `next` query param (or `/` by default).
 *
 * This route is hit after Google OAuth (or any other provider).
 * For email/password auth, the redirect happens in the server action.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { syncUserToPrisma } from "@/lib/auth/sync-user";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (!code) {
    // No authorization code — redirect to login with error
    return NextResponse.redirect(
      `${origin}/account/login?error=${encodeURIComponent("Missing authorization code.")}`
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth/callback] Code exchange failed:", error.message);
    return NextResponse.redirect(
      `${origin}/account/login?error=${encodeURIComponent(error.message)}`
    );
  }

  // Sync OAuth user to Prisma
  if (data.user) {
    await syncUserToPrisma(data.user);
  }

  // Redirect to the intended destination
  return NextResponse.redirect(`${origin}${next}`);
}
