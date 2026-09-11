import { prisma } from "@/lib/prisma";
import { PageHeader, Card } from "@/components/admin/PageHeader";
import { SettingsForm } from "./SettingsForm";
import { requireAdministrator } from "@/lib/admin-auth";

export default async function SettingsPage() {
  await requireAdministrator();
  const rows = await prisma.siteSetting.findMany();
  const settings = Object.fromEntries(rows.map((r) => [r.key, r.value]));

  return (
    <div>
      <PageHeader title="Site Settings" />
      <Card>
        <SettingsForm initial={settings} />
      </Card>
    </div>
  );
}
