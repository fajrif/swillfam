"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { reconcileSingleImage } from "@/lib/upload";
import { STATIC_PAGE_SEO_DEFS } from "@/lib/page-seo-registry";
import { requireAdministrator } from "@/lib/admin-auth";

export type PageSeoActionResult = { success: boolean; message: string };

export async function updatePageSeoAction(
  prevState: PageSeoActionResult | null,
  formData: FormData,
): Promise<PageSeoActionResult> {
  await requireAdministrator();
  try {
    // One form posts all 16 pages, so each field is namespaced by page key —
    // including the two hidden fields ImageManager posts for the share image.
    const existing = await prisma.pageSeo.findMany({
      select: { pageKey: true, ogImage: true },
    });
    const ogImageByKey = new Map(existing.map((r) => [r.pageKey, r.ogImage]));

    for (const { key } of STATIC_PAGE_SEO_DEFS) {
      const metaTitle = String(formData.get(`${key}__title`) ?? "").trim() || null;
      const metaDescription = String(formData.get(`${key}__description`) ?? "").trim() || null;
      const ogImage = await reconcileSingleImage({
        formData,
        field: `${key}__ogImage`,
        category: "page-seo",
        previousPath: ogImageByKey.get(key) ?? null,
      });
      await prisma.pageSeo.upsert({
        where: { pageKey: key },
        update: { metaTitle, metaDescription, ogImage },
        create: { pageKey: key, metaTitle, metaDescription, ogImage },
      });
    }
    revalidatePath("/admin/page-seo");
    revalidatePath("/", "layout");
    return { success: true, message: "Page SEO saved successfully." };
  } catch {
    return { success: false, message: "Failed to save Page SEO." };
  }
}
