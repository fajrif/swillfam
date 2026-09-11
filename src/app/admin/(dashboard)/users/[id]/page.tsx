import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdministrator } from "@/lib/admin-auth";
import { AdminUserForm } from "@/components/admin/AdminUserForm";
import { PasswordForm } from "@/components/admin/PasswordForm";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { updateAdminUserAction, resetAdminPasswordAction, deleteAdminUserAction } from "../actions";

export default async function EditAdminUserPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdministrator();
  const { id } = await params;
  const [user, venues] = await Promise.all([
    prisma.adminUser.findUnique({
      where: { id },
      select: { id: true, fullName: true, email: true, position: true, avatar: true, role: true, venueId: true },
    }),
    prisma.venue.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!user) notFound();
  const isSelf = user.id === admin.id;

  return (
    <div>
      <EditHeader title="Edit Admin User" backHref="/admin/users" />
      <Card>
        <AdminUserForm action={updateAdminUserAction.bind(null, id)} user={user} venues={venues} isSelf={isSelf} />
        {!isSelf && (
          <div className="mt-6 pt-6 border-t border-zinc-200">
            <ConfirmDeleteButton action={deleteAdminUserAction.bind(null, id)} label="Delete user" />
          </div>
        )}
      </Card>

      <div className="mt-6">
        <Card>
          <h2 className="text-base font-semibold text-foreground">Reset password</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Sets a new password for {user.fullName} without needing the current one, and signs them out everywhere.
          </p>
          <PasswordForm action={resetAdminPasswordAction.bind(null, id)} submitLabel="Reset password" />
        </Card>
      </div>
    </div>
  );
}
