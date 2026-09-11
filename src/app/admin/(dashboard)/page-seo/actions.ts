"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { STATIC_PAGE_SEO_DEFS } from "@/lib/page-seo-registry";
import { requireAdministrator } from "@/lib/admin-auth";

export type PageSeoActionResult = { success: boolean; message: string };

export async function updatePageSeoAction(
  prevState: PageSeoActionResult | null,
  formData: FormData,
): Promise<PageSeoActionResult> {
  await requireAdministrator();
  try {
    for (const { key } of STATIC_PAGE_SEO_DEFS) {
      const metaTitle = String(formData.get(`${key}__title`) ?? "").trim() || null;
      const metaDescription = String(formData.get(`${key}__description`) ?? "").trim() || null;
      await prisma.pageSeo.upsert({
        where: { pageKey: key },
        update: { metaTitle, metaDescription },
        create: { pageKey: key, metaTitle, metaDescription },
      });
    }
    revalidatePath("/admin/page-seo");
    revalidatePath("/", "layout");
    return { success: true, message: "Page SEO saved successfully." };
  } catch {
    return { success: false, message: "Failed to save Page SEO." };
  }
}
