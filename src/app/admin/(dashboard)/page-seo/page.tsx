import { prisma } from "@/lib/prisma";
import { PageHeader, Card } from "@/components/admin/PageHeader";
import { STATIC_PAGE_SEO_DEFS, isPageHidden } from "@/lib/page-seo-registry";
import { SeoDetailsPanel } from "@/components/admin/SeoDetailsPanel";
import { staticPageSeoValues } from "@/lib/seo/entities";
import { PageSeoForm } from "./PageSeoForm";
import { requireAdministrator } from "@/lib/admin-auth";

export default async function PageSeoPage() {
  await requireAdministrator();
  const rows = await prisma.pageSeo.findMany();
  const byKey = Object.fromEntries(rows.map((r) => [r.pageKey, r]));
  // The SEO Details panel is rendered here and handed to the (client) form as a
  // node, so the form never has to import the server-side SEO resolution.
  const initial = STATIC_PAGE_SEO_DEFS.map((def) => ({
    ...def,
    metaTitle: byKey[def.key]?.metaTitle ?? "",
    metaDescription: byKey[def.key]?.metaDescription ?? "",
    ogImage: byKey[def.key]?.ogImage ?? "",
    seoPanel: (
      <SeoDetailsPanel
        seo={staticPageSeoValues(def.key, byKey[def.key] ?? null)}
        publicPath={def.path}
        unavailableReason={
          isPageHidden(def.key)
            ? "This page is switched off for now and returns 404, so it has no structured data to show."
            : undefined
        }
      />
    ),
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
