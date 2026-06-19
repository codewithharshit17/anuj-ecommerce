import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const checkoutCartInclude = {
  items: {
    include: {
      product: true,
      variant: true,
    },
  },
} satisfies Prisma.CartInclude;

type CheckoutCart = Prisma.CartGetPayload<{
  include: typeof checkoutCartInclude;
}>;

type CheckoutAddress = Prisma.AddressGetPayload<Record<string, never>>;

export interface CheckoutValidationResult {
  valid: boolean;
  cart: CheckoutCart | null;
  address: CheckoutAddress | null;
  subtotal: number;
  total: number;
  errors: string[];
}

export async function validateCheckout(
  userId: string
): Promise<CheckoutValidationResult> {
  const errors: string[] = [];

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    return {
      valid: false,
      cart: null,
      address: null,
      subtotal: 0,
      total: 0,
      errors: ["User does not exist."],
    };
  }

  const [cart, address] = await Promise.all([
    prisma.cart.findUnique({
      where: { userId },
      include: checkoutCartInclude,
    }),
    prisma.address.findFirst({
      where: {
        userId,
        isDefault: true,
      },
    }),
  ]);

  if (!cart) {
    errors.push("Cart does not exist.");
  } else if (cart.items.length === 0) {
    errors.push("Cart is empty.");
  }

  if (!address) {
    errors.push("Default address is required.");
  }

  const subtotal =
    cart?.items.reduce((sum, item) => {
      if (!item.product) {
        errors.push(`Product no longer exists: ${item.productId}.`);
        return sum;
      }

      if (item.variantId && !item.variant) {
        errors.push(
          `Product variant no longer exists: ${item.variantId}.`
        );
        return sum;
      }

      const unitPrice = item.variant?.price ?? item.product.price;

      if (
        unitPrice === null ||
        unitPrice === undefined ||
        Number.isNaN(Number(unitPrice)) ||
        Number(unitPrice) <= 0
      ) {
        errors.push(
          `Invalid price detected for product: ${item.product.name}.`
        );
        return sum;
      }

      return sum + Number(unitPrice) * item.quantity;
    }, 0) ?? 0;

  const total = subtotal;

  return {
    valid: errors.length === 0,
    cart,
    address,
    subtotal,
    total,
    errors,
  };
}