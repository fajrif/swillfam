import { prisma } from "@/lib/prisma";

/**
 * Published FAQs for one segment, ordered. Pass `refSlug` for the singular
 * segments to get that row's own FAQs; omit it for the archive-wide sets.
 *
 * There is deliberately no fallback from a slug to its archive segment — a
 * detail page with no FAQs of its own renders no FAQ section at all.
 */
export async function getFaqs(segment: string, refSlug?: string) {
  return prisma.faq.findMany({
    where: { segment, published: true, refSlug: refSlug ?? null },
    orderBy: { sortOrder: "asc" },
  });
}
