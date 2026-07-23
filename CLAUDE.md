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

Design Source:
- Figma MCP is the source of truth.
- Please read the FIGMA_STRUCTURE.md to get the list of Frames

Documentation:
- Always query Context7 before using third-party libraries.

Code Style:
- Layout Desktop First then Mobile First
- While creating a page, the sections always breakdown into separate components `./src/components`
- **Body text colors:** Always use `text-white` for body text. Never use `text-white/70`, `text-white/80`, or other opacity variants unless explicitly requested by the user. The base `text-white` is the standard.
- Server Components by default
- Client Components only when required

Workflow:
- create a changes on this project or working on a tasks no need to test on Chrome/Safari/Firefox etc. no need to kill server unless you need to, running "npm run lint" are enough. and let user check the results.

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

You are a Senior Graphics Engineer specializing in WebGL, GLSL, OGL, React, and interactive website backgrounds.

You are building a production-ready reusable component for a premium digital agency website.

The visual quality should be comparable to Stripe, Apple, Linear, Vercel, Framer and ReactBits Pro.

The final result must be clean, modular, maintainable and highly optimized.

---

# OBJECTIVE

Create a brand new component named

GradientBandsBackground

This is NOT a Plasma shader.

This is NOT Aurora.

This is NOT Mesh Gradient.

This is NOT Noise Clouds.

This is NOT Metaballs.

Do not modify an existing shader.

Instead design an entirely new animated shader.

The attached image is only the visual inspiration.

Do NOT recreate the image pixel by pixel.

Instead reproduce its visual language.

---

# VISUAL STYLE

The animation should feel like a premium cinematic website background.

The screen consists of multiple wide horizontal color bands.

The bands are soft.

The bands blend together.

No visible hard edges.

No obvious procedural patterns.

No rainbow colors.

No psychedelic plasma.

No smoke.

No fire.

No liquid.

No aurora.

No particles.

Everything should feel calm and elegant.

---

# COLORS

Use a dark luxury palette.

Approximate colors:

Background

#05020B

Gradient Palette

#201248

#35206C

#55359A

#7546C4

#9357D9

#B76ED9

#D98ACF

#F3A9D8

#FFE3EC

Blend them smoothly.

Never show abrupt transitions.

---

## COLOR EXTRACTION

Analyze the attached reference image.

Automatically extract approximately

10 dominant horizontal color layers.

Estimate the average color of each layer.

Use those extracted colors as the palette.

Do not invent new colors.

The generated background should preserve the same overall color balance as the reference image.

The image should look like it belongs to the same visual family.

The animation should simply bring the still image to life.

# BAND STRUCTURE

Create around

18~24

horizontal bands.

Each band occupies around

4%–8%

of the screen height.

Every band has

soft interpolation

instead of hard stripes.

Bands overlap each other.

The blending should look almost like a huge blurred gradient.

---

## BAND GEOMETRY

Do NOT render thin stripes.

Do NOT render glowing lines.

Do NOT render laser beams.

Each band should be a very large horizontal layer.

Target

9–11 bands

across the entire viewport.

Each band occupies approximately

8%–14%

of the viewport height.

Neighboring bands overlap heavily.

The screen should feel almost completely filled.

The viewer should not perceive individual stripes.

Instead they should perceive stacked soft color layers.

Avoid large empty black gaps.

## BAND EDGES

Band edges should be extremely soft.

The transition between neighboring bands should occupy almost

40–60%

of the band height.

Never use hard alpha edges.

Every band slowly fades into the next one.


# MOTION

The movement should be extremely subtle.

Each band moves independently.

Some bands move left.

Some move right.

Different speeds.

Movement should be nearly imperceptible.

Target mood:

calm

premium

cinematic

ambient

Do not make obvious looping.

Do not make sine-wave animation.

Instead use low-frequency domain warping.

Maximum displacement should be very small.

---

# WARP

Bands should not be perfectly straight.

Apply an extremely subtle domain warp.

Amplitude

2~4 pixels.

Frequency

very low.

The viewer should almost not notice it.

The purpose is simply to remove mechanical straight lines.

---

# BLUR

Do NOT implement Gaussian blur.

Instead fake blur using

smoothstep

gradient interpolation

soft distance falloff

layer blending

The image should feel naturally blurred.

---

# DEPTH

Create visual depth by layering bands.

Some bands should be more opaque.

Some less opaque.

Some slightly brighter.

No shadows.

Only soft luminosity.

---

# VIGNETTE

Add a soft vignette.

Corners slightly darker.

Very subtle.

---

# PERFORMANCE

This shader must be optimized.

No raymarching.

No expensive loops.

No FBM with many octaves.

No unnecessary branches.

Target

60–120 FPS

on modern laptops.

---

# TECHNOLOGY

Use

React

TypeScript

OGL

WebGL2

GLSL 300 ES

Follow the coding style of ReactBits.

---

# FILE STRUCTURE

Create

src/components/reactbits/

GradientBandsBackground.tsx

GradientBandsBackground.css

shaders/

gradientBands.vert

gradientBands.frag

---

# REACT COMPONENT

The public API should look like

<GradientBandsBackground
    opacity={1}
    speed={0.12}
    bandCount={20}
    grain={0.02}
    warpStrength={0.04}
    blur={0.22}
    mouseInteractive={false}
    colors={[
        "#05020B",
        "#201248",
        "#35206C",
        "#55359A",
        "#7546C4",
        "#9357D9",
        "#B76ED9",
        "#D98ACF",
        "#F3A9D8",
        "#FFE3EC"
    ]}
/>

---

# IMPLEMENTATION REQUIREMENTS

Implement

ResizeObserver

IntersectionObserver

WebGL context lost handling

High DPI rendering

Proper cleanup

Responsive resizing

React hooks

Strong TypeScript typing

No memory leaks.

---

# IMPLEMENTATION STRATEGY

Do NOT use a single global linear gradient.

Instead:

1. Generate N horizontal bands.

2. For each band:

   - assign an independent gradient palette
   - generate 3–6 color stops
   - interpolate smoothly between stops
   - animate stop positions over time
   - assign independent motion direction
   - assign independent speed
   - assign independent phase offset
   - assign independent brightness multiplier

3. Blend all bands together using smooth interpolation.

4. Apply a subtle domain warp.

5. Apply film grain.

6. Apply vignette.

The final result should look like layered animated ribbons of light rather than procedural stripes.


# SHADER ARCHITECTURE

Build the shader in layers.

Layer 1

Background

Layer 2

Gradient bands

Layer 3

Independent motion

Layer 4

Domain warp

Layer 5

Soft blending

Layer 6

Brightness modulation

Layer 7

Film grain

Layer 8

Vignette

Every layer should be isolated inside reusable GLSL helper functions.

Avoid giant main() functions.

---

# CLEAN CODE

Split calculations into reusable GLSL functions.

Comment every function.

Avoid magic numbers.

Keep uniforms organized.

Readable variable names.

Production quality only.

---

# FINAL QUALITY TARGET

The animation should feel like a premium landing page background from

Apple

Stripe

Linear

Framer

Raycast

Vercel

ReactBits Pro

The final result should be elegant enough to become the signature background of an entire design system.

# HORIZONTAL GRADIENT BANDS

Do not render each band as a flat solid color.

Instead, every horizontal band must contain its own independent horizontal gradient.

Think of every band as a long ribbon made from multiple colors that blend together.

For example

Band 01

Deep Indigo
→ Royal Purple
→ Violet
→ Magenta
→ Pink

Band 02

Dark Purple
→ Violet
→ Lavender
→ Soft Pink

Band 03

Royal Purple
→ Orchid
→ Pink
→ Pale Rose

Each band should have a unique gradient composition.

Do not repeat identical gradients.

---

## HORIZONTAL GRADIENT

Each band has a very wide horizontal gradient.

The gradient spans almost the entire screen width.

Do not create small repeating gradients.

Each band contains

4–6

large color regions.

Example

██████▒▒▒▒▒▒▓▓▓▓▓▓██████

not

██▒█▒██▒█▒█▒██▒█▒█▒

The horizontal gradient should feel like cinematic color grading.

Not procedural noise.


# COLOR INTERPOLATION

Color interpolation should be extremely smooth.

No visible color stops.

No abrupt transitions.

No banding artifacts.

Use smooth interpolation between color stops.

The final appearance should resemble premium cinematic color grading rather than CSS gradients.

---

# HORIZONTAL MOVEMENT

Each horizontal gradient should slowly drift independently.

The gradient itself moves inside the band.

Not the whole band.

Imagine the colors gently flowing through the ribbon.

Some bands drift left.

Some drift right.

Each has different speed.

The movement should be extremely subtle.

Almost imperceptible.

The viewer should only notice it after watching for several seconds.

---

# INDEPENDENT PHASE

Every band should have

its own

offset

phase

speed

gradient start

gradient length

noise seed

No two bands should animate identically.

Avoid synchronized motion.

---

# COLOR STOPS

Each band should randomly generate between

3 and 6

color stops.

Example

Purple

↓

Violet

↓

Magenta

↓

Pink

↓

Lavender

↓

Dark Purple

The positions of these color stops should slowly evolve over time.

The colors themselves should never abruptly change.

Only their positions shift.

---

# DOMAIN WARP

Apply a subtle domain warp before evaluating the gradient.

The warp should be almost invisible.

It exists only to prevent perfectly mechanical horizontal gradients.

Maximum displacement

2–4 pixels.

Very low frequency.

---

# BLENDING

Neighboring bands should softly overlap.

There should never be a visible hard edge between bands.

Each band fades into the next.

Use smooth distance falloff rather than alpha-only blending.

The result should feel like many large blurred ribbons stacked vertically.

---

# LUMINOSITY

Some bands should be brighter.

Some darker.

Brightness should vary slowly across the horizontal axis.

Never use flat brightness.

The scene should have natural visual depth.

---

# PREMIUM FEEL

Avoid making the gradients look like:

CSS linear-gradient()

PowerPoint gradients

Windows wallpapers

Cheap rainbow effects

Instead aim for the cinematic color treatment seen in luxury websites from Apple, Stripe, Linear, Framer and Raycast.

The animation should feel alive, but almost motionless.

The background should remain elegant and never distract from foreground content.

## IMPORTANT

Do not stop after generating a first version.

Do NOT generate colors from noise.

Noise is only allowed to slightly distort positions.

Color distribution must be artist-directed.

The colors should resemble a manually painted gradient.

Think like a motion designer rather than a shader programmer.

Iteratively refine the shader until the visual quality reaches production level.

After each implementation:

1. Critique the result.
2. Identify weaknesses.
3. Improve band blending.
4. Improve motion.
5. Improve color interpolation.
6. Reduce any procedural appearance.
7. Improve premium feeling.
8. Repeat until no obvious improvements remain.

Prioritize aesthetics over algorithmic simplicity.

The goal is to create a reusable background component worthy of ReactBits Pro.

Notes:
"Treat the reference image `public/articles/banner.png` as the keyframe of the animation. Analyze it first. Estimate the position, thickness, average color, opacity, and blur of each horizontal layer. Build the shader so that at t = 0 it visually matches this keyframe, then animate the layers with extremely subtle independent horizontal motion while preserving the same composition."
