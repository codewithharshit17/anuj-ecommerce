/**
 * require-auth.ts
 *
 * Auth guard for Server Components and Server Actions.
 *
 * Call `requireAuth()` at the top of any server component or action
 * that requires an authenticated user. If no session exists, the user
 * is redirected to the login page with a `redirect` query param so
 * they return to the intended destination after signing in.
 */

import { redirect } from "next/navigation";
import { getUser, type AuthUser } from "./get-user";

/**
 * Ensures the current request has a valid session.
 *
 * @param redirectTo  Optional override for where to redirect after login.
 *                    Defaults to the login page without a redirect param.
 * @returns           The authenticated Supabase Auth user.
 * @throws            Redirects (via Next.js `redirect()`) if unauthenticated.
 */
export async function requireAuth(redirectTo?: string): Promise<AuthUser> {
  const user = await getUser();

  if (!user) {
    const loginUrl = redirectTo
      ? `/account/login?redirect=${encodeURIComponent(redirectTo)}`
      : "/account/login";

    redirect(loginUrl);
  }

  return user;
}
