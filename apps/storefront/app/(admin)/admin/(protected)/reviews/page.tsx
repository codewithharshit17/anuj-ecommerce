import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";
import ReviewsClient from "@/components/admin/ReviewsClient";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  // 1. Guard against non-admin
  await requireAdmin();

  // 2. Fetch all reviews
  const reviews = await prisma.review.findMany({
    include: {
      product: {
        select: {
          name: true,
          slug: true,
        },
      },
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      reply: {
        select: {
          id: true,
          comment: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // 3. Compute status counts
  const pendingCount = await prisma.review.count({ where: { status: "PENDING" } });
  const approvedCount = await prisma.review.count({ where: { status: "APPROVED" } });
  const rejectedCount = await prisma.review.count({ where: { status: "REJECTED" } });

  const counts = {
    PENDING: pendingCount,
    APPROVED: approvedCount,
    REJECTED: rejectedCount,
  };

  return (
    <div className="space-y-6">
      <ReviewsClient initialReviews={reviews} counts={counts} />
    </div>
  );
}
