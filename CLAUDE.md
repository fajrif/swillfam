# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Swillfam** — a content-managed site for a company that owns entertainment venues
(restaurants/bars/clubs). It publishes venues, events, promotions, talents, articles, merchandise,
careers, and galleries/videos. Two sections share one Next.js app and one database:

- **Public section** (`src/app/page.tsx` + `src/app/{contact,features,privacy,terms}`) — the
  marketing/landing site. **Note:** the landing/legal pages are still the original brutalist
  marketing layout with only literal brand-name swaps applied; the real public consumer pages
  (venue listing, event calendar, blog, etc.) that render the CMS data are **not built yet** — a
  future pass. If you see stale "Laci"/POS wording in landing/legal copy, it's leftover marketing
  text from the fork this repo started as, not a live concept.
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

The public `/contact` form (`src/app/contact/actions.ts`) is the only public writer — it creates
`Inquiry` rows behind a honeypot + an in-memory sliding-window rate limiter (`src/lib/rate-limit.ts`,
3/10min per IP, resets on restart). `Application` rows are also public-submitted (admin gets list +
read-only detail + delete only), but the public application form is part of the unbuilt public pages.

## TASKS

i need you to create seed files for the following venues:
- zoo
- swillhouse
- kilo
- dualism
- truce
- lecirgue

1. the expected seed files should look like `prisma/seed-atsumaru.ts`, you can check that out as an example.
2. the following image files can be found in `public/categories/venues/<name>/`.
3. you will need to upload the images for:
- banner
- gallery -> this is was using SegmentGallery (please using a better paragraph that will related to the venue)
- menu -> this also using SegmentGallery
- promo -> create promo for this venue (save promo with venue_id)
- drinks -> are only use in `dualism` venue since this venue data not have menu. please using the template like atsumaru for the `dishes`, but this time using term "Beverages" 

you will need to use description as i provided below "VENUES DESCRIPTION" for each venue.
also the current/existing description data have to move to short_description.

### ATSUMARU SEED CHANGES
you will need to edit atsumaru for descripition and im using the new image gallery for atsumaru. you will need to replace that with the new image gallery.

** Notes: **
do not create `UPDATE` statement for this task. i will reset this database entirely and create a new database with the new seed `INSERT` data.

### VENUES DESCRIPTION

1. zoo description:
Zoo is a boutique lounge concept created for all party animals to embrace their wild side.
Known for its vibrant music direction, ranging from afro, amapiano, baila, to fresh DJ-led sounds, Zoo brings a unique energy to Jakarta’s nightlife scene. Inside, guests can explore a lineup of immersive private rooms, each crafted with its own bold, animal-inspired design. Whether you’re here for late-night drinks, curated DJ sets, or a private celebration, Zoo offers a nightlife experience unlike anywhere else in Jakarta the moment you step through the door.

2. swillhouse description:
The Swillhouse is a hip-hop–focused bar and creative event space in Jakarta.
It is known for its high-energy atmosphere, curated music, and contemporary minimalist design. A destination for nightlife lovers and the youthful party crowd, The Swillhouse blends hip-hop culture, live DJ sets, and signature events under one roof. Here, hype isn’t just a feeling, it’s the experience. The Swillhouse continues to be one of Jakarta’s go-to spots for nights out, club sessions, and unforgettable moments.

3. kilo description:
Kilo Kitchen Jakarta is a standout culinary destination known for its modern comfort food rooted in a bold fusion of Latin and Asian flavors.
Located in the vibrant heart of Jakarta, Kilo offers a stylish yet relaxed atmosphere perfect for casual dining, date nights, or social gatherings. Blending Jakarta’s fast-paced city life with Kilo’s signature lifestyle approach, the venue creates an immersive experience where food, music, and culture converge. Guests can expect elevated dishes, handcrafted cocktails, and an inviting ambiance that redefines contemporary dining in Indonesia. Whether you're craving unique flavor combinations or a cozy escape with great vibes, Kilo Kitchen Jakarta is your go-to restaurant for unforgettable dining moments.

4. dualism description:
Dualism is Jakarta’s innovative cocktail bar where contrast takes center stage.
Every cocktail begins with the same foundation, then branches into two distinct expressions: one bold and spirit-forward, the other playful and elegant. This dual-format menu invites guests to explore the endless possibilities of flavor, texture, and technique. At Dualism, you’ll experience both the familiar and the unexpected. From clean and composed sips to indulgent and expressive pours, each pair reveals the dynamic spectrum of modern mixology. Whether you're a fan of classic cocktails or experimental drinks, Dualism redefines how we taste by celebrating the power of duality. This isn’t just a bar, it’s an exploration of opposites. And in every contrast, you’ll discover something new.

5. truce description:
In the heart of SCBD, Truce introduces Jakarta to a slow bar experience inspired by Japanese bar philosophy. Every detail at Truce is intentional. The beverage programme focuses on spirit-forward, classic drinks crafted with method over novelty. Sugar is used sparingly, and a deep respect for base spirits remains central to the offerings. To keep the experience dynamic, the bar also features house ferments, savoury tinctures and hydroponic herbs grown on site.
The cocktail list is divided into four categories. Crafted Creations reinterpret classic structures with a smoked, late-night twist, while Original Vol. 1 experiments with Japanese ingredients such as edamame, gari and ogura. Seasonal specials, like Hail Mary Pass, push the boundaries of savoury drinking. For lighter moods, highballs, teas and spritzes can be found in the Seltzers and Mizuwari section, reflecting Tokyo’s preference for refreshing drinks that extend the evening.

6. lecirque description:
LE CIRQUE REPRESENTS A SHIFT TOWARD A BOLDER, MORE DYNAMIC AND MORE SOULFUL NIGHTLIFE CULTURE MIXED WITH MAD + FUN EXPERIENCE.
A new cultural nightlife house built for Jakarta’s growing community of music lovers. Designed as a playground of sound, style, and energy, Le Cirque brings an experience that blends intimacy, credibility, and modern nightlife culture — something truly different from anything currently offered in Indonesia. Powered by a custom lighting and visual system, the venue offers a dynamic, immersive atmosphere that moves in sync with the sound. Le Cirque champions a spectrum of unique house-driven styles — deep house, disco, minimal house, tech house, and modern club rhythms, presented by Indonesia’s top talents and curated international guests. Built for tastemakers, dancers, and true music lovers, Le Cirque is where fun feels inevitable and every night feels alive.

7. atsumaru description:
Atsumaru Izakaya is a modern Japanese restaurant in Jakarta that brings the warmth and vibrancy of traditional izakaya culture into a refined, contemporary setting.
Designed as a welcoming space for everyday dining, after-work drinks, and special celebrations, Atsumaru reflects a commitment to constant innovation while staying true to authentic Japanese flavors and hospitality. The menu features a wide variety of dishes, from sushi and sashimi to yakitori, donburi, and comforting izakaya classics, ensuring there’s something for every palate and occasion. Whether you’re gathering with friends, sharing a meal with family, or hosting an intimate celebration, Atsumaru Izakaya offers the perfect combination of delicious food, warm ambiance, and genuine Japanese culinary culture in the heart of Jakarta.
