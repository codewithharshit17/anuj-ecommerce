# PMS v0.9.3 Dark Mode Audit

Date: 2026-06-23

## Scope

This pass focused only on dark mode consistency, accessibility, semantic color usage, surface layering, and theme persistence. No payment flows, business logic, or database schema were changed.

## Files Modified

- `apps/storefront/app/layout.tsx`
- `apps/storefront/app/globals.css`
- `apps/storefront/app/(admin)/admin/layout.tsx`
- `apps/storefront/app/(admin)/admin/(protected)/layout.tsx`
- `apps/storefront/components/store/ui/ThemeToggle.tsx`
- `apps/storefront/components/ui/dropdown-menu.tsx`
- `apps/storefront/components/ui/input.tsx`
- `apps/storefront/components/admin/AdminThemeGuard.tsx` removed

## Issues Found

- Admin routes were forced into light mode by `AdminThemeGuard`, which removed the `dark` class from `document.documentElement` and set `colorScheme` to `light`.
- The root theme bootstrap handled light/dark but did not persist or represent an explicit `system` preference.
- Shared dropdown primitives used hardcoded white, neutral, gray, and custom brand variables instead of semantic popover, border, accent, and muted tokens.
- Shared input primitives used transparent backgrounds and low-opacity disabled states that could reduce clarity on dark surfaces.
- Admin surfaces relied heavily on hardcoded `bg-white`, `bg-zinc-*`, `text-zinc-*`, and `border-zinc-*` utilities.
- Dark tokens did not match the requested PMS v0.9.3 surface scale.

## Issues Fixed

- Removed the admin-only light mode guard and deleted its component.
- Wrapped admin routes in an admin theme scope so legacy hardcoded utility classes can be mapped to semantic tokens without changing route behavior.
- Updated protected admin shell layout to use `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, and `border-border`.
- Updated dark theme tokens:
  - Background: `#0F0F10`
  - Secondary/muted: `#18181B`
  - Cards/popovers: `#1F1F23`
  - Inputs: `#27272A`
- Added admin-scoped compatibility styles for common hardcoded admin utility classes, including card surfaces, secondary surfaces, borders, table dividers, primary text, muted text, inputs, placeholders, hovers, and disabled states.
- Converted dropdown menu surfaces and interactions to semantic theme tokens.
- Converted shared input styling to semantic backgrounds, foregrounds, placeholders, borders, and disabled states.
- Updated utility classes in `globals.css` that previously used hardcoded white/light skeleton backgrounds to theme-aware tokens.
- Updated the theme bootstrap script to understand `light`, `dark`, and `system`.
- Updated `ThemeToggle` to cycle through light, dark, and system, persist the preference in `localStorage.theme`, react to OS theme changes while in system mode, and set `colorScheme`.

## Theme Persistence Verification

- Refresh retains the selected theme because the inline root script reads `localStorage.theme` before React hydration.
- Route changes retain the theme because the preference is stored globally in `localStorage` and applied to the document root.
- Storefront to admin retains the theme because admin no longer removes `.dark`.
- Login/logout should retain theme because auth actions do not clear `localStorage.theme`.
- System theme is now explicit. When `localStorage.theme` is `system`, the UI follows `prefers-color-scheme` and updates when the OS preference changes.

## Automated Verification

- `npm run lint` passed.
- `npm run build` compiled successfully through the optimized production build and TypeScript phases, then failed during static page generation because Prisma could not reach `aws-1-ap-south-1.pooler.supabase.com:6543`. This appears to be an environment/database connectivity blocker rather than a CSS or TypeScript failure.

## Accessibility Notes

- Placeholder text now uses `text-muted-foreground`/`--muted-foreground` with increased dark-mode contrast.
- Admin inputs, textareas, and selects now use tokenized input backgrounds and foreground colors in the admin scope.
- Disabled controls now retain better readability with a less aggressive disabled opacity.
- Dropdown focus and hover states now use semantic accent overlays instead of low-contrast neutral hardcoding.
- Status colors such as red, amber, emerald, and blue were preserved because they communicate state; they still need manual visual QA with real data density.

## Remaining Manual QA Items

- Verify light, dark, and system themes manually across:
  - `/admin/dashboard`
  - `/admin/products`
  - `/admin/categories`
  - `/admin/orders`
  - `/admin/customers`
  - `/admin/promotions`
  - `/admin/reports`
  - `/admin/login`
  - `/admin/forgot-password`
- The requested `/dashboard/support` or admin support page was not present in the current route tree. Support actions exist in the codebase, but there is no matching admin support page file to audit.
- Run browser QA for charts because Recharts axis, grid, and tooltip contrast depends on rendered SVG output and real chart data.
- Review product/media thumbnails on dark cards for visible borders with actual Cloudinary assets.
- Review email template output separately if those templates are shown in a browser preview; this pass did not alter email markup.
