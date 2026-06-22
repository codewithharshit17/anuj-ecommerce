import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/orders/generate-order-number";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { sendOrderConfirmationEmail } from "@/lib/email";

interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

class PaymentVerificationError extends Error {
  constructor(
    message: string,
    readonly status: number = 400
  ) {
    super(message);
    this.name = "PaymentVerificationError";
  }
}

function isVerifyPaymentPayload(
  value: unknown
): value is VerifyPaymentPayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Record<string, unknown>;

  return (
    typeof payload.razorpay_order_id === "string" &&
    payload.razorpay_order_id.trim().length > 0 &&
    typeof payload.razorpay_payment_id === "string" &&
    payload.razorpay_payment_id.trim().length > 0 &&
    typeof payload.razorpay_signature === "string" &&
    payload.razorpay_signature.trim().length > 0
  );
}

function getRazorpayKeySecret(): string {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    throw new Error(
      "Missing required Razorpay environment variable: RAZORPAY_KEY_SECRET"
    );
  }

  return keySecret;
}

function verifyRazorpaySignature(
  payload: VerifyPaymentPayload
): boolean {
  try {
    const expectedSignature = createHmac(
      "sha256",
      getRazorpayKeySecret()
    )
      .update(
        `${payload.razorpay_order_id}|${payload.razorpay_payment_id}`
      )
      .digest("hex");

    const expected = Buffer.from(expectedSignature, "hex");
    const received = Buffer.from(
      payload.razorpay_signature,
      "hex"
    );

    if (expected.length !== received.length) {
      return false;
    }

    return timingSafeEqual(expected, received);
  } catch (error) {
    console.error(
      "[verify-razorpay-signature] Invalid signature payload:",
      error
    );

    return false;
  }
}


async function createOrderFromVerifiedPayment(
  userId: string,
  payload: VerifyPaymentPayload
) {
  return prisma.$transaction(async (tx) => {
    // Prevent duplicate orders for the same payment
    const existingOrder = await tx.order.findUnique({
      where: {
        razorpayPaymentId: payload.razorpay_payment_id,
      },
      select: {
        id: true,
        orderNumber: true,
      },
    });

    if (existingOrder) {
      return existingOrder;
    }

    const cart = await tx.cart.findUnique({
      where: {
        userId,
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
      throw new PaymentVerificationError("Cart is empty.");
    }

    const orderItems = cart.items.map((item) => {
      const price = item.product.salePrice !== null && item.product.salePrice !== undefined 
        ? item.product.salePrice 
        : (item.variant?.price ?? item.product.price);

      if (!Number.isFinite(price) || price <= 0) {
        throw new PaymentVerificationError(
          `Invalid price for ${item.product.name}`
        );
      }

      // Stock validation
      const defaultVariant = item.variant || item.product.variants[0];
      if (!defaultVariant) {
        throw new PaymentVerificationError(
          `Variant not found for product ${item.product.name}`
        );
      }

      if (item.quantity > defaultVariant.stock) {
        throw new PaymentVerificationError(
          `Insufficient stock for ${item.product.name}`
        );
      }

      return {
        productId: item.productId,
        variantId: item.variantId || defaultVariant.id,
        quantity: item.quantity,
        price,
      };
    });

    // Decrement stock for each variant and check to prevent negative inventory
    for (const item of orderItems) {
      const targetVariantId = item.variantId;
      if (!targetVariantId) {
        throw new PaymentVerificationError("Variant ID missing for stock decrement.");
      }

      const variant = await tx.productVariant.findUnique({
        where: { id: targetVariantId },
        select: { stock: true },
      });

      if (!variant) {
        throw new PaymentVerificationError("Variant not found for stock decrement.");
      }

      if (variant.stock < item.quantity) {
        throw new PaymentVerificationError(`Insufficient stock for variant.`);
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

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await tx.order.create({
      data: {
        userId,
        orderNumber: generateOrderNumber(),
        totalAmount,
        status: OrderStatus.PROCESSING,
        paymentStatus: PaymentStatus.COMPLETED,
        razorpayOrderId: payload.razorpay_order_id,
        razorpayPaymentId: payload.razorpay_payment_id,
        items: {
          create: orderItems,
        },
      },
      select: {
        id: true,
        orderNumber: true,
      },
    });

    await tx.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    return order;
  });
}


export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        {
          success: false,
        },
        {
          status: 401,
        }
      );
    }

    const body: unknown = await request.json().catch(() => null);

    if (!isVerifyPaymentPayload(body)) {
      return NextResponse.json(
        {
          success: false,
        },
        {
          status: 400,
        }
      );
    }

    const isValidSignature = verifyRazorpaySignature(body);

    if (!isValidSignature) {
      return NextResponse.json(
        {
          success: false,
        },
        {
          status: 400,
        }
      );
    }

    
    const order = await createOrderFromVerifiedPayment(user.id, body);

    // Non-blocking order confirmation email trigger
    sendOrderConfirmationEmail({ orderId: order.id }).catch((err) => {
      console.error("[verify] Order confirmation email sending failed:", err);
    });

    return NextResponse.json({
      success: true,
      verified: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    if (error instanceof PaymentVerificationError) {
      return NextResponse.json(
        {
          success: false,
        },
        {
          status: error.status,
        }
      );
    }

    console.error(
      "[verify-razorpay-payment] Unexpected error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}
