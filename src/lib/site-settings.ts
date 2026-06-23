import { prisma } from "@/lib/prisma";

export type SiteSettings = Record<string, string>;

export async function getSiteSettings(): Promise<SiteSettings> {
  const rows = await prisma.siteSetting.findMany();
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}
