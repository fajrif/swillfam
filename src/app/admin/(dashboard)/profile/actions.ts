"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { passwordChangeTimestamp } from "@/lib/auth";
import { requireAdmin, setSessionCookie } from "@/lib/admin-auth";
import { BCRYPT_COST, passwordError, type PasswordActionState } from "@/lib/password-rules";
import { reconcileSingleImage } from "@/lib/upload";

export type ProfileActionState = { success: boolean; message: string } | null;

/** The signed-in admin's own name, position, and avatar. Email/role/venue are administrator-managed. */
export async function updateProfileAction(
  _prev: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const admin = await requireAdmin();
  const fullName = String(formData.get("fullName") ?? "").trim();
  if (!fullName) return { success: false, message: "Full name is required." };

  const avatar = await reconcileSingleImage({
    formData,
    field: "avatar",
    category: "admin-users",
    previousPath: admin.avatar,
  });
  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { fullName, position: String(formData.get("position") ?? "").trim() || null, avatar },
  });
  // The sidebar in the dashboard layout shows the name and avatar too.
  revalidatePath("/admin", "layout");
  return { success: true, message: "Profile saved." };
}

export async function changeOwnPasswordAction(
  _prev: PasswordActionState,
  formData: FormData,
): Promise<PasswordActionState> {
  const admin = await requireAdmin();
  const user = await prisma.adminUser.findUnique({ where: { id: admin.id }, select: { passwordHash: true } });
  const current = String(formData.get("currentPassword") ?? "");
  if (!user || !(await bcrypt.compare(current, user.passwordHash))) {
    return { success: false, message: "Current password is incorrect." };
  }

  const password = String(formData.get("password") ?? "");
  const error = passwordError(password, String(formData.get("confirmPassword") ?? ""));
  if (error) return { success: false, message: error };

  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { passwordHash: await bcrypt.hash(password, BCRYPT_COST), passwordChangedAt: passwordChangeTimestamp() },
  });
  // Every session issued before the change is now revoked — re-issue this one so this tab stays signed in.
  await setSessionCookie(admin);
  return { success: true, message: "Password changed. Your other sessions were signed out." };
}
