import { prisma } from "@/lib/prisma";

export async function getFaqsBySegment(segment: string) {
  return prisma.faq.findMany({
    where: { segment, published: true },
    orderBy: { sortOrder: "asc" },
  });
}
