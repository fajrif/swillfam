/** Primary navigation for the SwillFam public site (Figma mega-nav, node 231:100).
 *  Destinations point to "#" until the consumer pages are built. */
export type NavLink = { label: string; href: string };

export const NAV_GROUPS: NavLink[][] = [
  [
    { label: "About", href: "/about" },
    { label: "Venues", href: "/venues" },
    { label: "Events", href: "/events" },
  ],
  [
    { label: "The Swillfam Experience", href: "/experience" },
    { label: "Private Events", href: "/private-events" },
    { label: "Promotions", href: "/promotions" },
    { label: "Talents", href: "/talents" },
  ],
  [
    { label: "Exclusive", href: "/exclusive" },
    { label: "Merchandise", href: "/merchandise" },
    { label: "Guides/Journal", href: "/articles" },
    { label: "Contact", href: "/contact" },
  ],
];

export const NAV_LINKS: NavLink[] = NAV_GROUPS.flat();
