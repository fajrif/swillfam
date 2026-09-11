"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import type { AdminRole } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { passwordChangeTimestamp } from "@/lib/auth";
import { requireAdministrator, setSessionCookie } from "@/lib/admin-auth";
import { ADMIN_ROLE_LABEL } from "@/lib/admin-roles";
import { BCRYPT_COST, passwordError, type PasswordActionState } from "@/lib/password-rules";
import { reconcileSingleImage, deleteUploadedFiles, collectImagePaths } from "@/lib/upload";

const BASE = "/admin/users";
const CATEGORY = "admin-users";

/**
 * Returned on a validation error. `values` refills the form (never passwords);
 * `at` changes on every attempt so the form remounts with them.
 */
export type AdminUserFormState = { error: string; values: Record<string, string>; at: number } | null;

function parse(formData: FormData) {
  const rawRole = String(formData.get("role") ?? "");
  const role = (rawRole in ADMIN_ROLE_LABEL ? rawRole : "OPERATOR") as AdminRole;
  const venueId = String(formData.get("venueId") ?? "").trim();
  return {
    fullName: String(formData.get("fullName") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    position: String(formData.get("position") ?? "").trim() || null,
    role,
    // Administrators aren't tied to a venue.
    venueId: role === "OPERATOR" ? venueId || null : null,
  };
}

type ParsedUser = ReturnType<typeof parse>;

function failure(error: string, data: ParsedUser): AdminUserFormState {
  return {
    error,
    values: {
      fullName: data.fullName,
      email: data.email,
      position: data.position ?? "",
      role: data.role,
      venueId: data.venueId ?? "",
    },
    at: Date.now(),
  };
}

async function profileError(data: ParsedUser, excludeId?: string): Promise<string | null> {
  if (!data.fullName) return "Full name is required.";
  if (!data.email) return "Email is required.";
  if (data.role === "OPERATOR" && !data.venueId) return "Operators need a venue to manage.";
  const clash = await prisma.adminUser.findUnique({ where: { email: data.email }, select: { id: true } });
  if (clash && clash.id !== excludeId) return "Another admin user already uses this email.";
  return null;
}

export async function createAdminUserAction(
  _prev: AdminUserFormState,
  formData: FormData,
): Promise<AdminUserFormState> {
  await requireAdministrator();
  const data = parse(formData);
  const password = String(formData.get("password") ?? "");
  const error =
    (await profileError(data)) ?? passwordError(password, String(formData.get("confirmPassword") ?? ""));
  if (error) return failure(error, data);

  const avatar = await reconcileSingleImage({ formData, field: "avatar", category: CATEGORY, previousPath: null });
  await prisma.adminUser.create({
    data: { ...data, avatar, passwordHash: await bcrypt.hash(password, BCRYPT_COST) },
  });
  revalidatePath(BASE);
  redirect(BASE);
}

export async function updateAdminUserAction(
  id: string,
  _prev: AdminUserFormState,
  formData: FormData,
): Promise<AdminUserFormState> {
  const admin = await requireAdministrator();
  const current = await prisma.adminUser.findUnique({ where: { id } });
  if (!current) redirect(BASE);

  const data = parse(formData);
  // The acting user is always an administrator, so blocking self-demotion is also
  // what guarantees at least one administrator remains.
  const error =
    (await profileError(data, id)) ??
    (id === admin.id && data.role !== current.role ? "You can't change your own role." : null);
  if (error) return failure(error, data);

  const avatar = await reconcileSingleImage({ formData, field: "avatar", category: CATEGORY, previousPath: current.avatar });
  await prisma.adminUser.update({ where: { id }, data: { ...data, avatar } });
  revalidatePath(BASE);
  revalidatePath(`${BASE}/${id}`);
  // The sidebar shows the signed-in admin's own name and avatar.
  if (id === admin.id) revalidatePath("/admin", "layout");
  redirect(BASE);
}

export async function resetAdminPasswordAction(
  id: string,
  _prev: PasswordActionState,
  formData: FormData,
): Promise<PasswordActionState> {
  const admin = await requireAdministrator();
  const password = String(formData.get("password") ?? "");
  const error = passwordError(password, String(formData.get("confirmPassword") ?? ""));
  if (error) return { success: false, message: error };

  const user = await prisma.adminUser.update({
    where: { id },
    data: { passwordHash: await bcrypt.hash(password, BCRYPT_COST), passwordChangedAt: passwordChangeTimestamp() },
    select: { id: true, email: true },
  });
  // Every existing session for this user is now revoked — keep our own tab signed in if it's us.
  if (user.id === admin.id) await setSessionCookie(user);
  return { success: true, message: "Password updated. Their existing sessions were signed out." };
}

export async function deleteAdminUserAction(id: string) {
  const admin = await requireAdministrator();
  // The edit page hides Delete on your own account; this guards direct calls. Since the
  // acting user is an administrator who stays, at least one administrator always remains.
  if (id === admin.id) throw new Error("You can't delete your own account.");
  const current = await prisma.adminUser.findUnique({ where: { id } });
  if (current) {
    await prisma.adminUser.delete({ where: { id } });
    await deleteUploadedFiles(collectImagePaths(current.avatar));
  }
  revalidatePath(BASE);
  redirect(BASE);
}
