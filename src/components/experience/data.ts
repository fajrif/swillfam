export type EventCard = {
  img: string;
  name: string;
  venue: string;
  date: string;
  description: string;
};

const EVENT_DESCRIPTION =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.";

export const EVENTS: EventCard[] = [
  { img: "/experience/event-1.png", name: "Event Name Here", venue: "Le Cirque", date: "1 July - 1 August 2026", description: EVENT_DESCRIPTION },
  { img: "/experience/event-2.png", name: "Event Name Here", venue: "Le Cirque", date: "1 July - 1 August 2026", description: EVENT_DESCRIPTION },
  { img: "/experience/event-3.png", name: "Event Name Here", venue: "Le Cirque", date: "1 July - 1 August 2026", description: EVENT_DESCRIPTION },
];

