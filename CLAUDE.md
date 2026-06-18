# CLAUDE.md — laci-landing

Public marketing site for Laci POS (the `laci-site` repo described in the repo-root `PLAN.md`,
Phase 5 / Milestone 2.4 doc-lag notes). Not part of the single-tenant product apps
(`laci-backend`/`laci-admin`/`laci-pos`) — this is a standalone Next.js project with its own
database, deployed separately. See the repo-root `CLAUDE.md` for how this fits the wider monorepo.

## Stack

- **Next.js 16** (App Router, TypeScript, Tailwind v4) — `src/app/`.
- **Prisma 7** ORM against **Supabase** Postgres. Prisma 7 moved connection config out of
  `schema.prisma`: the datasource URL lives in `prisma.config.ts` (used by the CLI for
  `migrate`/`generate`, pointed at `DIRECT_URL`), and `PrismaClient` requires a driver adapter —
  see `src/lib/prisma.ts` (`@prisma/adapter-pg`, pointed at the pooled `DATABASE_URL`).
- `src/lib/supabase.ts` exposes the Supabase JS client (anon key) for any client-side/storage use
  beyond what Prisma covers.

## Structure

- `src/app/page.tsx` — assembles the landing page from `src/components/landing/*` sections
  (Navbar, Hero, ClientsMarquee, Features, Infrastructure, Pricing, Cta, Footer). `Navbar`, `Hero`,
  `ClientsMarquee`, and `Infrastructure` come from the AIDesigner "Landing Page 2" canvas (sharper
  brutalist shadows, Unsplash photography, local `/public/logo-laci-pos.png` wordmark); `Features`,
  `Pricing`, `Cta`, `Footer` are still from the original "Landing Page" canvas. Both share the same
  neo-minimalist/brutalist hybrid look (zinc/lime/orange palette, Michroma display + Outfit body).
  The original "Landing Page" versions of the four swapped sections are kept as unreferenced
  backups — `Navbar2`/`Hero2`/`ClientsMarquee2`/`Infrastructure2` — not imported anywhere, for
  rollback. Note: the "Landing Page 2" canvas's login slide-in modal (`#login-modal` / fake auth
  flow on the nav's "System Login" button) was intentionally not ported — out of scope, "System
  Login" is currently an inert link.
- `src/components/landing/ScrollEffects.tsx` — client component wiring the scroll-reveal
  (`IntersectionObserver`) and sticky-navbar shadow behavior from the original design's script.
- `prisma/schema.prisma` — `Inquiry` (public contact/inquiry inbox), `AdminUser`, and
  `ClientContract` (the internal client/contract registry described in the repo-root `PLAN.md`).
  `Package` enum (`BASIC`/`PLUS`/`BUSINESS`) is shared by `Inquiry.packageInterest` and
  `ClientContract.package` — same 3 SKUs, single source of truth. `ClientContract` deliberately
  has **no credential/secret fields** (PLAN.md constraint: license/contract/contact + server
  metadata only, never plaintext POS passwords — those belong in a vault).

## Admin section (`/admin`)

Internal-only CRUD for inquiries + the client/contract registry — plain utilitarian UI (zinc
palette, no brutalist/marquee/reveal styling), deliberately distinct from the public marketing
site.

- **Auth**: custom, not Auth.js — `bcryptjs` password hashing + `jose`-signed httpOnly JWT cookie
  (`laci_admin_session`, 7-day expiry, stateless — no DB-backed session/revocation). `src/lib/auth.ts`
  (sign/verify, used by both the login action and `middleware.ts`), `src/lib/session.ts` (cookie
  name/options), `src/lib/get-admin-session.ts` (Server Component/Action-only cookie reader — kept
  separate from `auth.ts`'s edge-safe exports so `middleware.ts`'s bundle stays minimal).
- **`middleware.ts`** (repo root) gates `/admin/:path*` except `/admin/login`, redirecting to
  login when the session cookie is missing/invalid.
- **No public admin signup.** First/only admin accounts are created via
  `npx tsx prisma/seed-admin.ts` (idempotent upsert from `ADMIN_EMAIL`/`ADMIN_PASSWORD` env vars,
  run manually) — there's no in-app "create admin" screen (confirmed: small fixed team).
- **Route structure**: `src/app/admin/login` + `logout` sit outside the `(dashboard)` route group
  so the login page isn't wrapped in the sidebar shell; `src/app/admin/(dashboard)/layout.tsx`
  does a defense-in-depth session check (redirects to login) in addition to the middleware, and
  renders `src/components/admin/Sidebar.tsx`. `inquiries/` and `contracts/` each have their own
  `actions.ts` (Server Actions) colocated with their pages — no separate REST API layer, this is
  an internal tool only.
- **`src/lib/contract-status.ts`** — `computeRenewalBadge(contractEnd, renewalStatus)`: the
  Active/Due-Soon/Expired/Cancelled badge shown in the UI is computed from `contractEnd` at render
  time (30-day window), not stored — `ClientContract.renewalStatus` only persists the manual
  `CANCELLED` override, so the badge can never go stale.

## Public contact form (`/contact`)

`src/app/contact/page.tsx` is the public form that actually creates `Inquiry` rows (the model
existed since earlier but had no public-facing writer until this). `ContactHero`/`ContactForm`
live in `src/components/contact/` — `ContactHero` is a smaller, separate component adapted from
`FeaturesHero` (not a shared abstraction, to avoid coupling the two pages). `ContactForm` follows
the same `useActionState` + colocated `"use server"` action pattern as `/admin/login` — on
success the action returns `{ success: true }` and the form is swapped inline for a thank-you
panel (no redirect/separate route).

`src/app/contact/actions.ts`'s `submitInquiryAction` has two abuse-prevention layers, in order:
1. **Honeypot** — a hidden `company_site` input (off-screen via absolute positioning, not
   `display:none`, plus `aria-hidden`) that real users never see or fill. If it's non-empty, the
   action returns success without writing anything or touching the rate limiter — deliberately
   doesn't tip off a bot that it was caught.
2. **Rate limiting** — `src/lib/rate-limit.ts`'s `checkRateLimit` is an in-memory sliding-window
   limiter (3 submissions / 10 min per IP via `x-forwarded-for`/`x-real-ip`). No Redis/DB — accepted
   tradeoff for a single self-hosted instance: resets on restart, doesn't share state across
   multiple instances.

`Navbar.tsx`'s `active` prop is `"features" | "contact"`.

## Env

Copy `.env.example` to `.env` and fill in your Supabase project's pooled (`DATABASE_URL`, port
6543, `pgbouncer=true`) and direct (`DIRECT_URL`, port 5432) connection strings, plus
`NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` from Project Settings → API, plus
`ADMIN_SESSION_SECRET` (`openssl rand -base64 32`) and `ADMIN_EMAIL`/`ADMIN_PASSWORD` (only read by
the seed script, not at app runtime).

## Commands

```bash
npm install
npx prisma generate            # regenerate the client after schema changes
npx prisma migrate dev         # apply schema changes to Supabase (uses DIRECT_URL)
npx tsx prisma/seed-admin.ts   # create/update the admin account from ADMIN_EMAIL/ADMIN_PASSWORD
npm run dev                    # http://localhost:3000
npm run build && npm run lint
```
