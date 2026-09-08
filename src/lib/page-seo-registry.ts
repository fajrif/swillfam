/** The 16 singleton/archive public pages that have no other backing DB row. */
export const STATIC_PAGE_SEO_DEFS = [
  { key: "home", label: "Home", path: "/" },
  { key: "about", label: "About", path: "/about" },
  { key: "careers", label: "Careers", path: "/careers" },
  { key: "contact", label: "Contact", path: "/contact" },
  { key: "experience", label: "The SwillFam Experience", path: "/experience" },
  { key: "exclusive", label: "Exclusive", path: "/exclusive" },
  { key: "media-mentions", label: "Media Mentions", path: "/media-mentions" },
  { key: "merchandise", label: "Merchandise", path: "/merchandise" },
  { key: "privacy", label: "Privacy Policy", path: "/privacy" },
  { key: "terms", label: "Terms & Conditions", path: "/terms" },
  { key: "events", label: "Events (archive)", path: "/events" },
  { key: "promotions", label: "Promotions (archive)", path: "/promotions" },
  { key: "talents", label: "Talents (archive)", path: "/talents" },
  { key: "venues", label: "Venues (archive)", path: "/venues" },
  { key: "private-events", label: "Private Events (archive)", path: "/private-events" },
  { key: "articles", label: "Articles (archive)", path: "/articles" },
] as const;

export type StaticPageSeoKey = (typeof STATIC_PAGE_SEO_DEFS)[number]["key"];
