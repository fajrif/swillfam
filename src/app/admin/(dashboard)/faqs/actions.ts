"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const BASE = "/admin/faqs";

function parse(formData: FormData) {
  return {
    question: String(formData.get("question") ?? "").trim(),
    answer: String(formData.get("answer") ?? "").trim(),
    segment: String(formData.get("segment") ?? "general").trim(),
    // Only meaningful for the singular segments; blank stores null so the
    // archive-wide queries (which filter on `refSlug: null`) still match.
    refSlug: String(formData.get("refSlug") ?? "").trim() || null,
    sortOrder: Number.parseInt(formData.get("sortOrder") as string, 10) || 0,
    published: formData.get("published") === "true",
  };
}

/** Every public route that renders an FAQ section. */
function revalidatePublic() {
  revalidatePath("/venues/[slug]", "page");
  revalidatePath("/private-events");
  revalidatePath("/private-events/[slug]", "page");
}

export async function createFaqAction(formData: FormData) {
  await prisma.faq.create({ data: parse(formData) });
  revalidatePath(BASE);
  revalidatePublic();
  redirect(BASE);
}

export async function updateFaqAction(id: string, formData: FormData) {
  await prisma.faq.update({ where: { id }, data: parse(formData) });
  revalidatePath(BASE);
  revalidatePath(`${BASE}/${id}`);
  revalidatePublic();
  redirect(BASE);
}

export async function deleteFaqAction(id: string) {
  await prisma.faq.delete({ where: { id } });
  revalidatePath(BASE);
  revalidatePublic();
  redirect(BASE);
}
