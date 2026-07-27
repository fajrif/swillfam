"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const BASE = "/admin/private-event-testimonials";

function parse(formData: FormData) {
  const privateEventId = String(formData.get("privateEventId") ?? "").trim();
  return {
    quote: String(formData.get("quote") ?? "").trim(),
    author: String(formData.get("author") ?? "").trim(),
    privateEventId: privateEventId || null,
    sortOrder: Number.parseInt(String(formData.get("sortOrder") ?? "0"), 10) || 0,
    published: formData.get("published") === "true",
  };
}

/** The quote only renders on its parent's detail page, so revalidate that. */
async function revalidateParent(privateEventId: string | null) {
  if (!privateEventId) return;
  const parent = await prisma.privateEvent.findUnique({
    where: { id: privateEventId },
    select: { slug: true },
  });
  if (parent) revalidatePath(`/private-events/${parent.slug}`);
}

export async function createPrivateEventTestimonialAction(formData: FormData) {
  const data = parse(formData);
  await prisma.privateEventTestimonial.create({ data });
  revalidatePath(BASE);
  await revalidateParent(data.privateEventId);
  redirect(BASE);
}

export async function updatePrivateEventTestimonialAction(id: string, formData: FormData) {
  const current = await prisma.privateEventTestimonial.findUnique({ where: { id } });
  if (!current) redirect(BASE);
  const data = parse(formData);
  await prisma.privateEventTestimonial.update({ where: { id }, data });
  revalidatePath(BASE);
  revalidatePath(`${BASE}/${id}`);
  // Reparenting drops it off the old page as well as adding it to the new one.
  for (const parentId of new Set([current.privateEventId, data.privateEventId])) {
    await revalidateParent(parentId);
  }
  redirect(BASE);
}

export async function deletePrivateEventTestimonialAction(id: string) {
  const current = await prisma.privateEventTestimonial.findUnique({ where: { id } });
  if (current) {
    await prisma.privateEventTestimonial.delete({ where: { id } });
    await revalidateParent(current.privateEventId);
  }
  revalidatePath(BASE);
  redirect(BASE);
}
