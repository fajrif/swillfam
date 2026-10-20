/**
 * The 16 singleton/archive public pages that have no other backing DB row.
 *
 * `label` names the page in the admin Page SEO screen. `defaultTitle` and
 * `defaultDescription` are what the page emits when nobody has filled the SEO
 * fields in — every one of these used to fall back to the bare string
 * "SwillFam", which made 16 pages share one title and ship no description at
 * all. They are written to stand on their own in a SERP, and an admin value
 * always wins over them.
 *
 * `defaultTitle` omits the "| SwillFam" suffix; `pageTitle()` adds it, and
 * skips titles that already name the brand.
 */
export const STATIC_PAGE_SEO_DEFS = [
  {
    key: "home",
    label: "Home",
    path: "/",
    defaultTitle: "SwillFam — Jakarta Lifestyle & Nightlife Venues",
    defaultDescription:
      "SwillFam runs Jakarta's lifestyle and nightlife venues — restaurants, cafés, cocktail bars and clubs across SCBD, Senopati and Ashta District 8.",
  },
  {
    key: "about",
    label: "About",
    path: "/about",
    defaultTitle: "About SwillFam",
    defaultDescription:
      "The story behind SwillFam — the Jakarta hospitality group behind Kilo, Zoo, Le Cirque, Dualism, Truce and Swillhouse.",
  },
  {
    key: "careers",
    label: "Careers",
    path: "/careers",
    defaultTitle: "Careers",
    defaultDescription:
      "Open roles across SwillFam's Jakarta venues — kitchen, bar, floor, events and head office. See what we're hiring for and apply online.",
  },
  {
    key: "contact",
    label: "Contact",
    path: "/contact",
    defaultTitle: "Contact",
    defaultDescription:
      "Get in touch with the SwillFam team for reservations, private events, partnerships, press enquiries or general questions.",
  },
  {
    key: "experience",
    label: "The SwillFam Experience",
    path: "/experience",
    defaultTitle: "The SwillFam Experience",
    defaultDescription:
      "One day, every mood — a route through SwillFam's Jakarta venues, from morning coffee and padel to dinner, cocktails and the last set of the night.",
  },
  {
    key: "exclusive",
    label: "Exclusive",
    path: "/exclusive",
    defaultTitle: "Exclusive",
    defaultDescription:
      "Recap videos and behind-the-scenes film from inside SwillFam's Jakarta venues, parties and events.",
  },
  {
    key: "media-mentions",
    label: "Media Mentions",
    path: "/media-mentions",
    defaultTitle: "Media Mentions",
    defaultDescription:
      "SwillFam and its venues in the press — features, reviews and coverage from Indonesian and international media.",
  },
  {
    key: "merchandise",
    label: "Merchandise",
    path: "/merchandise",
    defaultTitle: "Merchandise",
    defaultDescription:
      "Caps, tees and accessories from SwillFam and its Jakarta venues. Limited drops — wear it home from the party.",
  },
  {
    key: "privacy",
    label: "Privacy Policy",
    path: "/privacy",
    defaultTitle: "Privacy Policy",
    defaultDescription:
      "How SwillFam collects, uses and protects the personal information you share through this website and at our venues.",
  },
  {
    key: "terms",
    label: "Terms & Conditions",
    path: "/terms",
    defaultTitle: "Terms & Conditions",
    defaultDescription:
      "The terms that govern your use of the SwillFam website and your visit to any SwillFam restaurant, bar, lounge or club.",
  },
  {
    key: "events",
    label: "Events (archive)",
    path: "/events",
    defaultTitle: "Events in Jakarta",
    defaultDescription:
      "What's on across SwillFam's Jakarta venues — weekly resident nights, guest DJs, dinners and one-off parties. Dates, line-ups and tables.",
  },
  {
    key: "promotions",
    label: "Promotions (archive)",
    path: "/promotions",
    defaultTitle: "Promotions & Offers",
    defaultDescription:
      "Current deals across SwillFam's Jakarta venues — happy hours, set menus, seasonal specials and bundles worth planning a night around.",
  },
  {
    key: "talents",
    label: "Talents (archive)",
    path: "/talents",
    defaultTitle: "Resident Talents",
    defaultDescription:
      "The resident DJs, chefs and bartenders behind SwillFam's Jakarta venues, and where to catch them next.",
  },
  {
    key: "venues",
    label: "Venues (archive)",
    path: "/venues",
    defaultTitle: "Jakarta Restaurants, Bars & Clubs",
    defaultDescription:
      "Every SwillFam venue in Jakarta — restaurants, a café, cocktail bars and clubs across SCBD, Senopati and Ashta District 8, with map and hours.",
  },
  {
    key: "private-events",
    label: "Private Events (archive)",
    path: "/private-events",
    defaultTitle: "Private Events & Venue Hire",
    defaultDescription:
      "Host a birthday, corporate dinner, brand activation or wedding party at a SwillFam venue in Jakarta. Capacities, spaces and enquiries.",
  },
  {
    key: "guides",
    label: "Guides (archive)",
    path: "/guides",
    defaultTitle: "Guides & Journal",
    defaultDescription:
      "Jakarta dining and nightlife guides from the SwillFam team — where to eat, drink and go out, and what's changing in the city.",
  },
] as const;

export type StaticPageSeoKey = (typeof STATIC_PAGE_SEO_DEFS)[number]["key"];

export const STATIC_PAGE_SEO_BY_KEY = Object.fromEntries(
  STATIC_PAGE_SEO_DEFS.map((def) => [def.key, def]),
) as Record<StaticPageSeoKey, (typeof STATIC_PAGE_SEO_DEFS)[number]>;
