# Plan: Build the SwillFam Home page layout

## Context

The repo's public consumer pages are not built yet — `src/app/page.tsx` still renders a leftover
**brutalist POS-marketing** landing (light cream theme, lime/orange accents) inherited from the fork.
We now have the real Swillfam design (Figma frame **`231:4` "SwillFam - Home"**, 1440 × 6969) and a
reference doc (`FIGMA_STRUCTURE.md`). The goal of this pass is to **replace the homepage with the
SwillFam - Home layout** — a dark nightlife/lifestyle page — at **full fidelity** (real Figma
images, matched spacing), **desktop-first with responsive mobile collapse**, using **free font
substitutes**.

This is additive and must **not break** the other pages that share the root layout (`/features`,
`/contact`, `/privacy`, `/terms`, and the admin shadcn theme). Those keep the existing
Michroma/Outfit fonts + brand tokens; we introduce a separate `sf-*` token namespace for Swillfam.

**Structure correction discovered during planning** (supersedes `FIGMA_STRUCTURE.md`): the page is
**9 sections**, not 10 — the three abstract gradient images (`844:158/159/160`) are the visuals
*inside* the "Trusted by the City's Crowd" cards, and "Latest Exclusive Content" + "Event Recap" are
a **single** block. I'll fix the doc to match while building.

## Stack facts to reuse (from codebase exploration)

- **Tailwind v4**, tokens in `src/app/globals.css` `@theme` (e.g. `--color-brand-*`, `--font-display`
  = `var(--font-michroma)`). Add new tokens here; don't touch the existing ones or the shadcn
  OKLch `:root`/`.dark` block.
- **Fonts** loaded in `src/app/layout.tsx` via `next/font/google` and exposed as CSS vars on
  `<html>`. Add the new families the same way (purely additive class names).
- **`cn()`** helper at `src/lib/utils.ts` (clsx + tailwind-merge). **cva** available for variants.
  **lucide-react** for icons. **next/image** for assets. shadcn primitives in `src/components/ui/`
  exist but are admin-only — the new sections are bespoke, no shadcn needed.
- Brutalist landing components live in `src/components/landing/` and are still used by `/features`
  and `/contact` (Navbar/Footer/ScrollEffects). **Leave them in place**; build the new homepage in a
  fresh `src/components/home/` namespace so nothing else breaks.

## Approach

Implement section-by-section. For each Figma section, call Figma MCP `get_design_context` on its
node to get accurate measurements/markup, then **adapt** rather than paste: convert the absolute-
positioned canvas output into **flow layout** (flex/grid), swap raw hex → `sf-*` tokens, swap font
classes → the new font vars, use `next/image`, and add responsive breakpoints (1-column stacks
below `lg`). Match the 1440 desktop composition first, then layer mobile rules.

### 1. Foundations

**Fonts — `src/app/layout.tsx`** (additive): load `Syne` (400/600/700/800), `Archivo`
(300/400/600/700), and `Inter` (300/400) from `next/font/google`, each with a `--font-*` variable,
and append their `.variable`s to the existing `<html>` className. Inter substitutes the Adobe
"Acumin Variable Concept" body font. Keep Michroma/Outfit. Update the homepage's `<title>`/metadata
via a `metadata` export in `page.tsx` (override the stale POS title).

**Tokens — `src/app/globals.css` `@theme`** (additive): add the inferred SwillFam palette + fonts:
```
--color-sf-bg: #0a0a0a;        --color-sf-deep: #0b0b0a;
--color-sf-surface: #131313;   --color-sf-border: #3b3a35;
--color-sf-accent: #c6387f;    --color-sf-text: #ffffff;
--font-syne: var(--font-syne); --font-archivo: var(--font-archivo); --font-inter: var(--font-inter);
```
These yield `bg-sf-bg`, `text-sf-text`, `border-sf-border`, `bg-sf-accent`, `font-syne`, etc. The
homepage root wrapper sets `bg-sf-bg text-sf-text font-inter min-h-dvh` so the dark theme is scoped
to the page (other routes keep the cream body background).

### 2. Assets (full fidelity)

Download the section imagery from Figma into **`public/home/`** and reference via `next/image`.
Sources: the `figma.com/api/mcp/asset/...` URLs already present in the saved `get_design_context`
output, or the Figma MCP `download_assets` tool. Assets to pull: hero background (`231:96`), header
logo (`231:104`) + footer signature (`453:899`), the two category tile photos (`302:10/302:11`),
3 event posters (`305:29/305:30/435:2`), 3 "Trusted" abstract gradients (`844:158/159/160`), guide
thumbnails (`441:91/92/93`), the exclusive/recap media (`441:108`). **The Experience graphic
(`450:886`)** is an elaborate illustrated vector route — export it as a **single PNG/SVG asset**
(via screenshot/download of `450:886`) rather than reconstructing the vectors; overlay live text if
cheap, otherwise bake it in.

### 3. Components — new `src/components/home/`

Primitives:
- **`PillButton.tsx`** — cva variants `filled` (bg `sf-accent`) / `outline` (1px `sf-accent`
  border); `rounded-[30px]`, h 50, 16px Archivo uppercase label. Models nodes `441:44` / `790:128`.
- **`SectionHeading.tsx`** — 64px Syne title (`text-[clamp(...)]`) + optional 24px Inter lead;
  left/center alignment prop.

Sections (server components unless interactivity noted), composed in this order:

| Component | Figma node | Renders |
| --- | --- | --- |
| `SiteHeader.tsx` | `231:100` | Logo + 3-column mega-nav (Venues/Events/About Us · The Swillfam Experience/Private Events/Promotions/Talents · Exclusive/Merchandise/Guides·Journal/Contact). **Client** if mobile drawer added. |
| `Hero.tsx` | `231:96`,`231:109` | Full-bleed photo, 130px Syne "SWILLFAM" wordmark (live text), tagline, floating featured-event mini-card (`471:3`) |
| `ExploreCategory.tsx` | `302:2` | Two photo tiles LIFESTYLE / NIGHTLIFE with 48px Syne ExtraBold overlay labels |
| `UpcomingEvents.tsx` | `302:15` | Left text column (title + lead + `SEE ALL EVENTS` pill) · right row of 3 portrait event posters |
| `Experience.tsx` | `312:32`,`450:886` | Centered heading + lead + the day→night route graphic asset + `DISCOVER EXPERIENCE` outline pill |
| `TrustedCrowd.tsx` | `441:48` | Centered heading + lead + 3-up card grid (abstract image `844:*` + title + body) |
| `GuidesJournals.tsx` | `441:81` | Left column (title + lead + `SEE ALL Guides` pill) · right column of 3 horizontal article rows (thumb + date + 28px title + excerpt) |
| `ExclusiveRecap.tsx` | `790:124`,`441:108` | "Latest Exclusive Content" heading + large media/recap block (`Event Recap Title`) + `VIEW EXCLUSIVE CONTENTS` pill |
| `SiteFooter.tsx` | `831:313` | "Stay in the Loop!" newsletter (email input + `SUBSCRIBE` pill), address (Fairgrounds, SCBD, Jakarta), `contact@swillfam.com`, footer nav columns, socials, © 2026, Privacy/Terms. **Client** for the input. |

Content is **static/hardcoded** to match the Figma (lorem where the design uses lorem); wiring to
the CMS models (Event/Article/Inquiry) is a deliberate later pass.

### 4. Page — `src/app/page.tsx`

Replace the brutalist composition with a dark `<main className="bg-sf-bg text-sf-text font-inter">`
wrapper composing the 9 components above + `metadata` export. Container pattern per section:
`mx-auto max-w-[1440px] px-5 lg:px-[25px]`, sections stack to one column below `lg`.

### Section geometry reference (1440 canvas, for the executor)

```
Header      top 0     h172   logo left; nav cols x871 / x1005 / x1259
Hero        0–715     wordmark top546 (w907 h169); tagline x871 top571; mini-card x871 top442 (401×106)
Categories  title top791; tiles band x25 top866 w1390 h665 → 2 tiles ~645 wide side by side
Upcoming    left text x26 top1628 w631 + button top1865; posters x720/x1024/x1328 top1628 (~290×517)
Experience  title top2374 (centered w938); graphic x25 top2577 w1390 h654; button centered top3285
Trusted     title top3459 (centered); 3 cards x25/x496/x967 top3696 (448×507) each w/ abstract image
Guides      left col x25 top4370 w631 (title+lead+button top4634); 3 rows x720 top4370/4623/4876 (695×228)
Exclusive   title top5215 (centered); media x25 top5335 (1390×625); button centered top6010
Footer      group top6227 h742 (6227–6969)
```

## Verification

- `npm run build && npm run lint` — must pass (build runs the TS typecheck; React Compiler is on).
- `npm run dev`, open `/` — visually compare each section against the Figma screenshot of `231:4`
  (use Figma MCP `get_screenshot` per section node to diff). Confirm fonts (Syne headings, Archivo
  buttons), the magenta `#c6387f` accents, and dark `#0a0a0a` background render correctly.
- Resize to mobile (~390px) and tablet — confirm each section collapses to a sensible single-column
  stack with no horizontal overflow.
- Smoke-check the other shared-layout routes (`/features`, `/contact`, `/terms`, `/admin`) still
  render with their original cream/zinc themes (proves the changes were non-destructive).

## Out of scope (follow-ups)

- Wiring sections to live CMS data (Events, Articles, newsletter/inquiry submit) — static for now.
- Building the destination pages the nav links to (Venues, Events, etc.).
- Re-theming `/features`, `/contact`, legal pages to the SwillFam brand.
- Updating `FIGMA_STRUCTURE.md` for the 9-section correction (small doc edit, done alongside).
