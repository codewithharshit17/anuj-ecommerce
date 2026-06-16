# KAPI — Stationery E-Commerce Storefront

A full-stack e-commerce platform built for **KAPI Pen & Stationery**, an Indian pen and stationery retail business. The storefront delivers a modern, mobile-first shopping experience inspired by the design and UX patterns of India's leading stationery stores, paired with a fully functional admin dashboard for day-to-day store management.

---

## What It Is

KAPI is a production-grade online stationery store where customers can browse hundreds of products across categories like pens, notebooks, art supplies, and office essentials, add items to a persistent cart, and place orders with Cash on Delivery. The platform is built with a clear separation between the public-facing storefront and a private admin panel accessible only to the store owner.

---

## Storefront

Customers can explore the full product catalog without signing in. Browsing, searching, and reading product details is completely open. Authentication is only required at the point of purchase — when a customer adds something to their cart or proceeds to checkout, they are prompted to sign in or create an account. After login, the cart action completes automatically and checkout continues without interruption.

The homepage mirrors the layout and section structure of India's top stationery retailers, with a hero carousel, category grids for stationery, office supplies, and art supplies, promotional banners, a budget filter section, a customer reviews carousel, and a blog section. Every product page includes an image gallery with zoom, variant selection, stock indicators, and a related products carousel.

---

## Admin Dashboard

The store owner accesses a private dashboard through a magic link sent to their email — no password required. From the dashboard they can add and manage products with image uploads, track and update order statuses through a fulfilment pipeline, view revenue stats and a sales chart, and manage product collections and categories. The dashboard is designed to feel familiar, with a sidebar layout and data tables modelled after accounting tools the business already uses.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15, App Router, TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| Animation | Framer Motion |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| State | Zustand (cart) |
| Payments | Cash on Delivery (Razorpay in next phase) |
| Deployment | Vercel |

---

## Key Features

**Customer side**

Guest browsing across all collections and product pages with no login required. Auth gate triggers only at cart and checkout. Persistent cart that survives page refreshes and merges after login. Multi-step checkout with Indian address fields and COD payment. Order confirmation page with order tracking. Customer account page showing order history.

**Admin side**

Magic link authentication — no password, no brute force surface. Product management with image upload to Supabase Storage, pricing, stock tracking, and variant support. Order management with a status pipeline from pending through to delivered. Revenue dashboard with sales chart and low stock alerts. Collection and category management.

**Platform**

Row Level Security on every database table. Server-side price calculation — client-sent prices are never trusted. Fully responsive at 375px. Optimised images via Supabase CDN. SEO metadata generated per product and collection page.

---

## Getting Started

```bash
git clone https://github.com/your-username/kapi-stationery
cd kapi-stationery
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Run the database schema and RLS policies from `supabase/schema.sql` in your Supabase SQL editor, then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the storefront and [http://localhost:3000/admin](http://localhost:3000/admin) for the dashboard.

---

## Project Structure

```
src/
├── app/
│   ├── (store)/          # public storefront routes
│   └── admin/            # protected admin routes
├── components/
│   ├── store/            # customer-facing UI
│   └── admin/            # admin dashboard UI
└── lib/
    ├── supabase/          # client, server, middleware
    ├── actions.ts         # server actions
    ├── queries.ts         # data fetching
    └── cart-store.ts      # Zustand cart
```

---

## Deployment

The project deploys to Vercel with zero configuration. Add the three environment variables in the Vercel dashboard, connect the repository, and deploy. The Supabase project handles the database, authentication, and image storage independently.

---

*Built with Next.js 15 and Supabase.*