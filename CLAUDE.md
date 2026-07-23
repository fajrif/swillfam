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

## Integrate the <FlowingMenu /> component from React Bits

You are helping integrate an open-source React component into an existing application.

### Component: FlowingMenu
### Variant: JavaScript + CSS
### Dependencies: gsap

---

### Usage Example
```jsx
import FlowingMenu from './FlowingMenu'

const demoItems = [
  { link: '#', text: 'Mojave', image: 'https://picsum.photos/600/400?random=1' },
  { link: '#', text: 'Sonoma', image: 'https://picsum.photos/600/400?random=2' },
  { link: '#', text: 'Monterey', image: 'https://picsum.photos/600/400?random=3' },
  { link: '#', text: 'Sequoia', image: 'https://picsum.photos/600/400?random=4' }
];

<div style={{ height: '600px', position: 'relative' }}>
  <FlowingMenu items={demoItems} />
</div>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| items | object[] | [] | An array of objects containing: link, text, image. |
| speed | number | 15 | Duration of the marquee animation in seconds (lower = faster). |
| textColor | string | #ffffff | Color of the static menu text. |
| bgColor | string | #120F17 | Background color of the menu container. |
| marqueeBgColor | string | #ffffff | Background color of the marquee overlay. |
| marqueeTextColor | string | #120F17 | Text color inside the marquee. |
| borderColor | string | #ffffff | Color of the dividing lines between menu items. |

### Full Component Source
```jsx
import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

import './FlowingMenu.css';

function FlowingMenu({
  items = [],
  speed = 15,
  textColor = '#fff',
  bgColor = '#120F17',
  marqueeBgColor = '#fff',
  marqueeTextColor = '#120F17',
  borderColor = '#fff'
}) {
  return (
    <div className="menu-wrap" style={{ backgroundColor: bgColor }}>
      <nav className="menu">
        {items.map((item, idx) => (
          <MenuItem
            key={idx}
            {...item}
            speed={speed}
            textColor={textColor}
            marqueeBgColor={marqueeBgColor}
            marqueeTextColor={marqueeTextColor}
            borderColor={borderColor}
          />
        ))}
      </nav>
    </div>
  );
}

function MenuItem({ link, text, image, speed, textColor, marqueeBgColor, marqueeTextColor, borderColor }) {
  const itemRef = useRef(null);
  const marqueeRef = useRef(null);
  const marqueeInnerRef = useRef(null);
  const animationRef = useRef(null);
  const [repetitions, setRepetitions] = useState(4);

  const animationDefaults = { duration: 0.6, ease: 'expo' };

  const findClosestEdge = (mouseX, mouseY, width, height) => {
    const topEdgeDist = distMetric(mouseX, mouseY, width / 2, 0);
    const bottomEdgeDist = distMetric(mouseX, mouseY, width / 2, height);
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
  };

  const distMetric = (x, y, x2, y2) => {
    const xDiff = x - x2;
    const yDiff = y - y2;
    return xDiff * xDiff + yDiff * yDiff;
  };

  useEffect(() => {
    const calculateRepetitions = () => {
      if (!marqueeInnerRef.current) return;

      // Get the first marquee part to measure content width
      const marqueeContent = marqueeInnerRef.current.querySelector('.marquee__part');
      if (!marqueeContent) return;

      const contentWidth = marqueeContent.offsetWidth;
      const viewportWidth = window.innerWidth;

      // Calculate how many copies we need to fill viewport + extra for seamless loop
      // We need at least 2, but calculate based on content vs viewport
      const needed = Math.ceil(viewportWidth / contentWidth) + 2;
      setRepetitions(Math.max(4, needed));
    };

    calculateRepetitions();
    window.addEventListener('resize', calculateRepetitions);
    return () => window.removeEventListener('resize', calculateRepetitions);
  }, [text, image]);

  useEffect(() => {
    const setupMarquee = () => {
      if (!marqueeInnerRef.current) return;

      const marqueeContent = marqueeInnerRef.current.querySelector('.marquee__part');
      if (!marqueeContent) return;

      const contentWidth = marqueeContent.offsetWidth;
      if (contentWidth === 0) return;

      if (animationRef.current) {
        animationRef.current.kill();
      }

      // Animate exactly one content width for seamless loop
      animationRef.current = gsap.to(marqueeInnerRef.current, {
        x: -contentWidth,
        duration: speed,
        ease: 'none',
        repeat: -1
      });
    };

    // Small delay to ensure DOM is ready after repetitions update
    const timer = setTimeout(setupMarquee, 50);

    return () => {
      clearTimeout(timer);
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [text, image, repetitions, speed]);

  const handleMouseEnter = ev => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const edge = findClosestEdge(x, y, rect.width, rect.height);

    gsap
      .timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' }, 0);
  };

  const handleMouseLeave = ev => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const edge = findClosestEdge(x, y, rect.width, rect.height);

    gsap
      .timeline({ defaults: animationDefaults })
      .to(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .to(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0);
  };

  return (
    <div className="menu__item" ref={itemRef} style={{ borderColor }}>
      <a
        className="menu__item-link"
        href={link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ color: textColor }}
      >
        {text}
      </a>
      <div className="marquee" ref={marqueeRef} style={{ backgroundColor: marqueeBgColor }}>
        <div className="marquee__inner-wrap">
          <div className="marquee__inner" ref={marqueeInnerRef} aria-hidden="true">
            {[...Array(repetitions)].map((_, idx) => (
              <div className="marquee__part" key={idx} style={{ color: marqueeTextColor }}>
                <span>{text}</span>
                <div className="marquee__img" style={{ backgroundImage: `url(${image})` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlowingMenu;

```

### Component CSS
```css
.menu-wrap {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.menu {
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0;
  padding: 0;
}

.menu__item {
  flex: 1;
  position: relative;
  overflow: hidden;
  text-align: center;
  border-top: 1px solid;
}

.menu__item:first-child {
  border-top: none;
}

.menu__item-link {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  position: relative;
  cursor: pointer;
  text-transform: uppercase;
  text-decoration: none;
  white-space: nowrap;
  font-weight: 600;
  font-size: 4vh;
}

.menu__item-link:hover {
  color: inherit;
}

.menu__item-link:focus:not(:focus-visible) {
  color: inherit;
}

.marquee {
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;
  pointer-events: none;
  transform: translate3d(0, 101%, 0);
}

.marquee__inner-wrap {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.marquee__inner {
  display: flex;
  align-items: center;
  position: relative;
  height: 100%;
  width: fit-content;
  will-change: transform;
}

.marquee__part {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.marquee span {
  white-space: nowrap;
  text-transform: uppercase;
  font-weight: 400;
  font-size: 4vh;
  line-height: 1;
  padding: 0 1vw;
}

.marquee__img {
  width: 200px;
  height: 7vh;
  margin: 2em 2vw;
  padding: 1em 0;
  border-radius: 50px;
  background-size: cover;
  background-position: 50% 50%;
}

```

### Integration Instructions
1. Install any listed dependencies.
2. Copy the component source into the appropriate directory in the project.
3. Import the CSS file alongside the component.
4. Import and render the component using the usage example above as a starting point.
5. Adjust props as needed for the specific use case — refer to the props table for all available options.

