import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/get-admin-session";
import { Sidebar } from "@/components/admin/Sidebar";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-brand-bg text-foreground">
      <Sidebar email={session.email} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
