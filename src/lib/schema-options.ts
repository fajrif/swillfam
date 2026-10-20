/**
 * Option lists for the schema.org fields the admin edits.
 *
 * Values are the schema.org tokens themselves — identical to the Prisma enums
 * `VenueSchemaType`, `EventSchemaType` and `EventStatus` — so the server action
 * can cast a posted value straight to the enum type. Kept free of any Prisma
 * import so the forms (client components) can use them without pulling the
 * generated client into the browser bundle, the same reason `faq-segments.ts`
 * exists separately from `faqs.ts`.
 *
 * Adding an option here without adding it to the matching enum in
 * `prisma/schema.prisma` will be rejected by Postgres on save.
 */

export const VENUE_SCHEMA_TYPES = [
  { value: "Restaurant", label: "Restaurant" },
  { value: "BarOrPub", label: "Bar or pub" },
  { value: "CafeOrCoffeeShop", label: "Café or coffee shop" },
  { value: "NightClub", label: "Night club" },
] as const;

export const EVENT_SCHEMA_TYPES = [
  { value: "Event", label: "Event (generic)" },
  { value: "MusicEvent", label: "Music event" },
  { value: "FoodEvent", label: "Food event" },
] as const;

export const EVENT_STATUSES = [
  { value: "EventScheduled", label: "Scheduled" },
  { value: "EventCancelled", label: "Cancelled" },
  { value: "EventPostponed", label: "Postponed" },
  { value: "EventRescheduled", label: "Rescheduled" },
] as const;

/** Narrows posted form values to the options above, dropping anything else. */
export function allowedValues<T extends readonly { value: string }[]>(
  options: T,
  posted: string[],
): T[number]["value"][] {
  const allowed = new Set<string>(options.map((o) => o.value));
  return posted.filter((value): value is T[number]["value"] => allowed.has(value));
}
