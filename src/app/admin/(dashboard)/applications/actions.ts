"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { deleteUploadedFile } from "@/lib/upload";
import { requireAdministrator } from "@/lib/admin-auth";

const BASE = "/admin/applications";

export async function deleteApplicationAction(id: string) {
  await requireAdministrator();
  const application = await prisma.application.findUnique({ where: { id } });
  if (application) {
    await prisma.application.delete({ where: { id } });
    await deleteUploadedFile(application.resumeUrl);
  }
  revalidatePath(BASE);
  redirect(BASE);
}
