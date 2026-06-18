/**
 * permission.ts
 *
 * Lightweight role & permission checking utilities.
 *
 * Currently uses a simple email-based admin list. This can be upgraded
 * to a database-backed RBAC system when the project grows — the public
 * API surface (`isAdmin`, `checkPermission`) will stay the same.
 */

// ── Configuration ────────────────────────────────────────────────────

/**
 * Emails that have admin access. In production, move this to a
 * database table or environment variable.
 */
const ADMIN_EMAILS: ReadonlySet<string> = new Set(
  (process.env.ADMIN_EMAILS ?? "").split(",").filter(Boolean)
);

/** Available permission scopes */
export type Permission =
  | "admin:dashboard"
  | "admin:products"
  | "admin:orders"
  | "admin:users"
  | "user:profile"
  | "user:orders"
  | "user:addresses";

// ── Helpers ──────────────────────────────────────────────────────────

/**
 * Check if a user email belongs to an admin.
 */
export function isAdmin(email: string | undefined | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.has(email.toLowerCase());
}

/**
 * Check if a user has a specific permission.
 *
 * Rules:
 * - Admins have all permissions.
 * - Regular users have `user:*` permissions only.
 *
 * @param email       The user's email address.
 * @param permission  The permission to check.
 */
export function checkPermission(
  email: string | undefined | null,
  permission: Permission
): boolean {
  if (!email) return false;

  // Admins can do everything
  if (isAdmin(email)) return true;

  // Regular users only get user-scoped permissions
  return permission.startsWith("user:");
}
