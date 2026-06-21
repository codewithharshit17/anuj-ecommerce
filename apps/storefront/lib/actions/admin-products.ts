"use server";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";
import { logActivity } from "@/lib/audit/log-activity";
import { revalidatePath } from "next/cache";

// Helper to generate a unique slug
async function getUniqueSlug(name: string, currentId?: string) {
  const baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  let slug = baseSlug || "product";
  let count = 1;
  while (true) {
    const existing = await prisma.product.findFirst({
      where: {
        slug,
        id: currentId ? { not: currentId } : undefined,
      },
    });
    if (!existing) break;
    slug = `${baseSlug}-${count}`;
    count++;
  }
  return slug;
}

export async function createProduct(formData: {
  name: string;
  description?: string;
  price: number;
  mrp: number;
  categoryId: string;
  lowStockThreshold?: number;
  imageUrl?: string;
  stock: number; // for default single variant
  isActive?: boolean;
  isFeatured?: boolean;
}) {
  const admin = await requireAdmin();

  try {
    const slug = await getUniqueSlug(formData.name);

    // Create product
    const product = await prisma.product.create({
      data: {
        name: formData.name,
        slug,
        description: formData.description ?? null,
        price: formData.price,
        mrp: formData.mrp,
        categoryId: formData.categoryId,
        lowStockThreshold: formData.lowStockThreshold ?? 10,
        isActive: formData.isActive ?? true,
        isFeatured: formData.isFeatured ?? false,
      },
    });

    // Create primary image
    if (formData.imageUrl) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: formData.imageUrl,
          alt: formData.name,
          isPrimary: true,
        },
      });
    }

    // Create default variant for inventory tracking
    await prisma.productVariant.create({
      data: {
        productId: product.id,
        optionName: "Default",
        optionValue: "Standard",
        stock: formData.stock,
        price: formData.price,
      },
    });

    // Audit log
    await logActivity({
      adminId: admin.id,
      action: "PRODUCT_CREATED",
      entityType: "Product",
      entityId: product.id,
      metadata: {
        name: product.name,
        price: product.price,
        stock: formData.stock,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true, productId: product.id };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[createProduct] Error:", err);
    return { success: false, error: err.message || "Failed to create product" };
  }
}

export async function updateProduct(
  id: string,
  formData: {
    name: string;
    description?: string;
    price: number;
    mrp: number;
    categoryId: string;
    lowStockThreshold?: number;
    imageUrl?: string;
    stock: number; // updates the default/first variant
    isActive?: boolean;
    isFeatured?: boolean;
  }
) {
  const admin = await requireAdmin();

  try {
    const slug = await getUniqueSlug(formData.name, id);

    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: formData.name,
        slug,
        description: formData.description ?? null,
        price: formData.price,
        mrp: formData.mrp,
        categoryId: formData.categoryId,
        lowStockThreshold: formData.lowStockThreshold ?? 10,
        isActive: formData.isActive ?? true,
        isFeatured: formData.isFeatured ?? false,
      },
      include: {
        images: true,
        variants: true,
      },
    });

    // Handle primary image update
    if (formData.imageUrl) {
      const primaryImage = product.images.find((img) => img.isPrimary);
      if (primaryImage) {
        await prisma.productImage.update({
          where: { id: primaryImage.id },
          data: { url: formData.imageUrl },
        });
      } else {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: formData.imageUrl,
            alt: formData.name,
            isPrimary: true,
          },
        });
      }
    }

    // Update default variant or first variant stock/price
    if (product.variants.length > 0) {
      await prisma.productVariant.update({
        where: { id: product.variants[0].id },
        data: {
          stock: formData.stock,
          price: formData.price,
        },
      });
    } else {
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          optionName: "Default",
          optionValue: "Standard",
          stock: formData.stock,
          price: formData.price,
        },
      });
    }

    // Audit log
    await logActivity({
      adminId: admin.id,
      action: "PRODUCT_UPDATED",
      entityType: "Product",
      entityId: product.id,
      metadata: {
        name: product.name,
        price: product.price,
        stock: formData.stock,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}`);
    revalidatePath("/products");
    revalidatePath(`/products/${product.slug}`);
    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[updateProduct] Error:", err);
    return { success: false, error: err.message || "Failed to update product" };
  }
}

export async function toggleProductActive(id: string, isActive: boolean) {
  const admin = await requireAdmin();

  try {
    const product = await prisma.product.update({
      where: { id },
      data: { isActive },
    });

    await logActivity({
      adminId: admin.id,
      action: isActive ? "PRODUCT_ACTIVATED" : "PRODUCT_DEACTIVATED",
      entityType: "Product",
      entityId: id,
      metadata: { name: product.name },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[toggleProductActive] Error:", err);
    return { success: false, error: err.message || "Failed to toggle active status" };
  }
}

export async function toggleProductFeatured(id: string, isFeatured: boolean) {
  const admin = await requireAdmin();

  try {
    const product = await prisma.product.update({
      where: { id },
      data: { isFeatured },
    });

    await logActivity({
      adminId: admin.id,
      action: isFeatured ? "PRODUCT_FEATURED" : "PRODUCT_UNFEATURED",
      entityType: "Product",
      entityId: id,
      metadata: { name: product.name },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[toggleProductFeatured] Error:", err);
    return { success: false, error: err.message || "Failed to toggle featured status" };
  }
}

export async function deleteProduct(id: string) {
  const admin = await requireAdmin();

  try {
    // Soft delete product by setting active = false
    const product = await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    // Audit log
    await logActivity({
      adminId: admin.id,
      action: "PRODUCT_DELETED",
      entityType: "Product",
      entityId: id,
      metadata: { name: product.name, note: "Soft deleted by setting active to false" },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[deleteProduct] Error:", err);
    return { success: false, error: err.message || "Failed to delete product" };
  }
}

export async function updateProductStock(productId: string, newStock: number) {
  const admin = await requireAdmin();

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { variants: true }
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    if (product.variants.length > 0) {
      await prisma.productVariant.update({
        where: { id: product.variants[0].id },
        data: { stock: newStock },
      });
    } else {
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          optionName: "Default",
          optionValue: "Standard",
          stock: newStock,
          price: product.price,
        },
      });
    }

    // Audit log
    await logActivity({
      adminId: admin.id,
      action: "PRODUCT_STOCK_UPDATED",
      entityType: "Product",
      entityId: productId,
      metadata: {
        name: product.name,
        newStock,
      },
    });

    revalidatePath("/admin/inventory");
    revalidatePath("/admin/products");
    revalidatePath("/admin/dashboard");
    revalidatePath("/products");
    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[updateProductStock] Error:", err);
    return { success: false, error: err.message || "Failed to update stock" };
  }
}
