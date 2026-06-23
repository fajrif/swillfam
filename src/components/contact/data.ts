export type VenueContact = {
  name: string;
  img: string;
  whatsapp: string;
  mapHref: string;
};

/** Venue directory for the Contact page "Contact Our Venues Directly" list. */
export const VENUE_CONTACTS: VenueContact[] = [
  { name: "Zoo", img: "/contact/zoo.png", whatsapp: "+62 123 456 7890", mapHref: "#" },
  { name: "Swillhouse", img: "/contact/swillhouse.png", whatsapp: "+62 123 456 7890", mapHref: "#" },
  { name: "Atsumaru Izakaya", img: "/contact/atsumaru.png", whatsapp: "+62 123 456 7890", mapHref: "#" },
  { name: "Kilo Jakarta", img: "/contact/kilo.png", whatsapp: "+62 123 456 7890", mapHref: "#" },
  { name: "Dualism", img: "/contact/dualism.png", whatsapp: "+62 123 456 7890", mapHref: "#" },
  { name: "Truce", img: "/contact/truce.png", whatsapp: "+62 123 456 7890", mapHref: "#" },
  { name: "Le Cirque", img: "/contact/le-cirque.png", whatsapp: "+62 123 456 7890", mapHref: "#" },
];
