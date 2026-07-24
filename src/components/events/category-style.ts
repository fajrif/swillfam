import type { EventCategoryKind } from "@/lib/event-calendar";

/**
 * Colour + wording for each calendar category. Kept local to the events section
 * rather than promoted to `sf-*` theme tokens — these three hues exist only to
 * distinguish calendar chips and have no other use on the site.
 */
export const CATEGORY_STYLE: Record<
  EventCategoryKind,
  { color: string; toggleLabel: string; badgeLabel: string }
> = {
  regular: { color: "#8B5CF6", toggleLabel: "Upcoming Events", badgeLabel: "Upcoming Event" },
  featured: { color: "#22C55E", toggleLabel: "Featured Events", badgeLabel: "Featured Event" },
  recurring: { color: "#EAB308", toggleLabel: "Recurring Events", badgeLabel: "Recurring Event" },
};

/** Display order of the three toggles, matching the design. */
export const CATEGORY_ORDER: EventCategoryKind[] = ["regular", "featured", "recurring"];
