# IMPLEMENTATION_PLAN.md

## 1. Project Structure Overview
The Schault website is a Next.js (App Router) application built with React, Tailwind CSS, and Framer Motion, structured as a Single Page Application (SPA) on the frontend with Supabase integration.

- `app/` — Next.js App Router root directory.
  - `globals.css` — Global styles, Tailwind directives, and font imports.
  - `layout.tsx` — Root HTML layout, metadata, and body styles.
  - `page.tsx` — The main landing page assembling all visual sections.
  - `test-db/page.tsx` — A test route to verify Supabase DB connection and fetch products.
- `components/` — Reusable React components.
  - `Navbar.tsx` — Site navigation with mobile menu and sticky scroll state.
  - `ShoeScroll.tsx` — The core 3D-like, canvas-based scroll animation player using an image sequence.
  - `ScrollOverlays.tsx` — Text overlays synchronized with the `ShoeScroll` animation.
  - `ScrollProgressBar.tsx` — Visual progress indicator for the scroll animation.
  - `ShopSection.tsx` — Product display section with "Add to Cart" buttons.
  - `AboutSection.tsx` — "Our Story" context section.
  - `FAQ.tsx` — Expandable accordion for Frequently Asked Questions.
- `lib/api/` — API interaction layer.
  - `products.ts` — Houses `getProducts()` function to fetch active products and variants from Supabase.
- `utils/` — Utility functions.
  - `supabaseClient.ts` — Initializes the Supabase browser client for client-side queries.
- `public/` — Static assets (assumed to hold `/images/` and `/sequence/` based on references).
- `package.json` — Defines dependencies (React, Next.js, Framer Motion, Supabase UI/JS, Tailwind).
- `.env.local` — Present in the root, properly configured with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

---

## 2. Features Already Implemented
- **Smooth Landing Layout**: The visual shell for the homepage (`app/page.tsx`) with cohesive branding (Inter, Bebas fonts).
- **Advanced Scroll Animations**: A canvas-based frame-by-frame image sequencer (`ShoeScroll.tsx`) tied to scroll position using `framer-motion`, accompanied by synchronized text (`ScrollOverlays.tsx`) and a progress bar.
- **Client-Side DB Connectivity**: A working Supabase browser client (`supabaseClient.ts`) and a test page (`/test-db`) demonstrating successful retrieval of products and variants.
- **UI Components**:
  - Fully responsive, animated `Navbar` with mobile hamburger menu.
  - Accordion `FAQ` section using `framer-motion` for smooth layout shifts.
  - `ShopSection` with product cards and hover effects.
  - `AboutSection` with static branding content.

---

## 3. Features In Progress / Incomplete
- **Shop Data Integration**: `ShopSection.tsx` is completely built visually but relies on a hardcoded `PRODUCTS` array instead of using the existing `getProducts()` Supabase fetcher from `lib/api/products.ts`.
- **Navigation Links**: Multiple links in `Navbar.tsx` and the homepage CTA (`#`, `#explore`) are empty anchor tags.
- **Cart Interactions**: The "Add to Cart" and "Order Now" buttons exist visually but do not trigger any state changes or UI updates (no `onClick` handlers).

---

## 4. Missing Features / Gaps
Based on the tech stack and the nature of the project (e-commerce), the following expected core features are completely absent from the frontend:

- **Authentication Flows**: No Login, Registration, Password Reset, or OTP pages/modals. Supabase Auth is not currently implemented in the UI.
- **State Management**: No global state solution (e.g., Zustand, React Context, or Redux) to manage the shopping cart or user session across the app.
- **Cart & Checkout UI**: No Cart sidebar/page and no checkout form to collect shipping details.
- **Payment Gateway Integration**: No frontend logic to handle Razorpay/Stripe script loading or payment verification through Supabase Edge Functions.
- **User Dashboard/Profile**: No UI for users to view past orders, download invoices (Supabase private storage), or manage addresses.
- **Storage Integrations**: No active fetching or uploading to Supabase Storage buckets (public or private).
- **Edge Function Calls**: No client-side invocations (`supabase.functions.invoke()`) for Shiprocket, payment processing, or emails.

---

## 5. Component Map
The component hierarchy, stemming from `app/page.tsx`, is as follows:

```text
RootLayout (app/layout.tsx)
 └── Home (app/page.tsx)
      ├── Navbar (components/Navbar.tsx)
      ├── ShoeScroll (components/ShoeScroll.tsx)
      │    ├── ScrollProgressBar (components/ScrollProgressBar.tsx)
      │    └── ScrollOverlays (components/ScrollOverlays.tsx)
      ├── ShopSection (components/ShopSection.tsx)
      │    └── ProductCard (Internal to ShopSection)
      ├── AboutSection (components/AboutSection.tsx)
      └── FAQ (components/FAQ.tsx)
```

---

## 6. Supabase Integration Map
- **Connection Initialization**: `utils/supabaseClient.ts` uses `@supabase/ssr` to configure the `createBrowserClient()`.
- **Database (PostgreSQL)**:
  - `lib/api/products.ts` directly calls `.from("products").select(...)` to get product and variant data.
  - `app/test-db/page.tsx` contains an inline Database query to test connectivity.
- **Auth**: *Not currently integrated in frontend code.*
- **Storage**: *Not currently integrated in frontend code.*
- **Edge Functions**: *Not currently integrated in frontend code.*

---

## 7. Known Issues / Code Smells
- **Hardcoded Product Data**: `ShopSection.tsx` duplicates data logic that should ideally be sourced dynamically via the `getProducts()` utility.
- **Missing Loading/Error States in Shop**: `ShopSection.tsx` lacks handling for when data is loading or fails to load (since it's currently hardcoded).
- **Next.js Image Warning**: Inside `ShopSection.tsx`, there's an `// eslint-disable-next-line @next/next/no-img-element`. While this bypasses the rule, it's generally better to use `next/image` (`<Image />`) for optimized rendering, especially for product lists.
- **Canvas Image Sequence Performance**: `ShoeScroll.tsx` pre-loads 200 images into an array. Depending on image size, this is highly memory-intensive for mobile devices and could crash low-end phones or cause extreme latency. The `loadProgress` covers this up, but the RAM footprint remains a concern.

---

## 8. Recommended Next Steps
**Priority List (High to Low):**

1. **Wire up the Shop with Supabase**: 
   - Refactor `ShopSection.tsx` to fetch data using `lib/api/products.ts` (either fetching server-side in `page.tsx` and passing as props, or fetching client-side with a loading state).
2. **Implement Global State Management**: 
   - Add Zustand or React Context to manage `cart` (items, quantities) and `userSession`.
3. **Build Authentication UI**: 
   - Create Modals or Pages for Email/Password and Google OAuth login flows using `@supabase/ssr`.
4. **Develop Checkout Flow & Payment Gateway**: 
   - Build a Cart review component.
   - Integrate Razorpay/Stripe checkout script.
   - Hook up Supabase Edge function for creating the order and verifying payment.
5. **Optimize Scroll Animation (Performance)**:
   - Audit the `/sequence/ezgif-frame-...` images. Compress them heavily, convert to WebP, or implement a video-scrubbing alternative if memory usage exceeds mobile limits.
6. **Implement User Dashboard**: 
   - Build routes for authenticated users to view order history and fetch invoices from Supabase Private Storage.

---

## 9. Environment & Config Audit
**Environment Variables Identified:**
- `NEXT_PUBLIC_SUPABASE_URL`: Actively used in `utils/supabaseClient.ts`. Configured in `.env.local`.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Actively used in `utils/supabaseClient.ts`. Configured in `.env.local`.

**Missing or Hardcoded Config:**
- No payment gateway keys (e.g., `NEXT_PUBLIC_RAZORPAY_KEY` or `NEXT_PUBLIC_STRIPE_KEY`) are present in the environment or source code yet.
- Absolute paths to API endpoints for external integrations and edge functions do not currently exist and will need environment configuration in the future.
- The `ShopSection.tsx` features hardcoded static assets (`/images/upper.webp`, `/images/midsole.webp`, etc.). These should ideally be resolved through the dynamic backend.

---

## 10. Third-party Packages Audit
**Dependencies from `package.json`:**
- `@supabase/ssr` & `@supabase/supabase-js`: **Actively used** for initialising browser-side connection logic (`supabaseClient.ts`, `lib/api/products.ts`, `test-db`).
- `framer-motion`: **Actively used** heavily throughout the components (`Navbar`, `ShoeScroll`, `ScrollOverlays`, `FAQ`) to manage scroll states and entrance animations.
- `next`, `react`, `react-dom`: **Actively used** as the fundamental framework layer.

**Dev Dependencies:**
- `tailwindcss`, `postcss`, `autoprefixer`: **Actively used** via `globals.css` to handle responsive styling and component makeup.
- Typescript & typical React typings (`@types/node`, `@types/react`, etc): **Actively used** for static type checks.

---

> IMPORTANT: Base your entire analysis ONLY on files that actually exist in the repo. Do not assume or invent any file or feature. If something is unclear, mark it as "Needs Investigation" rather than guessing.
