"use server";

import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }
  return user;
}

// ── Fetch Wishlist Product IDs ───────────────────────────────────────
export async function getWishlistAction(): Promise<string[]> {
  const user = await getAuthUser();
  if (!user) return [];

  try {
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: user.id },
      include: { items: true },
    });

    if (!wishlist) return [];
    return wishlist.items.map((item) => item.productId);
  } catch (error) {
    console.error("[getWishlistAction] Failed to fetch wishlist:", error);
    return [];
  }
}

// ── Toggle Wishlist Item in DB ───────────────────────────────────────
export async function toggleWishlistAction(productId: string): Promise<{ success: boolean; items?: string[]; error?: string }> {
  const user = await getAuthUser();
  if (!user) {
    return { success: false, error: "You must be logged in to modify your wishlist." };
  }

  try {
    // 1. Get or create user's wishlist
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId: user.id },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId: user.id },
      });
    }

    // 2. Check if item exists
    const existingItem = await prisma.wishlistItem.findFirst({
      where: {
        wishlistId: wishlist.id,
        productId: productId,
        variantId: null,
      },
    });

    if (existingItem) {
      // Remove
      await prisma.wishlistItem.delete({
        where: { id: existingItem.id },
      });
    } else {
      // Add
      await prisma.wishlistItem.create({
        data: {
          wishlistId: wishlist.id,
          productId: productId,
          variantId: null,
        },
      });
    }

    // Fetch updated wishlist item IDs to return
    const updatedItems = await prisma.wishlistItem.findMany({
      where: { wishlistId: wishlist.id },
      select: { productId: true },
    });

    revalidatePath("/account/wishlist");
    return {
      success: true,
      items: updatedItems.map((item) => item.productId),
    };
  } catch (error) {
    console.error("[toggleWishlistAction] Failed to toggle wishlist item:", error);
    return { success: false, error: "Failed to update wishlist." };
  }
}

// ── Merge Guest Wishlist items on Login ──────────────────────────────
export async function mergeWishlistAction(guestProductIds: string[]): Promise<string[]> {
  const user = await getAuthUser();
  if (!user || guestProductIds.length === 0) return [];

  try {
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId: user.id },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId: user.id },
      });
    }

    // Insert guest items if they don't already exist
    for (const prodId of guestProductIds) {
      const existing = await prisma.wishlistItem.findFirst({
        where: {
          wishlistId: wishlist.id,
          productId: prodId,
          variantId: null,
        },
      });

      if (!existing) {
        await prisma.wishlistItem.create({
          data: {
            wishlistId: wishlist.id,
            productId: prodId,
            variantId: null,
          },
        });
      }
    }

    const updatedItems = await prisma.wishlistItem.findMany({
      where: { wishlistId: wishlist.id },
      select: { productId: true },
    });

    revalidatePath("/account/wishlist");
    return updatedItems.map((item) => item.productId);
  } catch (error) {
    console.error("[mergeWishlistAction] Failed to merge wishlist:", error);
    return [];
  }
}
