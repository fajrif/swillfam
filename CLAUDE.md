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
npx tsx prisma/seed-admin.ts      # create/update the administrator from ADMIN_EMAIL/ADMIN_PASSWORD
npx tsx prisma/seed-admin-users.ts # one operator login per venue (OPERATOR_DEFAULT_PASSWORD)
npm run seed:all                  # run all the seed scripts
npx tsx prisma/seed-venue-data.ts [--dry-run] [--overwrite]  # venue fact sheet + org contacts from prisma/data/swillfam-venue-data.json
npx tsx scripts/generate-icons.ts              # favicon / app icon / apple icon / manifest icons
npx tsx --env-file=.env scripts/generate-og-images.ts   # 1200×630 share cards -> ogImage
```

The two `scripts/` generators are one-off asset builders, not part of the build — their output is
committed. `generate-og-images.ts` needs re-running after bulk uploads (see "Images").

No automated tests — verify by building and exercising the admin UI under `npm run dev`.

Env: copy `.env.example` → `.env`. Needs `DATABASE_URL` (Postgres), `ADMIN_SESSION_SECRET`
(`openssl rand -base64 32`), `ADMIN_EMAIL`/`ADMIN_PASSWORD` (read only by `seed-admin.ts`), and
`OPERATOR_DEFAULT_PASSWORD` (read only by `seed-admin-users.ts`).

**`SITE_INDEXABLE` — production must set this to `"true"`.** `src/app/robots.ts` reads it per
request; anything else serves a blanket `Disallow: /`. Indexing is opt-in so a staging box that
forgets the variable stays out of search results. After any production deploy, confirm with
`curl -s https://swillfam.com/robots.txt`.

**`NEXT_PUBLIC_SITE_URL` must be the real origin, and it is read at _build_ time.** It is the
`metadataBase` behind every canonical, `og:url` and `og:image`, and it will be the base for the
sitemap and the JSON-LD `@id`s. Because `NEXT_PUBLIC_*` is inlined by the bundler and most public
routes are prerendered, a build is tied to the origin it was built with — rebuild for a different
origin rather than changing the variable on the server. `SITE_INDEXABLE` is different: it is
server-only and read per request, which is what keeps a staging box running a production-origin
build out of the index.

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

## SEO metadata (`src/lib/seo/`)

**Every public route builds its metadata with `buildMetadata()` from `src/lib/seo/metadata.ts`.
Never hand-write `openGraph` or `twitter` in a page.** Next merges metadata *shallowly*, so a page
that defines `openGraph` replaces the parent's wholesale — a page setting only `openGraph.title`
would silently drop `og:site_name`, `og:locale` and the image. `buildMetadata` composes the
complete set (canonical, OG, Twitter) from one input, which is the only thing keeping all 23 routes
consistent. `src/app/layout.tsx` therefore holds *only* `metadataBase` + `icons` + fallback
title/description; it deliberately does not set share tags.

**Each model's fallback chain is declared exactly once, in `src/lib/seo/entities.ts`.**
`venueSeo(venue)`, `eventSeo(event)`, `articleSeo(article)` … each return
`{ title, description, image }`, where every value carries `{ value, source, fieldLabel }`.
`generateMetadata`, the JSON-LD builders and the admin's SEO Details panel all read from there, so
the `<title>`, the OG tags, the schema `name`/`description` and what the admin is shown cannot
disagree. **Never spell a chain out at a call site** — that is how the category page ended up with
`headline` in its `<meta>` but not in its markup. Adding a field to a chain means editing one
function. `resolveDescription`/`resolveOgImage` no longer exist; `resolve.ts` is the only primitive.

- The `source` is what makes the admin panel honest: `manual` (typed into the SEO fields),
  `derived` (taken from the row's own copy, and `fieldLabel` names which field), `default` (a
  built-in). Without it, an admin who left Meta Description blank has no way to tell which field
  to edit to change the snippet.
- `TITLE_RANGE`/`DESCRIPTION_RANGE` in `metadata.ts` are shared by the form's live counters and the
  panel's read-only ones, so the two can't disagree about what "too long" means.
- The panel's JSON-LD preview (`JsonLdPreview`) **fetches the public page and parses its HTML**
  rather than re-running the builders. That makes it identical to what a crawler receives instead
  of a second implementation that could drift, needs no upkeep when a builder changes, and catches
  what a re-render can't: a stale cached page, a block that didn't render, broken escaping.
- **Canonical and image paths are passed site-relative** (`/venues/kilo-jakarta`,
  `/uploads/events/x.png`). `metadataBase` absolutises them. OG images must be the original file
  path, never a `/_next/image?url=` URL — crawlers and chat previews fetch them directly.
- **Descriptions**: a hand-written `metaDescription` is emitted verbatim; derived fallbacks are
  stripped of HTML (`plainText`) and cut to 155 chars at a word boundary. Order fallbacks
  shortest-first in the entity resolver — `shortDescription` before `description`, which is a full
  body paragraph on most rows.
- **Images**: first non-empty in the chain wins, then `buildMetadata` falls back to
  `/og-default.jpg` (1200×630).
- The 16 singleton/archive pages use `staticPageMetadata(key)` instead, which reads the admin's
  `PageSeo` row over the `defaultTitle`/`defaultDescription` in `src/lib/page-seo-registry.ts`.
  **A new static page needs an entry in that registry**, including real defaults — not a generic
  brand string.
- Every model with `metaTitle`/`metaDescription` also has `ogImage`, edited through the shared
  `SeoFields` component. Its create/update actions call `reconcileSingleImage` for it and its
  delete passes `current.ogImage` to `collectImagePaths`, same as any other image field.
- The panel's **Structured data** section is hidden unless `ADMIN_SHOW_STRUCTURED_DATA="true"`
  (server-only, read per request, so a restart is enough — no rebuild). It only hides the preview;
  the JSON-LD on the public pages is unaffected.
- A venue's "Follow Us on Instagram" block is Instagram's profile embed, derived from `instagramUrl` by
  `instagramProfile()` (`src/lib/instagram.ts`) and lazy-loaded; there is no pasted-embed field for
  venues (talents keep theirs). The iframe is not page content and adds nothing to the JSON-LD.
- `src/app/admin/layout.tsx` exists only to mark the whole admin section `noindex, nofollow`.

**`src/app/sitemap.ts` must stay in sync with the routes.** A new public route needs an entry
there or it ships orphaned — static pages come along automatically via the registry, but a new
detail route needs its own `detail(prefix, rows)` line. Two rules it enforces:

- **Every query filter mirrors the guard on its page**, so the sitemap can't advertise a URL that
  `notFound()`s. If you change a page's publish condition, change the sitemap's filter in the same
  commit. The brief requires every URL in the sitemap to return 200 and to be neither noindexed
  nor redirected.
- **`lastModified` is only ever a real `updatedAt`** — a row's own, or `max(updatedAt)` of the
  collection an archive page lists. Pages whose content isn't table-driven get no `lastmod` at all;
  do not invent one. Google discounts a lastmod it finds untrustworthy, which would waste the
  58 genuine ones.

## JSON-LD (`src/lib/schema/`)

**Every public route emits exactly one `@graph` block, server-rendered.** That is the whole point:
AI crawlers don't run JavaScript, so schema added client-side or through GTM is invisible to them —
and the Rich Results Test *does* run JS, so it can't prove the markup is really in the HTML. The
check that can is `curl -s <url> | grep -c 'application/ld+json'`.

- `<JsonLd data={…} />` (`src/components/shared/JsonLd.tsx`) renders the block and escapes `<`, so
  copy containing a closing script tag can't break out of it. Never hand-write the script tag.
- **One builder per page template**, in `src/lib/schema/`: `core.ts` (shared primitives),
  `organization.ts`, `venue.ts`, `event.ts`, `talent.ts`, `article.ts`, `page.ts`. Builders are
  **pure** — they take rows the page already fetched, so markup never costs an extra query.
  Compose the result with `graph(...nodes)`, which drops any node a builder returned as empty.
- **Never emit `""` or `null`.** `graph()` runs everything through `compactDeep`, so an unfilled
  field simply disappears. This is what lets a builder be written as if every field were present —
  do not add your own emptiness checks.
- **Link entities by `@id`, never duplicate them.** The ids are fixed (`venueId(slug)`,
  `talentId`, `eventId`, `articleId`, `ORG_ID`, `WEBSITE_ID`), so an event's `location` and a
  guide's `about` point at the node the venue page defines. The one deliberate exception is
  `Event.location`, which embeds name + address as well: Google's Event check wants the address on
  the event page itself.
- **The root is the bare origin** (`https://swillfam.com`), matching the canonical and the sitemap.
  The spec's samples write it with a trailing slash; three spellings of the homepage in our own
  output is what invites a crawler to treat them as separate URLs.
- **Image URLs must be the original file** — `imageUrl`/`imageUrls` absolutise paths, and a
  `/_next/image?url=…` URL is a QA failure.
- **Dates carry `+07:00`.** `jakartaDateTime(date, "HH:mm", dayOffset)` for an admin-typed calendar
  day (stored as UTC midnight — read it with UTC getters, same contract as `event-calendar.ts`);
  `jakartaInstant(date)` for a real timestamp like `updatedAt`.
- **Static pages take their `name`/`description` from `staticPageSeo(key)`** — the same resolution
  `staticPageMetadata` uses, so a page's markup and its `<title>`/`<meta>` can't describe it
  differently.
- **Only mark up what the page shows.** `faqPage()` is built from the same `faqs` the accordion
  renders; `openingHoursSpecification` comes from `VenueHour` rows and is omitted entirely when a
  venue has only free-text hours, because parsing that string back into days would be guessing.
  `/experience` deliberately ships no `itinerary`, and `/promotions` only breadcrumbs — see the
  comments at each.
- `AccordionContent` uses `forceMount`: Radix renders `isOpen && children`, which kept FAQ answers
  out of the HTML entirely (they reached the browser only inside the RSC payload). **FAQPage markup
  depends on that `forceMount` — if it goes, the FAQPage builders have to go with it.**

## Fields that feed search engines

The columns added for JSON-LD are ordinary admin fields, with one rule that matters more than the
rest: **where a value is shown to visitors *and* emitted as structured data, the displayed string
is derived from the structured source — never stored twice.** The old site's hours and its markup
disagreed precisely because they were two fields.

- **Opening hours** — `src/lib/opening-hours.ts` is the single source. `venueHoursText(rows,
  fallback)` returns `formatOpeningHours(rows)` when a venue has `VenueHour` rows and the free-text
  `operatingHours` otherwise. Every public surface showing hours calls it (`/venues/[slug]`,
  the `/venues` locator, `PromotionDetailTop`) and so does the admin's read-only view, so all of
  them — and the schema — read the same rows. `operatingHours` stays as the fallback for venues
  whose hours aren't structured yet; don't delete it, and don't render it directly.
  `parseHoursJson` lives in the same file as the formatter on purpose: it is the other half of
  `OpeningHoursFields`' wire contract (one hidden field holding `JSON.stringify(rows)`), and
  TypeScript can't connect the two across `JSON.stringify`.
- **The Google Maps link** is built by `googleMapsUrl()` in `src/lib/maps.ts` — Place ID first,
  then coordinates, then the address. The venue page's button and the schema's `hasMap` call it,
  which is why there is no stored maps-URL column to drift from `placeId`.
- **`recapDuration`** is normalised to an ISO 8601 duration by `toIsoDuration()` on save, so the
  column always holds what `VideoObject` requires even though the form accepts "2:15". An
  unparseable value round-trips verbatim rather than being discarded — validate the shape
  (`ISO_DURATION`) before emitting it.
- **Address**: `streetAddress` + `postalCode` are the only per-venue parts. `addressLocality`,
  `addressRegion` and `addressCountry` are the same for every SwillFam venue and belong in the
  schema builder, not in eight rows of the database.
- `Venue.published` is **administrator-only** (like slug and category): `parse()` reads the
  checkbox, and `updateVenueAction` restores `current.published` for operators, since a hidden
  checkbox and an unticked one are indistinguishable in `FormData`.
- A new schema-feeding field needs the column, the form field, the `parse()` line, *and* a line in
  the resource's `VenueDetails`-style read-only view where one exists — a field the admin can't
  see the saved value of gets filled in wrong.
- **The recap video URL is parsed, never passed through.** `parseVideoUrl()` (`src/lib/video.ts`)
  turns whatever the admin pasted into either a player `embedUrl` or a file `contentUrl`, and both
  `EventRecapVideo`'s `<iframe src>` and the `VideoObject`'s `embedUrl` come from that one call.
  `VideoObject.embedUrl` has to be a *player* URL — a `youtube.com/watch?v=` link is not one — and
  a URL the function can't read returns `null`, which is what makes the section and the markup
  appear and vanish together.

## Expiry: what "over" means (`event-scope.ts`, `promotion-scope.ts`)

Admin-typed dates land in Postgres as **UTC midnight** and mean a calendar day, so "has it passed?"
is a day comparison through `startOfUtcDay()` (`src/lib/date.ts`) — a row is current for the whole
of its final day. Three rules, each stated in exactly one place:

- **An event is over when an administrator retired it *or* its last day has gone by.** The date
  half is not optional: both seeded one-off events were still flagged `active` months after they
  ran, which left them sitting in "Upcoming" and on the calendar. `RECURRING` nights have no last
  day and end only by hand. Use `upcomingEventWhere(now)` in any query feeding a list that says
  upcoming / next / current (`/events`, the home calendar, `/experience`, a venue's "What's Coming
  Next", a talent's "Upcoming Events", related events), `pastEventWhere(now)` for "Past Editions",
  and `isPastEvent(event, now)` for a row already fetched.
- **A finished event keeps its page.** It stays a 200 with a "Past Event" stamp, and its reserve CTA
  becomes "Watch the Recap" when there is a recap to point at — never a redirect, never a 404.
  `generateStaticParams` and `sitemap.ts` therefore do *not* filter events by date.
- **An expired promotion 301s to `/promotions`**, from `src/proxy.ts`. It is there and not in the
  page because `permanentRedirect()` emits 308 with no way to choose the code, while the brief, the
  redirect map and the SEO team's curl checks all specify 301 — the same reason `next.config.ts`
  writes `statusCode: 301` instead of `permanent: true`. Deciding it in the proxy also evaluates it
  per request against the real clock instead of freezing it into a prerendered page. An unknown slug
  is left to 404; redirecting it would be a soft 404. Everything that could link to one —
  `livePromotionWhere(now)` in the listing, the sitemap, `generateStaticParams`, a venue's "Current
  Offers", `/experience`, "More Offers To Explore" — filters expired rows out, because a link to a
  redirect is what a crawl reports.

## Headings and landmarks

- **One `<h1>` per page, naming the page's subject.** A venue's H1 is `venue.name`, not its
  `heroTitle` tagline; `HeroTitle` (`src/components/shared/HeroTitle.tsx`) holds that rule for the
  venue and category pages. Taglines are paragraphs.
- **One `<main>`, one `<header>`, one `<footer>` per page.** The `(public)` layout owns the `<main>`;
  a component that adds its own gives the page two competing landmarks (`LegalDocument` did).
  `SiteHeader` renders two bars and `SiteFooter` two rows, but only one of each is the landmark.
- **Every `<nav>` needs an `aria-label`** — the header renders its links twice (mega-nav + compact
  panel), so unnamed navigation landmarks are indistinguishable. The browser filter toggles are
  still `<nav>`s wrapping buttons that don't navigate; a `role="tablist"` would be more honest and
  is not done.
- **Don't skip heading levels.** Section headings are `h2` throughout, including the shared promo
  bands (`DestinationsColumn`, `DestinationsFeatureBand`, `StandForColumnsSection`) — they are
  top-level sections wherever they appear, so an `h3` there has no `h2` to sit under. Cards are `h3`
  *inside* a titled section (`OfferCardSection`) and `h2` when they are the page's top-level list
  (`ArticlesBrowser` on `/guides`).
- Verify against the built HTML with `<script>` blocks stripped. Next serialises client-component
  props into `self.__next_f.push(...)`, so text found inside a `<script>` is payload, not rendered
  markup — that is how the missing FAQ answers hid in Fase 5.

## Images

**Delivery** (`next.config.ts` `images`): AVIF first, WebP second, original last, with a 30-day
`minimumCacheTTL`. The long TTL is safe because `reconcileSingleImage` writes a fresh UUID filename
on every replace — a changed image is a changed URL. Only the committed `public/**` art is
overwritable in place; swapping one of those needs a rename or a cache purge. AVIF is not always
smaller (it loses to WebP on some flat PNGs and to the source on small logos) and Next serves the
first format the browser accepts, not the smallest — the bet is on the hero photographs, which are
every page's LCP element and where it wins widest.

**`priority` belongs to the hero and nothing else.** A preloaded image below the fold competes with
the real LCP element for first-paint bandwidth. Carousels, grids and tab panels are always below a
hero, so they stay lazy. `fill` without `sizes` already defaults to `100vw`, which is correct for a
full-bleed hero — don't add it for its own sake.

**Share images** (`scripts/generate-og-images.ts`): the display art is sized for a full-bleed hero,
not a 1200×630 card, and WhatsApp drops the preview for anything much past ~300 KB — so the most
shared link is the most likely to arrive without a picture. The script fills each row's `ogImage`
with a cropped derivative in `public/og/<model>/<slug>.jpg`, reading the source through the same
`entities.ts` resolver the page uses. It skips a row that already has one, so a hand-picked card is
never overwritten; `--force` regenerates only the files it made. **Re-run it after bulk uploads** —
a photo uploaded through the admin gets no derivative on its own and that row falls back to the
display image. `buildMetadata` declares `og:image:width`/`height` only for paths under `/og/`,
because only those are known to be 1200×630. The schema's `image` deliberately stays the full-size
original: a crawler wants the real photography, a chat preview wants the card.

**Icons** (`scripts/generate-icons.ts`): `favicon.ico`, `icon.png` and `apple-icon.png` are file
conventions in `src/app/`, so Next emits the tags with correct `sizes`/`type` — the root layout
deliberately sets no `icons` key. The manifest's two icons live in `public/` instead, because Next
serves the convention files from content-hashed URLs that a manifest must not hardcode. All of them
are upscaled from an 84px source; a vector or 1024px master would be better and is on the blocked
list.

**Alt text** (`ImageAlt`, `src/lib/image-alt.ts`): keyed by image path, not by a column per field —
alt describes the picture, so the same file reads the same wherever it appears, and `String[]`
gallery fields get it for free. `src/lib/upload.ts` writes the rows with the files and deletes them
with the files; a blank alt deletes the row rather than storing `""`, because "undescribed" and
"decorative" are different claims.

- **`<ContentImage>` is `next/image` for a picture that came out of the database.** It takes the
  same props, but `alt` is the *fallback*: a stored description wins, otherwise the row's name is
  used exactly as before. That is what made it safe to adopt one call site at a time.
- It is async, so **a Client Component cannot render it**. There the server resolves first and
  passes pairs down: `withAlts()` for galleries (`GalleryCarousel`, `DishesSection`), `altFor()` for
  a single image (`EventSectionWithImage`, `ZoomableImage`), or a field on the row type
  (`ArticleRow.alt`, filled by `getArticleRows`).
- **Card thumbnails keep their title** and use plain `next/image`: `OfferCard` renders inside the
  events / promotions / talents browsers, which are Client Components, and the title sits right
  beside the picture. Stored alt belongs on the detail page's own photography.
- `ImageManager` shows the alt input by default. `alts={false}` is for images whose alt is derived
  rather than written — a logo (the venue name), an avatar (the person's name), a share card (the
  page title). Those fields post no `__alts` array at all, and the reconcilers skip the alt write
  entirely when it is absent so a save can't be read as "the admin cleared every description".
- `altsByPath` reaches the forms from each `[id]/page.tsx`, never from the dashboard layout:
  layouts don't re-render on client navigation, so an alt saved a moment ago would come back stale.

**Page-level galleries that aren't a record per photo** (currently only "Moments We've Hosted" on
`/private-events`) are one JSON array of paths in a `SiteSetting` row, edited from a single admin
page with a multi-image `ImageManager` (`/admin/private-event-moments`, administrator-only). A
list that is one ordered set for the whole page doesn't earn a table, and a single uploader beats
creating photos one form at a time. `src/lib/private-event-moments.ts` owns the key and
`parseMoments()`, which degrades a malformed value to "no photos". An empty list hides the section.
`prisma/seed-private-event-moments.ts` (in `seed:all`) seeds the original three photos and never
touches the row once it exists — including when the admin has emptied it.

## Auth (`/admin`)

Custom (not Auth.js): bcrypt password hash + a `jose`-signed httpOnly JWT cookie
(`swillfam_admin_session`, 7-day). The token is stateless, but every request re-reads the
`AdminUser` row, so deleting a user or changing their role/venue/password takes effect immediately.

- **Roles** (`AdminRole`): `ADMINISTRATOR` — everything, including Admin Users (`/admin/users`,
  create/edit/delete + reset anyone's password). `OPERATOR` — exactly one venue (`AdminUser.venueId`):
  that venue's info (not its slug or category), its Events / Promotions / Segment Galleries / FAQs,
  plus all Talents. Everyone gets `/admin/profile` (name, position, avatar, change password).
- `src/lib/auth.ts` — `signSession`/`verifySession` + `isSessionRevoked`: a token whose `iat` predates
  `passwordChangedAt` is rejected, so any password change/reset signs out other sessions.
  `src/lib/session.ts` — cookie name/options.
- `src/proxy.ts` (Next 16's replacement for `middleware.ts`; always runs on Node, so it can query
  Prisma) gates every `/admin/:path*` page except `/admin/login`: invalid/revoked sessions go to
  login, and operators are kept inside their allowlist (`OPERATOR_SECTIONS`, own venue, profile).
  It **must live in `src/`** (same level as `app/`) — at the repo root Next silently ignores it.
  Its matcher also carries `/promotions/:slug`, the one public path it touches, for the expired-offer
  301 described under "Expiry" above; `proxy()` dispatches on prefix. Keep the matcher tight — every
  matched path pays for the proxy on every request.
- `src/lib/admin-auth.ts` — the data-access layer: `getCurrentAdmin` (per-request `cache()`),
  `requireAdmin`/`requireAdministrator`, and operator scoping: `venueWhere` (list filter),
  `assertVenueOwnership` (per-row 404), `resolveVenueId` (forces the venue on write), `lockedVenue`
  (form prop), `venueFaqWhere`/`assertFaqOwnership` (FAQs are keyed by `segment: "venue"` + `refSlug`).
- **Every Server Action and every page must start with a guard** — `requireAdministrator()` for
  administrator-only resources, `requireAdmin()` + the ownership helpers for venue-scoped ones. The
  proxy is only the first line: Server Actions are separate entry points it can't scope, and pages
  re-check so a proxy miss never exposes data. `events/` is the reference for scoped CRUD.
- **No in-app signup** — `prisma/seed-admin.ts` (the administrator) and `prisma/seed-admin-users.ts`
  (one operator per venue, `admin@<first slug segment>.com`; never overwrites an existing password)
  bootstrap accounts; after that, administrators manage them in `/admin/users`. `login`/`logout` live
  outside the `(dashboard)` group so they aren't wrapped in the sidebar shell.

## Admin CRUD pattern (the core thing to replicate)

Every resource lives at `src/app/admin/(dashboard)/<resource>/` with the same shape:

- `page.tsx` — list via the generic `AdminTable` (`columns`/`getKey`/`empty`).
- `new/page.tsx` — blank form. `[id]/page.tsx` — fetch-by-id-or-404, pre-filled form + delete.
  Exception: **venues** — `[id]/page.tsx` is a read-only Venue Info page (`VenueDetails` + the
  venue's events/promotions/talents tabs; operators land here after login), and the form + delete
  live at `[id]/edit/page.tsx`.
- `actions.ts` — colocated `"use server"` `createX`/`updateX`/`deleteX`, ending in
  `revalidatePath(...)` + `redirect(...)`. No REST layer — Server Actions only.
- Form component in `src/components/admin/<Resource>Form.tsx`, composed from shared primitives.

Shared building blocks (use these instead of re-implementing inputs/tables):
`form-fields.tsx` (`Field`/`SelectField`/`TextareaField`/`CheckboxField`/`SaveButton`/`toDateInputValue`),
`AdminTable.tsx`, `PageHeader.tsx` (`PageHeader`/`EditHeader`/`Card`), `Thumb.tsx`, `NameForm.tsx`
(name-only resources), `RichTextEditor.tsx` (Tiptap → hidden input HTML), `SlugField.tsx`
(auto-fills from a sibling field until edited), `ConfirmDeleteButton.tsx`, `EventScheduleFields.tsx`.
`/admin` redirects by role: administrators → `/admin/inquiries`, operators → their Venue Info page.

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
- `AdminUser.role` is the `AdminRole` enum (`ADMINISTRATOR`/`OPERATOR`, defaulting to the
  least-privileged `OPERATOR`); `venueId` is set for operators only. If an operator's venue is
  deleted (SetNull) they can only reach `/admin/profile` until an administrator reassigns them.
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
- **The schema.org enums store their tokens verbatim** — `VenueSchemaType`
  (`Restaurant`/`BarOrPub`/…), `EventSchemaType`, `EventStatus` — deliberately breaking the file's
  SCREAMING_SNAKE convention. The stored value *is* what the JSON-LD emits, which removes the
  mapping layer that would otherwise be the only place a typo could hide (a wrong `@type` is still
  valid JSON-LD and fails silently). Their option lists live in `src/lib/schema-options.ts`, kept
  Prisma-free so the forms can import them; `allowedValues()` narrows a posted value before it
  reaches Postgres.
- `VenueHour` is the one **owned child** — one row per group of days sharing an open/close pair,
  mapping 1:1 to an `OpeningHoursSpecification`. It still follows the optional-FK/`SetNull` rule so
  venue deletion can't fail, so `deleteVenueAction` clears the rows explicitly (orphans would
  otherwise be unreachable dead weight). Updates replace the set wholesale
  (`hours: { deleteMany: {}, create: … }`) — nothing references an hours row by id.

The public `/contact` form (`src/app/(public)/contact/actions.ts`) is the only public writer — it creates
`Inquiry` rows behind a honeypot + an in-memory sliding-window rate limiter (`src/lib/rate-limit.ts`,
3/10min per IP, resets on restart). `Application` rows are also public-submitted (admin gets list +
read-only detail + delete only), but the public application form is part of the unbuilt public pages.

