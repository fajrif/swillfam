/**
 * FAQ segments. Plural values are archive-wide and carry no `refSlug`; singular
 * ones target the single venue / private event whose slug matches `refSlug`.
 *
 * Kept apart from `faqs.ts` so the admin form (a client component) can import
 * it without dragging Prisma into the browser bundle.
 */
export const FAQ_SEGMENTS = [
  { value: "venues", label: "Venues (archive)" },
  { value: "venue", label: "Venue (needs slug)" },
  { value: "private_events", label: "Private events (archive)" },
  { value: "private_event", label: "Private event (needs slug)" },
  { value: "general", label: "General" },
] as const;
