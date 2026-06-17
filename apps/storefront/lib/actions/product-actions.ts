"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function getProducts() {
  try {
    return await prisma.product.findMany({
      where: {
        isActive: true,
      },
      include: {
        images: true,
        category: true,
        variants: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  try {
    return await prisma.product.findFirst({
      where: { 
        slug,
        isActive: true
      },
      include: {
        images: true,
        category: true,
        variants: true,
      },
    });
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
}

export async function getProductsByCategory(categorySlug: string) {
  try {
    return await prisma.product.findMany({
      where: {
        isActive: true,
        category: {
          slug: categorySlug,
        },
      },
      include: {
        images: true,
        category: true,
        variants: true,
      },
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
}

export async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      include: {
        images: true,
        category: true,
        variants: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

export async function searchProducts(query: string, limit: number = 5) {
  try {
    return await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        images: true,
        category: true,
        variants: true,
      },
      take: limit,
    });
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
}
