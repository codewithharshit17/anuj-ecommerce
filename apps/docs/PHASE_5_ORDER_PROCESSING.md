# PHASE_5_ORDER_PROCESSING.md

# KAPI PEN — Phase 5 Documentation

Version: v0.5-order-processing-complete
Status: Completed ✅

---

# Overview

Phase 5 transforms KAPI PEN from an authenticated ecommerce platform into a fully functional online store capable of accepting payments and creating orders.

Implemented Features:

* Checkout Validation
* Razorpay Integration
* Payment Verification
* Order Creation
* Order History Integration
* Cart Cleanup After Purchase
* Order Number Generation

---

# Architecture

```text
Customer Checkout
        │
        ▼
Checkout Validation
        │
        ▼
Create Razorpay Order
        │
        ▼
Razorpay Payment Modal
        │
        ▼
Payment Success
        │
        ▼
Payment Verification API
        │
        ▼
Signature Verification
        │
        ▼
Create Order
Create Order Items
Clear Cart
        │
        ▼
Success Page
        │
        ▼
Order History
```

---

# Environment Variables

Required Variables

```env
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
```

Example:

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxx
```

After updating:

```bash
npm run dev
```

must be restarted.

---

# Database Changes

## Order Model

Added:

```prisma
orderNumber       String        @unique
razorpayOrderId   String?       @unique
razorpayPaymentId String?       @unique
```

Current Order Schema:

```prisma
model Order {
  id                String        @id @default(cuid())
  userId            String
  orderNumber       String        @unique
  status            OrderStatus   @default(PENDING)
  paymentStatus     PaymentStatus @default(PENDING)
  totalAmount       Float
  razorpayOrderId   String?       @unique
  razorpayPaymentId String?       @unique
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt
}
```

---

# Checkout Validation

File:

```text
lib/checkout/validate-checkout.ts
```

Responsibilities:

* Verify authenticated user
* Verify cart exists
* Verify cart contains items
* Verify default address exists
* Verify products exist
* Verify variants exist
* Calculate totals from database pricing

Returns:

```ts
{
  valid: boolean;
  cart: Cart | null;
  address: Address | null;
  subtotal: number;
  total: number;
  errors?: string[];
}
```

---

# Razorpay Setup

File:

```text
lib/razorpay/index.ts
```

Responsibilities:

* Initialize Razorpay SDK
* Validate environment variables
* Provide singleton Razorpay instance

---

# Order Number Generation

File:

```text
lib/orders/generate-order-number.ts
```

Format:

```text
KP-YYYYMMDD-XXXXXX
```

Example:

```text
KP-20260620-A35Z8D
```

---

# Create Payment Order API

Route:

```text
/api/payment/create-order
```

Method:

```http
POST
```

Responsibilities:

* Verify user session
* Validate checkout
* Calculate amount
* Create Razorpay order
* Return order details

Response:

```json
{
  "success": true,
  "orderId": "order_xxxxx",
  "amount": 12000,
  "currency": "INR"
}
```

Amount is returned in paise.

---

# Razorpay Checkout Flow

Frontend Checkout Page:

```text
/checkout
```

Flow:

```text
Place Order
      │
      ▼
Create Razorpay Order
      │
      ▼
Open Razorpay Modal
      │
      ▼
Successful Payment
      │
      ▼
Call Verify API
```

---

# Payment Verification API

Route:

```text
/api/payment/verify
```

Method:

```http
POST
```

Receives:

```json
{
  "razorpay_order_id": "",
  "razorpay_payment_id": "",
  "razorpay_signature": ""
}
```

---

# Signature Verification

Uses:

```ts
createHmac("sha256", RAZORPAY_KEY_SECRET)
```

Generated Signature:

```text
razorpay_order_id|razorpay_payment_id
```

Verified Using:

```ts
timingSafeEqual()
```

Purpose:

* Prevent payment tampering
* Verify Razorpay authenticity

---

# Order Creation

After successful verification:

```text
Verify Payment
       │
       ▼
Create Order
       │
       ▼
Create OrderItems
       │
       ▼
Clear Cart
```

Executed inside:

```ts
prisma.$transaction()
```

to ensure atomic database writes.

---

# Duplicate Payment Protection

Implemented:

```text
razorpayPaymentId
```

Validation:

```text
Existing Payment ID
       │
       ▼
Return Existing Order
```

Prevents duplicate orders.

---

# Order Status Flow

Current Flow:

```text
Payment Success
      │
      ▼
PROCESSING
      │
      ▼
SHIPPED
      │
      ▼
DELIVERED
```

Payment Status:

```text
PENDING
COMPLETED
FAILED
REFUNDED
```

Current successful payment state:

```text
Order Status: PROCESSING
Payment Status: COMPLETED
```

---

# Order History

Route:

```text
/account/orders
```

Displays:

* Order Number
* Products
* Quantity
* Price
* Total Amount
* Payment Status
* Order Status
* Razorpay Order ID

Data Source:

```text
Prisma Database
```

No placeholder data remains.

---

# Cart Cleanup

After successful order creation:

```ts
await tx.cartItem.deleteMany(...)
```

Result:

```text
Cart becomes empty
```

after payment success.

---

# Testing Checklist

Checkout Validation

```text
✅ Auth Required
✅ Address Required
✅ Cart Required
```

Payment

```text
✅ Razorpay Modal Opens
✅ Payment Completes
✅ Verification Passes
```

Database

```text
✅ Order Created
✅ Order Items Created
✅ Payment IDs Saved
```

Frontend

```text
✅ Success Page
✅ Orders Page
✅ Cart Cleared
```

Build Verification

```bash
npm run lint
npm run build
```

Result:

```text
PASS
PASS
```

---

# Release

Tag:

```text
v0.5-order-processing-complete
```

---

# Next Phase

Phase 6 — Admin Dashboard

Planned Modules:

* Admin Authentication
* Product Management
* Category Management
* Order Management
* Inventory Management
* Sales Analytics

Current Project Status:

```text
Phase 0  ✅
Phase 1  ✅
Phase 2  ✅
Phase 2.5 ✅
Phase 3  ✅
Phase 4  ✅
Phase 5  ✅

Ready for Phase 6 🚀
```
