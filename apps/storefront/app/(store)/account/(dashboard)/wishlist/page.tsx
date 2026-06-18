/**
 * Wishlist Page — `/account/wishlist`
 *
 * Server-side entry point for the authenticated user's saved wishlist items.
 * Fetches data via Prisma and delegates state rendering to WishlistClient.
 */

import { requireAuth } from "@/lib/auth/require-auth";
import prisma from "@/lib/prisma";
import WishlistClient from "./WishlistClient";

export const metadata = {
  title: "My Wishlist — KAPI PEN",
};

export default async function WishlistPage() {
  const user = await requireAuth("/account/wishlist");

  // Fetch the user's wishlist and items
  const wishlist = await prisma.wishlist.findUnique({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: true,
              category: true,
            },
          },
        },
      },
    },
  });

  const products = wishlist
    ? wishlist.items.map((item) => {
        const prod = item.product;
        const primaryImage =
          prod.images.find((img) => img.isPrimary)?.url ||
          prod.images[0]?.url ||
          "";

        return {
          id: prod.id,
          name: prod.name,
          slug: prod.slug,
          price: prod.price,
          mrp: prod.mrp,
          image: primaryImage,
          category: prod.category?.name || "KAPI PEN",
        };
      })
    : [];

  return <WishlistClient initialProducts={products} />;
}
