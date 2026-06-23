export type EventCard = {
  img: string;
  name: string;
  venue: string;
  date: string;
  description: string;
};

export type PromoCard = {
  img: string;
  venue: string;
  date: string;
  title: string;
  description: string;
};

const EVENT_DESCRIPTION =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.";

export const EVENTS: EventCard[] = [
  { img: "/experience/event-1.png", name: "Event Name Here", venue: "Le Cirque", date: "1 July - 1 August 2026", description: EVENT_DESCRIPTION },
  { img: "/experience/event-2.png", name: "Event Name Here", venue: "Le Cirque", date: "1 July - 1 August 2026", description: EVENT_DESCRIPTION },
  { img: "/experience/event-3.png", name: "Event Name Here", venue: "Le Cirque", date: "1 July - 1 August 2026", description: EVENT_DESCRIPTION },
];

export const PROMOS: PromoCard[] = [
  {
    img: "/experience/promo-1.png",
    venue: "ZOO Jakarta",
    date: "1 July - 31 August 2026",
    title: "Ladies Night",
    description:
      "Enjoy complimentary selected drinks for ladies before 10 PM, plus special DJ performances and exclusive table packages throughout the night.",
  },
  {
    img: "/experience/promo-2.png",
    venue: "Atsumaru Izakaya",
    date: "1 July - 31 August 2026",
    title: "Dinner & Drinks Offer",
    description:
      "Enjoy selected food and drink offers for casual dinners, group gatherings, after-work meetups, and relaxed evenings. Discover special menu selections and beverage deals.",
  },
  {
    img: "/experience/promo-3.png",
    venue: "Swillhouse",
    date: "1 July - 31 August 2026",
    title: "Group Table Package",
    description:
      "Plan your night with a group table package for celebrations, gatherings, and special evenings. Includes reserved seating that makes it easier to gather friends and enjoy great drinks together.",
  },
];
