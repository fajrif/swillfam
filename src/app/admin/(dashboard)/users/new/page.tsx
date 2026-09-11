import { prisma } from "@/lib/prisma";
import { requireAdministrator } from "@/lib/admin-auth";
import { AdminUserForm } from "@/components/admin/AdminUserForm";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { createAdminUserAction } from "../actions";

export default async function NewAdminUserPage() {
  await requireAdministrator();
  const venues = await prisma.venue.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });

  return (
    <div>
      <EditHeader title="New Admin User" backHref="/admin/users" />
      <Card>
        <AdminUserForm action={createAdminUserAction} venues={venues} />
      </Card>
    </div>
  );
}
