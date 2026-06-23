export type EventType = {
  key: "CORPORATE_EVENTS" | "BIRTHDAYS" | "BRAND_ACTIVATIONS" | "CELEBRATION_PARTIES";
  img: string;
  title: string;
  description: string;
};

export const EVENT_TYPES: EventType[] = [
  {
    key: "CORPORATE_EVENTS",
    img: "/private-events/type-1.png",
    title: "Corporate Events at SwillFam Jakarta",
    description:
      "Host corporate events at SwillFam venues built for meaningful connections and memorable experiences. From company gatherings and networking events to client nights and team celebrations, we'll help match your event with the right venue.",
  },
  {
    key: "BIRTHDAYS",
    img: "/private-events/type-2.png",
    title: "Birthdays",
    description:
      "Celebrate your birthday at a SwillFam venue with curated food, drinks, and atmosphere. From intimate dinners to lively nights out, we help make every milestone feel special.",
  },
  {
    key: "BRAND_ACTIVATIONS",
    img: "/private-events/type-3.png",
    title: "Brand Activations",
    description:
      "Launch products, host press nights, and run brand activations in distinctive spaces. Our team supports your concept with flexible venues, production, and full event coordination.",
  },
  {
    key: "CELEBRATION_PARTIES",
    img: "/private-events/type-4.png",
    title: "Celebrations & After-Parties",
    description:
      "From anniversaries and engagements to late-night after-parties, SwillFam venues set the tone for unforgettable celebrations with music, drinks, and energy that last all night.",
  },
];

export const GALLERY = [
  "/private-events/events-1.png",
  "/private-events/events-2.png",
  "/private-events/events-3.png",
];

export type Faq = { question: string; answer: string };

export const FAQS: Faq[] = [
  {
    question: "Do I need to make a reservation?",
    answer:
      "Walk-ins are welcome, but reservations are recommended for weekends, group bookings, and peak hours.",
  },
  {
    question: "Can I host a private event at Atsumaru Izakaya?",
    answer:
      "Yes. Atsumaru Izakaya can be booked for private events, from intimate gatherings to full-venue celebrations. Reach out to our team to discuss availability and setup.",
  },
  {
    question: "Is Atsumaru Izakaya suitable for group dining?",
    answer:
      "Yes. The venue is suitable for casual gatherings, celebrations, after-work meals, and group dining experiences.",
  },
  {
    question: "How do I reserve a table for a group, special occasion, or busy dining hours?",
    answer:
      "Contact us via WhatsApp or the inquiry form with your date, group size, and occasion, and our team will help arrange the right table or space for your visit.",
  },
];
