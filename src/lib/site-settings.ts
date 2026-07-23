import { cache } from "react";
import { prisma } from "@/lib/prisma";

export type SiteSettings = Record<string, string>;

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const rows = await prisma.siteSetting.findMany();
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
});
