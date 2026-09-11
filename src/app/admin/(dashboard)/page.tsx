import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";

/** Role-based landing page: administrators start at the inbox, operators at their venue. */
export default async function AdminIndexPage() {
  const admin = await requireAdmin();
  if (admin.role === "ADMINISTRATOR") redirect("/admin/inquiries");
  redirect(admin.venue ? `/admin/venues/${admin.venue.id}` : "/admin/profile");
}
