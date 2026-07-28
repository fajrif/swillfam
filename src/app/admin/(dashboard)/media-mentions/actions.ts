"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const BASE = "/admin/media-mentions";

function parse(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    articleTitle: String(formData.get("articleTitle") ?? "").trim(),
    publicationName: String(formData.get("publicationName") ?? "").trim(),
    publishedDate: new Date(String(formData.get("publishedDate") ?? "")),
    shortDescription: String(formData.get("shortDescription") ?? "").trim(),
    link: String(formData.get("link") ?? "").trim(),
  };
}

export async function createMediaMentionAction(formData: FormData) {
  await prisma.mediaMention.create({ data: parse(formData) });
  revalidatePath(BASE);
  revalidatePath("/media-mentions");
  redirect(BASE);
}

export async function updateMediaMentionAction(id: string, formData: FormData) {
  await prisma.mediaMention.update({ where: { id }, data: parse(formData) });
  revalidatePath(BASE);
  revalidatePath(`${BASE}/${id}`);
  revalidatePath("/media-mentions");
  redirect(BASE);
}

export async function deleteMediaMentionAction(id: string) {
  await prisma.mediaMention.delete({ where: { id } });
  revalidatePath(BASE);
  revalidatePath("/media-mentions");
  redirect(BASE);
}
