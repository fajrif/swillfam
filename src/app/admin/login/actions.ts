"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { setSessionCookie } from "@/lib/admin-auth";

export type LoginActionState = {
  error?: string;
};

export async function loginAction(_prevState: LoginActionState, formData: FormData): Promise<LoginActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin) {
    return { error: "Invalid email or password." };
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    return { error: "Invalid email or password." };
  }

  await setSessionCookie(admin);

  // /admin routes each role to its own landing page.
  redirect("/admin");
}
