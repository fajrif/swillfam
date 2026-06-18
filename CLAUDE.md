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
  (Navbar, Hero, ClientsMarquee, Features, Infrastructure, Pricing, Cta, Footer), translated from
  the AIDesigner "Landing Page" canvas (neo-minimalist/brutalist hybrid, zinc/lime/orange palette,
  Michroma display + Outfit body fonts).
- `src/components/landing/ScrollEffects.tsx` — client component wiring the scroll-reveal
  (`IntersectionObserver`) and sticky-navbar shadow behavior from the original design's script.
- `prisma/schema.prisma` — `Inquiry` model backs the public contact/inquiry inbox that feeds the
  client/contract registry described in the repo-root `PLAN.md` (not yet wired to a UI — schema
  only, ready for the registry feature).

## Env

Copy `.env.example` to `.env` and fill in your Supabase project's pooled (`DATABASE_URL`, port
6543, `pgbouncer=true`) and direct (`DIRECT_URL`, port 5432) connection strings, plus
`NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` from Project Settings → API.

## Commands

```bash
npm install
npx prisma generate        # regenerate the client after schema changes
npx prisma migrate dev     # apply schema changes to Supabase (uses DIRECT_URL)
npm run dev                # http://localhost:3000
npm run build && npm run lint
```
