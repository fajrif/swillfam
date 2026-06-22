/** Primary navigation for the SwillFam public site (Figma mega-nav, node 231:100).
 *  Destinations point to "#" until the consumer pages are built. */
export type NavLink = { label: string; href: string };

export const NAV_GROUPS: NavLink[][] = [
  [
    { label: "Venues", href: "#" },
    { label: "Events", href: "#" },
    { label: "About Us", href: "#" },
  ],
  [
    { label: "The Swillfam Experience", href: "#" },
    { label: "Private Events", href: "#" },
    { label: "Promotions", href: "#" },
    { label: "Talents", href: "#" },
  ],
  [
    { label: "Exclusive", href: "#" },
    { label: "Merchandise", href: "#" },
    { label: "Guides/Journal", href: "#" },
    { label: "Contact", href: "#" },
  ],
];

export const NAV_LINKS: NavLink[] = NAV_GROUPS.flat();
