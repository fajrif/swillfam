"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const SETTINGS_KEYS = [
  "mainEmail",
  "mainWhatsapp",
  "mainPhone",
  "officeAddressLine1",
  "officeAddressLine2",
  "officeAddressCity",
  "socialLinkedin",
  "socialTiktok",
  "socialYoutube",
  "socialInstagram",
] as const;

export type SettingsActionResult = { success: boolean; message: string };

export async function updateSettingsAction(prevState: SettingsActionResult | null, formData: FormData): Promise<SettingsActionResult> {
  try {
    for (const key of SETTINGS_KEYS) {
      const value = String(formData.get(key) ?? "").trim();
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }
    revalidatePath("/admin/settings");
    return { success: true, message: "Settings saved successfully." };
  } catch {
    return { success: false, message: "Failed to save settings." };
  }
}
