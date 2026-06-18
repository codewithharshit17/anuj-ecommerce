# KAPI PEN - Phase 2.5 Database Foundation

## Overview

Phase 2.5 established the complete database foundation for KAPI PEN using:

* Supabase PostgreSQL
* Prisma ORM
* Next.js 15
* TypeScript

The storefront is now fully database-driven and no longer relies on hardcoded or mock product data.

---

# Final Architecture

```text
Frontend
├── Next.js 15
├── Tailwind CSS
├── Shadcn UI
├── Framer Motion

Database
├── Supabase PostgreSQL

ORM
├── Prisma 6.15

Authentication
├── Supabase Auth (Phase 3)

Storage
├── Cloudinary (Future)

Payments
├── Razorpay (Future)
```

---

# Database Models

## Implemented Models

```text
User
Address

Category
Product
ProductImage
ProductVariant

Cart
CartItem

Wishlist
WishlistItem

Order
OrderItem
```

---

## User

Stores customer profile information.

### Relations

```text
User
├── Addresses
├── Cart
├── Wishlist
└── Orders
```

---

## Address

Stores multiple delivery addresses for a user.

---

## Category

Stores product categories.

### Current Categories

```text
Pens
Pencils
Notebooks
Drawing Books
Balloons
```

---

## Product

Stores core product information.

### Fields

```text
Name
Slug
Description
Price
MRP
Featured Status
Category
```

---

## ProductImage

Supports multiple images per product.

---

## ProductVariant

Supports:

```text
Color
Size
Pack Size
SKU
Inventory Tracking
```

Acts as the inventory source of truth.

---

## Cart

Stores a user's active shopping cart.

---

## CartItem

Stores products added to cart.

Supports:

```text
Product
Variant
Quantity
```

---

## Wishlist

Stores a user's wishlist.

---

## WishlistItem

Stores products saved by users.

Supports:

```text
Product
Variant
```

---

## Order

Stores customer purchases.

Supports:

```text
Order Status
Payment Status
Razorpay Integration
Totals
```

---

## OrderItem

Stores purchase snapshots.

Important:

```text
Price at purchase time is preserved.
```

This prevents future price changes from affecting historical orders.

---

# Supabase Connection Strategy

## DATABASE_URL

Used for:

```text
Runtime Queries
Storefront Queries
Prisma Client
```

Uses:

```text
Supabase Pooler URL
```

---

## DIRECT_URL

Used for:

```text
Migrations
Schema Updates
Prisma Generate
```

Uses:

```text
Supabase Direct Database URL
```

---

## Why?

Avoids:

```text
prepared statement already exists
```

errors.

---

# Important Project Files

## prisma/schema.prisma

Contains:

```text
Database Models
Relationships
Indexes
Enums
Constraints
```

---

## prisma/seed.ts

Seeds:

```text
Categories
Products
Images
Variants
```

Uses:

```ts
upsert()
```

to avoid duplicate seed failures.

---

## src/lib/prisma.ts

Singleton Prisma Client.

Purpose:

```text
Prevent Hot Reload Connection Leaks
Prevent Multiple Prisma Instances
Production Safe
```

---

## src/lib/actions/product-actions.ts

Database Query Layer.

Functions:

```ts
getProducts()
getProductBySlug()
getProductsByCategory()
getFeaturedProducts()
```

---

## src/lib/db-health.ts

Database Health Verification.

Function:

```ts
checkDatabaseConnection()
```

---

# Storefront Migration Completed

## Removed

```text
lib/medusa/
Mock Product Data
Hardcoded Product Arrays
```

---

## Migrated Components

```text
ProductCard.tsx
ProductCarousel.tsx
ProductGrid.tsx
BudgetSection.tsx
CartDrawer.tsx
CartItem.tsx
Header.tsx
```

---

## Migrated Pages

```text
/products
/products/[slug]
/collections/[slug]
```

All now read data directly from PostgreSQL.

---

# Verification Results

## Migration Status

Command:

```bash
npx prisma migrate status
```

Result:

```text
Database schema is up to date
```

Status:

```text
PASSED
```

---

## Prisma Studio

Command:

```bash
npx prisma studio
```

Result:

```text
All Models Visible
```

Status:

```text
PASSED
```

---

## Seed Execution

Command:

```bash
npx prisma db seed
```

Result:

```text
Categories Seeded
Products Seeded
Variants Seeded
Images Seeded
```

Status:

```text
PASSED
```

---

## Frontend Verification

Test:

```text
Modify Product In Database
Refresh UI
```

Result:

```text
UI Updated Instantly
```

Status:

```text
PASSED
```

---

## Final Proof

Verified:

```text
Frontend
    ↓
Prisma
    ↓
Supabase PostgreSQL
```

is working correctly.

No mock data remains.

---

# Commands Used During Setup

## Install Prisma

```bash
npm install prisma@6.15.0 @prisma/client@6.15.0
```

---

## Initialize Prisma

```bash
npx prisma init
```

---

## Validate Schema

```bash
npx prisma validate
```

---

## Generate Prisma Client

```bash
npx prisma generate
```

---

## Create Initial Migration

```bash
npx prisma migrate dev --name init
```

---

## Check Migration Status

```bash
npx prisma migrate status
```

---

## Open Prisma Studio

```bash
npx prisma studio
```

---

## Run Seed Script

```bash
npx prisma db seed
```

---

## Run Seed Directly

```bash
npx tsx prisma/seed.ts
```

---

## Run Health Check

```bash
npx tsx src/lib/db-health.ts
```

---

# Common Issues & Fixes

## Error

```text
prepared statement already exists
```

### Fix

Use:

```env
DATABASE_URL=POOLER_URL
DIRECT_URL=DIRECT_DATABASE_URL
```

and:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

---

## Error

```text
Unique constraint failed
```

### Fix

Use:

```ts
upsert()
```

instead of:

```ts
create()
```

inside seed scripts.

---

## Error

```text
Products not updating
```

### Fix

Verify components use Prisma queries instead of hardcoded arrays.

---

## Error

```text
Broken Images
```

### Fix

Verify ProductImage URLs.

Add fallback image support.

---

# Current Project Progress

```text
Phase 0 - Environment Setup
✅ 100%

Phase 1 - Frontend UI
✅ 95%

Phase 2 - Shopping Experience
✅ 90%

Phase 2.5 - Database Foundation
✅ 100%

Phase 3 - Authentication
⏳ Next

Phase 4 - Customer Features
⏳ Pending

Phase 5 - Orders + Razorpay
⏳ Pending

Phase 6 - Admin Dashboard
⏳ Pending
```

---

# Next Phase

## Phase 3 - Authentication

Implement:

```text
Supabase Auth
Email Signup
Email Login
Google Login
Logout
Protected Routes
Session Management
```

This unlocks:

```text
Wishlist
User Profiles
Saved Addresses
Order History
Checkout
```

---

# Final Milestone Achieved

```text
Frontend
    ↓
Prisma
    ↓
Supabase PostgreSQL
```

✅ Database Connected

✅ Seeded

✅ Verified

✅ Storefront Integrated

✅ Production Ready

Phase 2.5 Complete 🚀
