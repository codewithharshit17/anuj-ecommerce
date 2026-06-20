/**
 * Admin OAuth Callback — /admin/auth/callback
 *
 * Dedicated callback for admin Google OAuth logins only.
 * Exchanges the auth code for a Supabase session, then lands on
 * /admin/dashboard where requireAdmin() enforces role-based gating.
 *
 * Non-ADMIN users are bounced to / by the (protected) layout.
 * The shared /auth/callback route is NOT modified.
 */
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Always redirect to admin dashboard — requireAdmin() handles role gating.
  // A non-admin Google user will be bounced to / by the (protected) layout.
  return NextResponse.redirect(`${origin}/admin/dashboard`);
}
