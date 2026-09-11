import { prisma } from "@/lib/prisma";
import { PageHeader, Card } from "@/components/admin/PageHeader";
import { STATIC_PAGE_SEO_DEFS } from "@/lib/page-seo-registry";
import { PageSeoForm } from "./PageSeoForm";
import { requireAdministrator } from "@/lib/admin-auth";

export default async function PageSeoPage() {
  await requireAdministrator();
  const rows = await prisma.pageSeo.findMany();
  const byKey = Object.fromEntries(rows.map((r) => [r.pageKey, r]));
  const initial = STATIC_PAGE_SEO_DEFS.map((def) => ({
    ...def,
    metaTitle: byKey[def.key]?.metaTitle ?? "",
    metaDescription: byKey[def.key]?.metaDescription ?? "",
  }));

  return (
    <div>
      <PageHeader title="Page SEO" />
      <Card>
        <PageSeoForm initial={initial} />
      </Card>
    </div>
  );
}
