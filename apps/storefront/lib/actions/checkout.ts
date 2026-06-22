"use server";

import prisma from "@/lib/prisma";
import { validateCheckout } from "@/lib/checkout/validate-checkout";
import { generateOrderNumber } from "@/lib/orders/generate-order-number";
import { OrderStatus, PaymentStatus, PaymentMethod } from "@prisma/client";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { createClient } from "@/lib/supabase/server";

export interface CheckoutDetailsResult {
  success: boolean;
  originalSubtotal: number;
  discountAmount: number;
  offers: {
    id: string;
    title: string;
    description: string;
  }[];
}

/**
 * Calculates pricing details and matches active promotions and salePrice drops for the checkout.
 */
export async function getCheckoutDetails(
  cartItems: { id: string; quantity: number }[]
): Promise<CheckoutDetailsResult> {
  try {
    const productIds = cartItems.map((item) => item.id);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        category: true,
      },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));
    const categoryIds = Array.from(new Set(products.map((p) => p.categoryId)));

    let originalSubtotal = 0;
    let discountAmount = 0;

    for (const item of cartItems) {
      const product = productMap.get(item.id);
      if (product) {
        const originalPrice = product.price;
        const activePrice =
          product.salePrice !== null && product.salePrice !== undefined
            ? product.salePrice
            : product.price;

        originalSubtotal += originalPrice * item.quantity;
        if (product.salePrice !== null && product.salePrice !== undefined) {
          discountAmount += (originalPrice - product.salePrice) * item.quantity;
        }
      }
    }

    // Load active promotions from database
    const now = new Date();
    const activePromotions = await prisma.promotion.findMany({
      where: {
        isActive: true,
        isDeleted: false,
        startDate: { lte: now },
        endDate: { gte: now },
        OR: [
          {
            redirectType: "PRODUCT",
            redirectId: { in: productIds },
          },
          {
            redirectType: "CATEGORY",
            redirectId: { in: categoryIds },
          },
        ],
      },
      orderBy: {
        displayOrder: "asc",
      },
    });

    const offers: { id: string; title: string; description: string }[] = [];

    // Add matched active promotions
    for (const promo of activePromotions) {
      offers.push({
        id: promo.id,
        title: `🏷️ ${promo.title}`,
        description: promo.subtitle || promo.description || "Active promotion",
      });
    }

    // Add active product salePrice drops
    for (const item of cartItems) {
      const product = productMap.get(item.id);
      if (product && product.salePrice !== null && product.salePrice !== undefined) {
        const discountPct = Math.round(
          ((product.price - product.salePrice) / product.price) * 100
        );
        offers.push({
          id: `sale-${product.id}`,
          title: `🔥 ${product.name} (${discountPct}% OFF)`,
          description: "Limited time sale price drop",
        });
      }
    }

    return {
      success: true,
      originalSubtotal,
      discountAmount,
      offers,
    };
  } catch (error) {
    console.error("[getCheckoutDetails] Error:", error);
    return {
      success: false,
      originalSubtotal: 0,
      discountAmount: 0,
      offers: [],
    };
  }
}

/**
 * Extensible check for COD eligibility (Order Total > 0 and future rules slot).
 */
export async function checkCodEligibility(
  userId: string,
  totalAmount: number
) {
  if (totalAmount <= 0) {
    return { eligible: false, reason: "Order total must be greater than zero for Cash on Delivery." };
  }

  // Extensible placeholder:
  // - Minimum COD Amount
  // - Maximum COD Amount
  // - PIN Code Restrictions

  return { eligible: true };
}



interface CreateOrderParams {
  userId: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
}

/**
 * Shared transaction logical block to create an order, reduce stock, and clear cart.
 * Reused by both verify payment route and Cash on Delivery action.
 */
export async function createOrderFromCart(params: CreateOrderParams) {
  return prisma.$transaction(async (tx) => {
    // 1. Prevent duplicate orders for ONLINE payments if transaction signature verified already
    if (params.razorpayPaymentId) {
      const existingOrder = await tx.order.findUnique({
        where: {
          razorpayPaymentId: params.razorpayPaymentId,
        },
        select: {
          id: true,
          orderNumber: true,
        },
      });

      if (existingOrder) {
        return existingOrder;
      }
    }

    // 2. Load user's cart
    const cart = await tx.cart.findUnique({
      where: {
        userId: params.userId,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                variants: true,
              },
            },
            variant: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty.");
    }

    // 3. Map order items
    const orderItems = cart.items.map((item) => {
      const price =
        item.product.salePrice !== null && item.product.salePrice !== undefined
          ? item.product.salePrice
          : item.variant?.price ?? item.product.price;

      if (!Number.isFinite(price) || price <= 0) {
        throw new Error(`Invalid price for ${item.product.name}`);
      }

      const defaultVariant = item.variant || item.product.variants[0];
      if (!defaultVariant) {
        throw new Error(`Variant not found for product ${item.product.name}`);
      }

      if (item.quantity > defaultVariant.stock) {
        throw new Error(`Insufficient stock for ${item.product.name}`);
      }

      return {
        productId: item.productId,
        variantId: item.variantId || defaultVariant.id,
        quantity: item.quantity,
        price,
      };
    });

    // 4. Decrement stock for variants
    for (const item of orderItems) {
      const targetVariantId = item.variantId;
      if (!targetVariantId) {
        throw new Error("Variant ID missing for stock decrement.");
      }

      const variant = await tx.productVariant.findUnique({
        where: { id: targetVariantId },
        select: { stock: true },
      });

      if (!variant) {
        throw new Error("Variant not found for stock decrement.");
      }

      if (variant.stock < item.quantity) {
        throw new Error(`Insufficient stock for variant.`);
      }

      await tx.productVariant.update({
        where: { id: targetVariantId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    const totalAmount = params.subtotal - params.discountAmount + params.shippingFee;

    // 5. Create order record
    const order = await tx.order.create({
      data: {
        userId: params.userId,
        orderNumber: generateOrderNumber(),
        subtotal: params.subtotal,
        discountAmount: params.discountAmount,
        shippingFee: params.shippingFee,
        totalAmount,
        status: params.status,
        paymentStatus: params.paymentStatus,
        paymentMethod: params.paymentMethod,
        razorpayOrderId: params.razorpayOrderId ?? null,
        razorpayPaymentId: params.razorpayPaymentId ?? null,
        items: {
          create: orderItems,
        },
      },
      select: {
        id: true,
        orderNumber: true,
      },
    });

    // 6. Delete cart items
    await tx.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    return order;
  });
}

/**
 * Server Action to create a COD order securely.
 */
export async function createCodOrderAction(deliveryMethod: string = "standard") {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Authentication required." };
    }

    // Reuse existing checkout validation
    const checkout = await validateCheckout(user.id, deliveryMethod);
    if (!checkout.valid) {
      return { success: false, error: checkout.errors.join(" ") };
    }

    // Enforce COD eligibility check
    const codCheck = await checkCodEligibility(user.id, checkout.total);
    if (!codCheck.eligible) {
      return { success: false, error: codCheck.reason || "Not eligible for Cash on Delivery." };
    }

    // Call unified order creator (status = PENDING, paymentStatus = PENDING, paymentMethod = COD)
    const order = await createOrderFromCart({
      userId: user.id,
      paymentMethod: PaymentMethod.COD,
      paymentStatus: PaymentStatus.PENDING,
      status: OrderStatus.PENDING,
      subtotal: checkout.subtotal,
      discountAmount: checkout.discount,
      shippingFee: checkout.shipping,
    });

    // Trigger non-blocking email confirmation sending
    sendOrderConfirmationEmail({ orderId: order.id }).catch((err) => {
      console.error("[createCodOrderAction] confirmation email sending failed:", err);
    });

    return {
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
    };
  } catch (error: any) {
    console.error("[createCodOrderAction] Unexpected error:", error);
    return {
      success: false,
      error: error.message || "Failed to create Cash on Delivery order.",
    };
  }
}
