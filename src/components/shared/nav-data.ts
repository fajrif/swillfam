/** Primary navigation for the SwillFam public site (Figma mega-nav, node 231:100).
 *  Destinations point to "#" until the consumer pages are built. */
export type NavLink = { label: string; href: string };

export const NAV_GROUPS: NavLink[][] = [
  [
    { label: "Venues", href: "/experience" },
    { label: "Events", href: "/experience" },
    { label: "About Us", href: "/about" },
  ],
  [
    { label: "The Swillfam Experience", href: "/experience" },
    { label: "Private Events", href: "/contact" },
    { label: "Promotions", href: "/experience" },
    { label: "Talents", href: "#" },
  ],
  [
    { label: "Exclusive", href: "/articles" },
    { label: "Merchandise", href: "/merchandise" },
    { label: "Guides/Journal", href: "/articles" },
    { label: "Contact", href: "/contact" },
  ],
];

export const NAV_LINKS: NavLink[] = NAV_GROUPS.flat();
