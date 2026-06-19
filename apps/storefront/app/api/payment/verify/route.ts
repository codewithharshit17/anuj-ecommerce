import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
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
          verified: false,
          error: "Authentication required.",
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
          verified: false,
          error: "Invalid payment payload.",
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
          verified: false,
          error: "Payment verification failed.",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json({
      success: true,
      verified: true,
      razorpay_order_id: body.razorpay_order_id,
      razorpay_payment_id: body.razorpay_payment_id,
    });
  } catch (error) {
    console.error(
      "[verify-razorpay-payment] Unexpected error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        verified: false,
        error: "Internal server error.",
      },
      {
        status: 500,
      }
    );
  }
}