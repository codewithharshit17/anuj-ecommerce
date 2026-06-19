-- Add order identifiers required after successful Razorpay payment verification.
ALTER TABLE "public"."Order" ADD COLUMN "orderNumber" TEXT;
ALTER TABLE "public"."Order" ADD COLUMN "razorpayPaymentId" TEXT;

-- Backfill existing rows before enforcing the new required order number.
UPDATE "public"."Order"
SET "orderNumber" = 'LEGACY-' || "id"
WHERE "orderNumber" IS NULL;

ALTER TABLE "public"."Order" ALTER COLUMN "orderNumber" SET NOT NULL;

CREATE UNIQUE INDEX "Order_orderNumber_key" ON "public"."Order"("orderNumber");
CREATE UNIQUE INDEX "Order_razorpayPaymentId_key" ON "public"."Order"("razorpayPaymentId");
