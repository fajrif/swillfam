export type VenueContact = {
  name: string;
  /** Real Venue.slug — links the venue name to its public /venues/[slug] page. */
  slug: string;
  img: string;
  whatsapp: string;
  mapHref: string;
};

/** Venue directory for the Contact page "Contact Our Venues Directly" list. */
export const VENUE_CONTACTS: VenueContact[] = [
  { name: "Zoo", slug: "zoo", img: "/contact/zoo.png", whatsapp: "+62 123 456 7890", mapHref: "#" },
  { name: "Swillhouse", slug: "swillhouse", img: "/contact/swillhouse.png", whatsapp: "+62 123 456 7890", mapHref: "#" },
  { name: "Atsumaru Izakaya", slug: "atsumaru-izakaya", img: "/contact/atsumaru.png", whatsapp: "+62 123 456 7890", mapHref: "#" },
  { name: "Kilo Jakarta", slug: "kilo", img: "/contact/kilo.png", whatsapp: "+62 123 456 7890", mapHref: "#" },
  { name: "Dualism", slug: "dualism", img: "/contact/dualism.png", whatsapp: "+62 123 456 7890", mapHref: "#" },
  { name: "Truce", slug: "truce", img: "/contact/truce.png", whatsapp: "+62 123 456 7890", mapHref: "#" },
  { name: "Le Cirque", slug: "lecirque", img: "/contact/le-cirque.png", whatsapp: "+62 123 456 7890", mapHref: "#" },
];
