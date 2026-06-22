# Figma Structure — Swillfam

Reference map of the Swillfam design in Figma, for building the (not-yet-built) public consumer
pages. Every value below was sampled directly from the design nodes — the file has **no Figma
variables, styles, or components**, so the design system here is **inferred** from raw node styles
via the Figma MCP `get_design_context`. Node IDs are included so each item can be re-opened in
Figma.

- **File:** `Galo-Website-Designs-2026`
- **File key:** `X44kMxcudMZdHSHT35uFbi`
- **Open:** https://www.figma.com/design/X44kMxcudMZdHSHT35uFbi/Galo-Website-Designs-2026?node-id=231-4

---

## Pages

The document has a **single page**:

| Page | Node ID |
| --- | --- |
| `Page 1` | `0:1` |

`Page 1` holds three **unrelated** design sets that happen to share the file: a **DPP** law-firm
template, a **Sandei** blinds/partitions homepage, and the **Swillfam** design documented here.
Only Swillfam is in scope. (Note: the page-level metadata response from Figma is capped and omits
the Swillfam artboard, so it must be queried by its node ID directly.)

---

## Frames

The Swillfam work is a single artboard:

| Frame | Node ID | Size |
| --- | --- | --- |
| **SwillFam - Home** | `231:4` | 1440 × 6969 |

> Only the Home artboard exists for Swillfam. Other site pages implied by the nav (Venues, Events,
> Promotions, Talents, Merchandise, Guides/Journal, Contact, etc.) are **not yet designed**.

### Sections of `SwillFam - Home` (top → bottom)

| # | Section | Anchor node(s) | Key elements |
| --- | --- | --- | --- |
| 1 | **Header / mega-nav** | bar `231:100`, logo `231:104` | Logo (left). Nav in 3 columns: **Venues / Events / About Us** (`458:142`,`458:143`,`231:102`); **The Swillfam Experience / Private Events / Promotions / Talents** (`291:15`,`458:145`,`458:146`,`527:379`); **Exclusive / Merchandise / Guides·Journal / Contact** (`291:16`,`458:148`,`458:150`,`458:152`) |
| 2 | **Hero** | mask `231:96`, wordmark `231:109` | Full-bleed image (715px tall) + giant "SWILLFAM" wordmark; tagline "Discover the City's Best Lifestyle & Nightlife Experiences" (`291:8`); floating featured-event card (`471:3` → icon `471:6`, title `471:7`, body `471:8`) |
| 3 | **Explore by Category** | title `302:2` | Two large tiles — **LIFESTYLE** (`302:10` image, `302:12` label) and **NIGHTLIFE** (`302:11` image, `302:14` label); divider line `435:14`, frame outline `441:28` |
| 4 | **Upcoming Events** | title `302:15`, subhead `305:16` | 3 event poster cards (`305:29`,`305:30`,`435:2`); eyebrow + blurb (`305:27`,`305:28`); **SEE ALL EVENTS** pill (`441:44`/`441:46`) |
| 5 | **The SwillFam Experience** | title `312:32`, lead `312:33` | Illustrated day→night venue route graphic (`450:886`): MORNING·Kilo Cafe → AFTERNOON·Atsumaru → DINNER → AFTER DINNER·Dualism Truce → NIGHT (`450:453`–`450:523`); **DISCOVER EXPERIENCE** outline pill (`790:128`/`790:130`) |
| 6 | **Trusted by the City's Crowd** | title `441:48`, lead `441:49` | 3 testimonial/community cards (`441:50`,`441:52`,`441:54`) — each card pairs an abstract image (`844:158`/`844:160`/`844:159`) with a title (`441:66`/`74`/`77`) + body (`441:67`/`75`/`78`) |
| 7 | **Guides & Journals** | title `441:81`, lead `441:82` | Dated article rows — date `441:94` (22/06/2026), title `441:89`, excerpt `441:90`, thumbnail `441:91` (×3); **SEE ALL Guides** pill (`441:103`/`441:105`) |
| 8 | **Latest Exclusive Content + Event Recap** | title `790:124`, media `441:108`/`441:109`, recap title `441:111` | Single block: heading over a large full-width media/recap panel ("Event Recap Title"); **VIEW EXCLUSIVE CONTENTS** pill (`831:315`/`831:317`) |
| 9 | **Footer / Newsletter** | group `831:313` | "Stay in the Loop!" (`453:900`), email input + line (`453:902`,`453:903`), **SUBSCRIBE** pill (`453:919`/`453:921`); address — *Fairgrounds, SCBD lot 14, Jl. Jenderal Sudirman, Jakarta* (`453:901`); `contact@swillfam.com` (`453:906`); footer nav (`453:935`,`453:937`); socials (`453:907`,`453:942`); © 2026 Swillfam (`453:904`); Privacy / Terms (`453:905`) |

> **Correction (verified while building the page):** this is a **9-section** page. The three
> abstract gradients `844:158/159/160` are the visuals *inside* the Trusted cards (not a standalone
> tile row), and "Latest Exclusive Content" + "Event Recap" are a **single** block.

---

## Components

**There are no Figma components or instances in this file** — every element is a raw frame, text,
rectangle, line, or vector. Below are the **recurring UI patterns** worth building as React
components when the public pages are implemented, each with a representative node to copy styles from:

| Pattern | Representative node | Notes |
| --- | --- | --- |
| **Pill button — primary** | `441:44` + `441:46` | Filled `#C6387F`, `rounded-[30px]`, h 50, ~w 276, 16px Archivo label, uppercase |
| **Pill button — secondary** | `790:128` + `790:130` | Transparent w/ `#C6387F` 1px border, otherwise identical |
| **Section heading + lead** | `441:48` + `441:49` | 64px Syne title (center or left) over 24px Acumin lead |
| **Eyebrow + blurb** | `305:27` + `305:28` | 16px Syne SemiBold label over 14px Acumin body |
| **Category tile** | `302:10` (`302:12` label) | Full image mask + 48px Syne ExtraBold uppercase label overlay |
| **Event poster card** | `305:29` | Portrait image card (~290 × 516) |
| **Testimonial / community card** | `441:50` | 448 × 507 card, title + body |
| **Guide / article row** | `441:89` + `441:94` + `441:91` | Date · 28px Syne title · excerpt · square thumbnail |
| **Featured-event mini card** | `471:3` | Rounded panel: icon + 16px Archivo SemiBold title + 14px body |
| **Newsletter form** | `453:900`–`453:921` | Title + underline email input + SUBSCRIBE pill |
| **Mega-nav (3-column)** | `231:100` | Logo + grouped link columns |
| **Footer** | `831:313` | Newsletter + address/contact + nav columns + socials + legal row |

---

## Design System (inferred)

- **Theme:** dark, photography-led nightlife/lifestyle aesthetic. Near-black canvas, white type,
  single hot-magenta accent.
- **Canvas / layout:** 1440px wide. Content column inset ~**25px** left/right (`left-[25px]`,
  content width 1390 — e.g. section frame `441:28` is x25 / w1390). Full-bleed imagery in hero,
  experience, and recap sections.
- **Shape language:** pill CTAs `rounded-[30px]` (h 50); rounded image/card masks; thin **1px
  hairlines** in `#3B3A35` as section/footer dividers (`435:14`, `441:24`, `453:903`, …).
- **Rhythm:** large 64px section titles, generous vertical spacing, alternating left-aligned and
  center-aligned section headers.
- **Code mapping:** repo uses **Tailwind v4** (`src/app/globals.css` `@theme`). The color and type
  tokens below are named so they can be dropped into the theme later (out of scope for this doc).

---

## Typography (inferred)

**Font families used** (no weights are bound to variables — listed weights are the literal styles
found in nodes):

| Family | Role | Weights seen |
| --- | --- | --- |
| **Syne** | Primary display, headings, nav links, on-image CTAs | Regular, SemiBold, Bold, ExtraBold |
| **Acumin Variable Concept** | Body copy, lead paragraphs, meta/dates, input placeholder | Regular, Light |
| **Archivo** | Button labels, eyebrow labels, experience-graphic labels | Light, Regular, SemiBold, Bold |
| **Inter** | Footer legal microcopy | Light, Regular |
| **VLANÈLLA BOLD** | One-off decorative footer label (`453:937`) | Regular |

**Type scale** (role → family / px / weight, with a sample node):

| Role | Family | Size | Weight | Sample |
| --- | --- | --- | --- | --- |
| Hero wordmark | Syne | **130px** | Bold | `231:109` SWILLFAM |
| Section title (H2) | Syne | **64px** | Regular | `302:15`, `441:48`, `441:81`, `790:124` |
| Category tile label | Syne | 48px | ExtraBold | `302:12` LIFESTYLE |
| Newsletter title | Syne | 48px | Regular | `453:900` Stay in the Loop! |
| Hero tagline | Syne | 33px (lh 33) | SemiBold | `291:8` |
| Card / article title (H3) | Syne | 28px | Regular | `441:89` |
| Small card title | Syne | 24px | Bold | `441:66` |
| Section lead / subhead | Acumin Variable Concept | 24px | Regular | `312:33`, `441:49`, `441:82` |
| Eyebrow label | Syne / Archivo | 16px | SemiBold | `305:27`, `471:7` |
| Button label | Archivo | 16px | Regular | `441:46` SEE ALL EVENTS |
| Inline CTA / Subscribe | Syne | 16px | Regular | `441:105`, `831:317`, `453:921` |
| Body copy | Acumin Variable Concept | 14px | Regular | `305:28`, `441:67`, `441:90` |
| Nav link | Syne | 14px | Regular / Bold (active) | `458:142`, `458:152` |
| Meta / date | Acumin Variable Concept | 14px | Regular | `441:94` 22/06/2026 |
| Input placeholder | Acumin Variable Concept | 18px | Light | `453:902` |
| Footer legal | Inter | 14px | Light | `453:904`, `453:905` |
| Experience graphic — period | Archivo | 13.2px | Bold | `450:453` DINNER |
| Experience graphic — venue | Archivo | 18px | Light | `450:507` Kilo Cafe |

> Letter-spacing is not encoded as a token; uppercase labels (nav, buttons, category tiles) appear
> tracked but no explicit value was found in the nodes. Line-height is mostly `normal` with a few
> fixed values (40px on `302:2`, 33px on the hero tagline).

---

## Color Tokens (inferred)

No color variables/styles exist; these are the distinct fills found across the artboard. Names are
proposed for a future Tailwind `@theme`.

| Proposed token | Value | Usage |
| --- | --- | --- |
| `--bg` | `#0A0A0A` | Page background (`bg-[#0a0a0a]`) |
| `--bg-deep` | `#0B0B0A` | Hero gradient base; transparent stop `rgba(11,11,10,0)` |
| `--surface` | `#131313` | Cards, nav bar, footer panels (`bg-[#131313]`, ×4) |
| `--border` | `#3B3A35` | Hairline dividers & card outlines (×11) |
| `--accent` | `#C6387F` | Hot magenta — primary button fill/border, experience graphic, highlights |
| `--text` | `#FFFFFF` | Primary text — nearly all type (`text-white`, ×64) |
| `--overlay` | `rgba(19,19,19,0.7)` | Image-darkening overlay |
| _(transparent)_ | `rgba(0,0,0,0)` | Gradient end stops |

**Palette at a glance:** near-black base (`#0A0A0A`) · dark surface (`#131313`) · warm-gray hairline
(`#3B3A35`) · magenta accent (`#C6387F`) · white text. There is no separate muted-text token —
secondary copy is white (often over imagery), so a reduced-opacity white is the likely intent if a
second text tier is needed.

---

## Follow-ups (not done here)

- Add the inferred tokens above to `src/app/globals.css` (`@theme`) and wire the four web fonts
  (Syne, Acumin Variable Concept, Archivo, Inter) — Syne, Archivo, and Inter are on Google Fonts;
  **Acumin Variable Concept** is an Adobe/Typekit font and will need licensing or a substitute.
- Build the public pages/components from the patterns table; the Home artboard is the only Swillfam
  screen designed so far.
