/**
 * Has a promotion run out, and which ones may still be shown.
 *
 * An offer that ended is worse than useless in search: a thin page promising
 * something the venue no longer honours, competing with `/promotions` for the
 * same queries. The brief's answer is to 301 it to the archive, which only
 * works if everything agrees on when "ended" is — the redirect in
 * `src/proxy.ts`, the sitemap, and every list that links to one.
 *
 * `Promotion.endDate` is required, so every offer has a last day; it is an
 * admin-typed calendar day stored at UTC midnight, so the offer is live through
 * the whole of it (see `startOfUtcDay`).
 */

import type { Prisma } from "@/generated/prisma/client";
import { startOfUtcDay } from "./date";
import { publishedVenueScope } from "./venue-scope";

export function isExpiredPromotion(promotion: { endDate: Date }, now: Date): boolean {
  return startOfUtcDay(promotion.endDate) < startOfUtcDay(now);
}

/**
 * Promotions a page may list or link to.
 *
 * Everything sits under `AND` so a caller can spread this alongside its own
 * filters — `publishedVenueScope` is an `OR`, and two `OR` keys in one object
 * leave only the last.
 */
export function livePromotionWhere(now: Date): Prisma.PromotionWhereInput {
  return {
    AND: [publishedVenueScope, { endDate: { gte: startOfUtcDay(now) } }],
  };
}
