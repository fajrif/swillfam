# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Swillfam** — a content-managed site for a company that owns entertainment venues
(restaurants/bars/clubs). It publishes venues, events, promotions, talents, articles, merchandise,
careers, and galleries/videos. Two sections share one Next.js app and one database:

- **Public section** — every route under `src/app/(public)/` (home, venues, promotions, talents,
  events, category, experience, articles, careers, contact, merchandise, exclusive, private-events,
  privacy/terms). See "Public layout" below for how the shared header/footer chrome works. If you
  see stale "Laci"/POS wording anywhere, it's leftover marketing text from the fork this repo started
  as, not a live concept.
- **Admin section** (`src/app/admin`) — internal CRUD for every model, plain zinc utilitarian UI,
  deliberately distinct from the public site.

## Stack

- **Next.js 16** App Router, **React 19**, **TypeScript**, **Tailwind v4**. React Compiler is on
  (`reactCompiler: true` in `next.config.ts`).
- **Prisma 7** against **plain PostgreSQL**. Prisma 7 specifics that bite if forgotten:
  - Generator is `prisma-client` (not `prisma-client-js`); the client is generated to
    `src/generated/prisma` and imported as `@/generated/prisma/client` (gitignored — regenerate
    after schema edits).
  - `schema.prisma`'s `datasource` has **no inline url**. The CLI reads the URL from
    `prisma.config.ts` (`DATABASE_URL`); the running app needs a **driver adapter** — see
    `src/lib/prisma.ts` (`@prisma/adapter-pg` on the same `DATABASE_URL`).
- **Tiptap** (`@tiptap/react` + `starter-kit` + `pm`) for rich-text fields. **bcryptjs** + **jose**
  for auth. No Supabase.

## Frontend Rules

Framework:
- Next.js App Router
- TypeScript
- TailwindCSS

UI Strategy:
- Use shadcn/ui for all functional UI.
- Use React Bits only for visual enhancements and as requested by prompt.
- React Bits reference: "https://reactbits.dev/get-started/installation"
- Never create custom dialog, form, table, or input if shadcn exists.

Images:
- All images and their parent containers must NOT have rounded corners (no `rounded-*` classes on image or parent div).
- Use `/logo-swillfam.png` for all logo references.
- **Every page hero or banner that uses an image must wrap the `<Image>` in `<ParallaxImage>`** (from `@/components/shared/ParallaxImage`) for scroll-linked parallax effect. This applies to all full-bleed page-level hero components. Do not add parallax to section-level, grid, card, or carousel images unless explicitly requested.

Icons:
- Use `@phosphor-icons/react` (npm package, not CDN — CDN URLs are sometimes invalid) or `lucide-react`.
- Import directly from the npm package (e.g. `import { Star } from "@phosphor-icons/react"`).

Design Source:
- Design is provided via image screenshots only.

Documentation:
- Always query Context7 before using third-party libraries.

Code Style:
- Layout Desktop First then Mobile First
- While creating a page, the sections always breakdown into separate components `./src/components`
- **Body text colors:** Always use `text-white` for body text. Never use `text-white/70`, `text-white/80`, or other opacity variants unless explicitly requested by the user. The base `text-white` is the standard.
- Server Components by default
- Client Components only when required

Workflow:
- After making changes, verify with `npm run build` and `npm run lint` — these are sufficient for correctness checking.
- Do not test in Chrome or any browser unless explicitly asked by the user.

## Commands

```bash
npm install
npm run dev                       # http://localhost:3000
npm run build && npm run lint     # build also runs the TS typecheck
npx prisma generate               # after any schema change
npx prisma migrate dev --name x   # create + apply a migration (needs a reachable Postgres)
npx prisma migrate deploy         # apply existing migrations (e.g. the generated init) to a fresh DB
npx tsx prisma/seed-admin.ts      # create/update the admin login from ADMIN_EMAIL/ADMIN_PASSWORD
npm run seed:all                  # run all the seed scripts
```

No automated tests — verify by building and exercising the admin UI under `npm run dev`.

Env: copy `.env.example` → `.env`. Needs `DATABASE_URL` (Postgres), `ADMIN_SESSION_SECRET`
(`openssl rand -base64 32`), and `ADMIN_EMAIL`/`ADMIN_PASSWORD` (read only by the seed script).

## Public layout (`src/app/(public)/`)

Every public route lives under the `(public)` route group so `src/app/(public)/layout.tsx` can own
the shared chrome once: it's an async Server Component that calls `getSiteSettings()` and renders
`<main className="min-h-dvh bg-sf-bg font-inter text-sf-text">` wrapping `<SiteHeader />` (in its own
`<div className="relative">`, so the header floats absolutely over whatever the page renders first —
a Hero, or just padded content on hero-less detail pages), then `{children}`, then
`<SiteFooter settings={settings} />`. **Individual pages no longer render `SiteHeader`/`SiteFooter`/
`<main>` themselves** — a page's `page.tsx` is just its own content, typically a Hero component
followed by `<Reveal>`-wrapped sections.

- `getSiteSettings` (`src/lib/site-settings.ts`) is wrapped in React's `cache()`. Pages that also need
  `settings` for their own sections (not just the footer) still call `getSiteSettings()` themselves —
  a layout can't inject props into a page's children — and `cache()` dedupes that to a single DB
  query per request. Currently that's `contact`, `experience`, `merchandise`, home (`page.tsx`),
  `venues`, and `promotions/[slug]`.
- The route group is purely organizational (Next.js strips `(name)` segments from the URL), so no
  page's path changed when it moved into `(public)`.
- `src/app/admin/**` is a sibling of `(public)`, not nested inside it, with its own separate
  `admin/(dashboard)/layout.tsx` (see "Admin CRUD pattern" below) — the two sections never share chrome.

## Auth (`/admin`)

Custom (not Auth.js): bcrypt password hash + a `jose`-signed httpOnly JWT cookie
(`swillfam_admin_session`, 7-day, stateless — no DB session/revocation).

- `src/lib/auth.ts` — edge-safe `signSession`/`verifySession` (used by the login action **and**
  `middleware.ts`). `src/lib/session.ts` — cookie name/options. `src/lib/get-admin-session.ts` —
  Server Component/Action cookie reader, kept separate so `middleware.ts`'s edge bundle stays lean.
- `middleware.ts` (repo root) gates `/admin/:path*` except `/admin/login`. The `(dashboard)` layout
  re-checks the session (defense in depth) and renders `Sidebar`. `login`/`logout` live outside the
  `(dashboard)` group so they aren't wrapped in the sidebar shell.
- **No in-app admin signup** — accounts come only from `prisma/seed-admin.ts` (idempotent upsert).

## Admin CRUD pattern (the core thing to replicate)

Every resource lives at `src/app/admin/(dashboard)/<resource>/` with the same shape:

- `page.tsx` — list via the generic `AdminTable` (`columns`/`getKey`/`empty`).
- `new/page.tsx` — blank form. `[id]/page.tsx` — fetch-by-id-or-404, pre-filled form + delete.
- `actions.ts` — colocated `"use server"` `createX`/`updateX`/`deleteX`, ending in
  `revalidatePath(...)` + `redirect(...)`. No REST layer — Server Actions only.
- Form component in `src/components/admin/<Resource>Form.tsx`, composed from shared primitives.

Shared building blocks (use these instead of re-implementing inputs/tables):
`form-fields.tsx` (`Field`/`SelectField`/`TextareaField`/`CheckboxField`/`SaveButton`/`toDateInputValue`),
`AdminTable.tsx`, `PageHeader.tsx` (`PageHeader`/`EditHeader`/`Card`), `Thumb.tsx`, `NameForm.tsx`
(name-only resources), `RichTextEditor.tsx` (Tiptap → hidden input HTML), `SlugField.tsx`
(auto-fills from a sibling field until edited), `ConfirmDeleteButton.tsx`, `EventScheduleFields.tsx`.
`/admin` redirects to `/admin/inquiries`.

**Every list page must include:**
1. **Search** — `SearchInput` from `@/components/admin/SearchInput` above `<Card>`. It auto-filters
   on typing (debounced 300ms, min 3 chars) via URL `?q=...`. The server reads `q` from
   `searchParams`, builds a `where` clause with `contains` + `mode: "insensitive" as const` on the
   relevant field (`name`, `title`, `fullName`, `question`, `jobTitle`, etc.).
2. **Pagination** — `Pagination` from `@/components/admin/Pagination` below `<AdminTable>` inside
   `<Card>`. Accept `page` from `searchParams`, compute `skip`/`take` (pageSize: 20), run
   `findMany` and `count` in parallel via `Promise.all`. The type annotation must include `page?:
   string`: `searchParams: Promise<{ q?: string; page?: string }>`.

## Image / file uploads (understand before touching forms)

Stored on **local disk** under `public/uploads/<category>/` (served at `/uploads/...`).
`next.config.ts` raises `serverActions.bodySizeLimit` to `15mb` so uploads aren't rejected.
`public/uploads/*` is gitignored except `.gitkeep`. Works for a self-hosted `next start`; not for
ephemeral/serverless filesystems.

**Storage shape:** single-image fields are `String?`; multi-image fields are `String[]` where array
order = display order. Only `SegmentGallery.images` and `Event.galleries` are multi; every
`image`/`bannerImage`/`posterImage` is single.

**`ImageManager.tsx`** (client) handles single or multi: thumbnails, reorder (↑/↓ buttons), and
checkbox-select → "Delete selected". It posts two hidden fields per image field: `<name>__order`
(JSON tokens — kept existing paths, or `"new:<N>"`) and `<name>__file` (new File objects, FileList
rebuilt via `DataTransfer`).

**`src/lib/upload.ts`** (server) is what every action calls:
- `reconcileImageField` / `reconcileSingleImage` — reads `__order` + `__file`, saves new files,
  keeps existing in posted order, and **`deleteUploadedFile`s any path removed from the set** (how
  checkbox-delete and replace both physically unlink the file). Pass the current row's
  `previousPaths`/`previousPath` on update; `[]`/`null` on create.
- `deleteUploadedFile` is path-traversal-guarded (must resolve under `public/uploads`) and never
  throws. `collectImagePaths(...)` flattens single+multi fields so `deleteX` removes every file when
  a row is destroyed (also used for the Application resume PDF).

## Loading states (global top bar)

Navigation loading is handled by a single global `<NextTopLoader>` (`nextjs-toploader`) mounted once
in `src/app/layout.tsx` — a thin accent-colored bar (`#c6387f` / `--color-sf-accent`) that animates
across the top on every client-side navigation (links, the `/articles` category filter + "Load
More", and admin alike). **There are no per-route `loading.tsx` files** — a single root/parent
`loading.tsx` only fires on first/hard load, not when navigating between sibling pages (the boundary
sits above the shared layout), so per-folder files were the only way to get route-level spinners and
we deliberately traded that for the one global bar. **New data-fetching pages need nothing extra** —
do not add `loading.tsx`.

## Data model (`prisma/schema.prisma`)

16 models: `AdminUser`, `Inquiry`, `Career`, `Application`, `Merchandise`, `ArticleCategory`,
`Article`, `Category`, `Venue`, `SegmentGallery`, `Talent`, `Promotion`, `EventCategory`, `Event`,
`Gallery`, `Video`. All ids are `uuid()`. Conventions worth knowing:

- **All foreign keys are optional + `onDelete: SetNull`** — deleting a parent (venue, category,
  career) never cascades or fails; children just lose the association. Forms still mark the relevant
  select `required` at the UI layer.
- **Slugs** (`@unique`, auto-generated, editable) on `Article`, `Category`, `Venue`, `Promotion`,
  `Event`, via `src/lib/slug.ts` `ensureUniqueSlug` (appends `-2`/`-3` on collision; pass
  `excludeId` on update).
- **Events** are `FIXED` or `RECURRING` (`eventType`). `RECURRING` uses `recurringDays Weekday[]`
  (e.g. Fri+Sat); `FIXED` uses `startDate` as the date. `EventScheduleFields` drives the toggle.
- `Event.isPrivate` maps to SQL column `private` (`@map`, dodging the reserved word).
- `Article.status` is `Int` (0=Draft, 1=Published, per spec "flag by int"), not an enum.
- `Merchandise.price` is `Decimal` — render with `.toString()`, never the raw object in JSX.
- `String[]` uses native Postgres `text[]` (no join tables) for `SegmentGallery.images`,
  `Event.galleries`, `Event.recurringDays`.

The public `/contact` form (`src/app/(public)/contact/actions.ts`) is the only public writer — it creates
`Inquiry` rows behind a honeypot + an in-memory sliding-window rate limiter (`src/lib/rate-limit.ts`,
3/10min per IP, resets on restart). `Application` rows are also public-submitted (admin gets list +
read-only detail + delete only), but the public application form is part of the unbuilt public pages.

## TASKS

# ROLE

You are a Senior Graphics Engineer and Motion Designer specializing in WebGL, GLSL, OGL, and cinematic website backgrounds.

Your task is to build a production-quality reusable shader component called

GlassRefractionBackground

The attached image is the design reference.

Do NOT recreate the image pixel-for-pixel.

Instead analyze its visual language and reproduce it procedurally.

# OVERVIEW

i need you to make another background component called `GlassRefractionBackground`:
- this is the design reference: `./glass-refraction-banner.png`
- that design is vertical glass refraction with gradient colors
- i need this to be created similar like `./src/components/reactbits/GradientBandsBackground.tsx` with props to handle speed, bandCount, blur, colors, etc.
- i expect the background to also have animation like light traveling energy wave
- if you notice from the design there's a gradient color shape like "half spheres like" or "amplitude curve"
- it will be nice the animation is that slowly and smoothly can make the "amplitude curve" curving like sound wave
- there's also some reference to make this "Glass Refraction" style you can check at this project `../quantara/app/(public)/contact/page.tsx` Line: 109 - 120
- it depends on your approach you may want make that all using Ogl / WebGL or you want to combine with "div Glass Refraction bar"

below i give visual analysis of the image reference

---

# VISUAL ANALYSIS

The artwork consists of multiple independent visual layers.

Layer 1

Very dark purple-black background.

Layer 2

A huge blurred red volumetric light.

This light remains mostly static.

Layer 3

A soft magenta/purple rim light following the upper contour of the red light.

Layer 4

Around 28 vertical translucent glass slats.

The slats cover the full viewport height.

Each slat behaves like a thin piece of glass.

Layer 5

Every slat slightly refracts the image behind it.

Refraction amount

1–4 pixels.

Layer 6

Subtle film grain.

---

# IMPORTANT

The vertical structures are NOT lines.

They are translucent glass panels.

They should slightly distort

brightness

color

position

behind them.

Think of architectural ribbed glass.

---

# MOTION

The red volumetric light remains mostly stable.

Instead animate the glass.

Each glass slat moves independently.

Movement should resemble

a slow audio spectrum

or

moving sound amplitude.

Do NOT animate with obvious sine waves.

Instead:

Each slat has

independent phase

independent speed

independent amplitude

independent delay

The motion should feel organic.

Very slow.

Very subtle.

---

# REFRACTION

Every slat should distort UV coordinates.

Distortion

1–4 pixels.

Very soft.

Different for every slat.

Never identical.

---

# HIGHLIGHT

Each slat should generate

a soft purple highlight.

The highlight follows the motion.

Never use hard edges.

---

# LIGHTING

The scene should feel cinematic.

Soft volumetric lighting.

No sharp glow.

No bloom explosion.

The purple light softly wraps around the red blob.

---

# COLORS

Approximate palette

Background

#05030A

#09040E

#0D0715

Red

#B0002A

#8A0022

#620018

Purple

#5A1BA8

#7B29FF

#A53CFF

Magenta

#FF2AC8

#FF3DA5

Highlight

#FFD4FF

Use smooth interpolation.

No banding.

---

# IMPLEMENTATION

Use

React

TypeScript

OGL

GLSL 300 ES

Same architecture as GradientBandsBackground.

Support

ResizeObserver

IntersectionObserver

HiDPI

Context lost

Cleanup

Responsive resizing

---

# PERFORMANCE

No raymarching.

No expensive loops.

No heavy FBM.

Prefer

domain warp

gradient fields

refraction

smooth interpolation

signed distance masks

The target is

60–120 FPS.

---

# FINAL GOAL

The finished animation should feel like a premium glass sculpture illuminated by magenta and red light.

The movement should resemble a high-end audio visualization where vertical glass fins gently breathe like a moving sound amplitude.

It should look elegant, calm, luxurious, and suitable as the hero background of a premium digital agency website.
