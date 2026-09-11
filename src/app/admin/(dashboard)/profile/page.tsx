import { requireAdmin } from "@/lib/admin-auth";
import { ADMIN_ROLE_LABEL } from "@/lib/admin-roles";
import { PageHeader, Card } from "@/components/admin/PageHeader";
import { PasswordForm } from "@/components/admin/PasswordForm";
import { ProfileForm } from "./ProfileForm";
import { changeOwnPasswordAction } from "./actions";

export default async function ProfilePage() {
  const admin = await requireAdmin();

  return (
    <div>
      <PageHeader title="My Profile" />

      {admin.role === "OPERATOR" && !admin.venue && (
        <p className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          No venue is assigned to your account yet, so there&apos;s nothing to manage. Ask an administrator to assign one.
        </p>
      )}

      <Card>
        <ProfileForm
          admin={{
            fullName: admin.fullName,
            email: admin.email,
            position: admin.position,
            avatar: admin.avatar,
            roleLabel: ADMIN_ROLE_LABEL[admin.role],
            venueName: admin.venue?.name ?? null,
          }}
        />
      </Card>

      <div className="mt-6">
        <Card>
          <h2 className="text-base font-semibold text-foreground">Change password</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            You&apos;ll stay signed in here; any other devices are signed out.
          </p>
          <PasswordForm action={changeOwnPasswordAction} requireCurrent submitLabel="Change password" />
        </Card>
      </div>
    </div>
  );
}
