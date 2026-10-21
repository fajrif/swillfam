"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdministrator } from "@/lib/admin-auth";
import { reconcileImageField } from "@/lib/upload";
import { MOMENTS_SETTING_KEY, parseMoments } from "@/lib/private-event-moments";

const BASE = "/admin/private-event-moments";

export async function savePrivateEventMomentsAction(formData: FormData) {
  await requireAdministrator();

  const current = await prisma.siteSetting.findUnique({ where: { key: MOMENTS_SETTING_KEY } });
  const images = await reconcileImageField({
    formData,
    field: "images",
    category: "private-event-moments",
    previousPaths: parseMoments(current?.value),
  });

  const value = JSON.stringify(images);
  await prisma.siteSetting.upsert({
    where: { key: MOMENTS_SETTING_KEY },
    update: { value },
    create: { key: MOMENTS_SETTING_KEY, value },
  });

  revalidatePath(BASE);
  revalidatePath("/private-events");
  // Back to the same page, not a list: this is a singleton. The redirect also
  // gives the uploader a fresh render, so photos that were "new" a moment ago
  // come back as saved paths instead of being re-posted as uploads.
  redirect(`${BASE}?saved=1`);
}
