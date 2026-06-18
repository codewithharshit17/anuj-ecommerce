/**
 * lib/auth/index.ts
 *
 * Barrel export for all auth utilities.
 * Allows clean imports: `import { getUser, requireAuth } from "@/lib/auth"`
 */

export { getUser, getPrismaUser } from "./get-user";
export type { AuthUser, PrismaUserWithRelations } from "./get-user";

export { requireAuth } from "./require-auth";

export { syncUserToPrisma } from "./sync-user";

export { isAdmin, checkPermission } from "./permission";
export type { Permission } from "./permission";
