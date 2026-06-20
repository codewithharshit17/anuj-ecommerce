/**
 * log-activity.ts
 *
 * Audit trail logging helper for administrative actions.
 * Saves a record to the AdminActivityLog table in the database.
 */

import prisma from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

interface LogActivityInput {
  adminId: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Prisma.InputJsonValue;
}

export async function logActivity({
  adminId,
  action,
  entityType,
  entityId,
  metadata,
}: LogActivityInput) {
  try {
    const log = await prisma.adminActivityLog.create({
      data: {
        adminId,
        action,
        entityType,
        entityId,
        metadata: metadata ?? undefined,
      },
    });
    return log;
  } catch (error) {
    // Log failures should not crash user-facing mutations, but should be reported in logs
    console.error("[logActivity] Failed to write admin activity log:", error);
    return null;
  }
}
