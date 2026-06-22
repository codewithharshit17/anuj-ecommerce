# Phase 8 — Email Infrastructure & Transactional Customer Emails

This document details the architecture, configuration, trigger points, and future expansion strategies for the transactional email system in the **PMS** platform.

## Architecture

The email system follows a clean, decoupled layer architecture:

```
  Database (Prisma)  ──>  Trigger Point (Server Action/Route)
                                   │
                                   ▼
                         Email Service Layer (send-email.ts)
                                   │
                                   ▼
                         React Email Template (templates/*)
                                   │
                                   ▼
                            Resend Provider
```

### Key Principles

1. **Non-Blocking Execution:** All email operations are run asynchronously in a non-blocking manner using promise catch handlers or decoupled await blocks. If Resend returns an error or fails, the host operation (user signup, checkout verification, order status changes) will complete successfully.
2. **Centralized Client:** Direct imports of `resend` client are isolated within the `lib/email` module. Other application modules trigger emails through high-level functions like `sendWelcomeEmail` or `sendOrderConfirmationEmail`.
3. **Toggle Control:** An optional `EMAIL_ENABLED` flag lets developers bypass Resend calls entirely in staging, local dev, or testing environments.

---

## Folder Structure

All email infrastructure is contained in `apps/storefront/lib/email`:

```text
lib/email/
├── resend.ts          # Resend client initialization & error validation
├── send-email.ts      # Main exportable email service triggers
├── index.ts           # Unified module entrypoint
├── types.ts           # Interface declarations for email payloads
└── templates/         # React Email components
    ├── welcome-email.tsx        # Welcome email template
    ├── order-confirmation.tsx  # Order confirmation receipt template
    └── order-status.tsx        # Order status notification template
```

---

## Environment Variables

The following variables must be added to your `.env` file for storefront:

```env
# Email Configuration (Resend)
RESEND_API_KEY="re_..."
EMAIL_FROM="onboarding@resend.dev"
EMAIL_ENABLED="true"
```

* **`RESEND_API_KEY`**: Obtain from the Resend Dashboard. If `EMAIL_ENABLED` is true, this is required.
* **`EMAIL_FROM`**: The sender identity. Free/onboarding accounts should use `onboarding@resend.dev`. Production domains should use `noreply@yourdomain.com`.
* **`EMAIL_ENABLED`**: Default is true. Set to `false` to disable outbox sending and log email contents directly to the console instead.

---

## Trigger Points

The system triggers emails dynamically at the following application junctions:

### 1. Signup Welcome Email
* **Location:** `lib/actions/auth/signup.ts`
* **Flow:** Triggered immediately after the new user is synced to the Prisma DB `User` table from Supabase auth.
* **Payload:** `{ email: string; firstName: string }`

### 2. Order Confirmation Email
* **Location:** `app/api/payment/verify/route.ts`
* **Flow:** Triggered inside the Razorpay transaction confirmation callback after the payment verification finishes and the `Order` record is committed to the database.
* **Payload:** `{ orderId: string }` (The database is queried inside the service to construct the detailed line item list, prices, and shipping address).

### 3. Order Status Email
* **Location:** `lib/actions/admin-orders.ts`
* **Flow:** Triggered when the admin updates an order status to one of: `PROCESSING`, `SHIPPED`, or `DELIVERED`.
* **Payload:** `{ orderId: string; status: OrderStatus }`

---

## Verification & Testing Guide

To test email triggers locally:

1. Enable sending in `.env`:
   ```env
   EMAIL_ENABLED="true"
   RESEND_API_KEY="YOUR_KEY"
   EMAIL_FROM="onboarding@resend.dev"
   ```
   *Note: If using onboarding@resend.dev, you can only send emails to the email address registered on your Resend account.*

2. Run a test signup or transaction, or use a scratch script to check email templates directly.

---

## Future Expansion Strategy

If you need to support additional transaction types in the future (e.g. password resets, inventory alerts):

1. **Add Interface:** Define props in `lib/email/types.ts`.
2. **Create Template:** Add a React Email file under `lib/email/templates/`.
3. **Create Helper:** Add a new `sendXEmail` function in `lib/email/send-email.ts`.
4. **Trigger:** Import and execute the function in the target controller/action.
