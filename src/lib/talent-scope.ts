import type { Prisma } from "@/generated/prisma/client";

/**
 * Talents a public page may list or link to. A draft talent has no page, so it
 * must not appear on a venue's team, an event's line-up or a "More Talent" row
 * either - same reasoning as `publishedVenueScope`.
 */
export const publishedTalentWhere: Prisma.TalentWhereInput = { published: true };
