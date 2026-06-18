"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Package, RenewalStatus } from "@/generated/prisma/client";

function parseContractFormData(formData: FormData) {
  const userCountRaw = String(formData.get("userCount") ?? "");
  return {
    businessName: String(formData.get("businessName") ?? ""),
    contactName: String(formData.get("contactName") ?? ""),
    contactEmail: String(formData.get("contactEmail") ?? ""),
    contactPhone: String(formData.get("contactPhone") ?? "") || null,
    serverDomain: String(formData.get("serverDomain") ?? ""),
    serverAddress: String(formData.get("serverAddress") ?? "") || null,
    package: String(formData.get("package")) as Package,
    userCount: userCountRaw ? Number.parseInt(userCountRaw, 10) : null,
    contractStart: new Date(String(formData.get("contractStart"))),
    contractEnd: new Date(String(formData.get("contractEnd"))),
    renewalStatus: String(formData.get("renewalStatus")) as RenewalStatus,
    notes: String(formData.get("notes") ?? "") || null,
  };
}

export async function createContractAction(formData: FormData) {
  await prisma.clientContract.create({ data: parseContractFormData(formData) });
  revalidatePath("/admin/contracts");
  redirect("/admin/contracts");
}

export async function updateContractAction(id: string, formData: FormData) {
  await prisma.clientContract.update({ where: { id }, data: parseContractFormData(formData) });
  revalidatePath("/admin/contracts");
  revalidatePath(`/admin/contracts/${id}`);
  redirect("/admin/contracts");
}
