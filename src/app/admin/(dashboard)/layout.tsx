import { requireAdmin } from "@/lib/admin-auth";
import { Sidebar } from "@/components/admin/Sidebar";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  // Only for the sidebar's data — authorization lives in proxy.ts and each page/action,
  // since layouts don't re-render on client navigation.
  const admin = await requireAdmin();

  return (
    <div className="flex min-h-screen bg-brand-bg text-foreground font-inter">
      <Sidebar
        admin={{
          fullName: admin.fullName,
          email: admin.email,
          avatar: admin.avatar,
          role: admin.role,
          venue: admin.venue ? { id: admin.venue.id, name: admin.venue.name } : null,
        }}
      />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
