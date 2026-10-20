import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TalentForm } from "@/components/admin/TalentForm";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { EditHeader, Card } from "@/components/admin/PageHeader";
import { updateTalentAction, deleteTalentAction } from "../actions";
import { SeoDetailsPanel } from "@/components/admin/SeoDetailsPanel";
import { talentSeo } from "@/lib/seo/entities";
import { getImageAltRecord } from "@/lib/image-alt";

export default async function EditTalentPage({ params }: { params: Promise<{ id: string }> }) {
  const altsByPath = await getImageAltRecord();
  const { id } = await params;
  const [talent, venues, categories] = await Promise.all([
    prisma.talent.findUnique({
      where: { id },
      include: {
        // Both feed the resolved title / public-page check below.
        talentCategory: { select: { name: true } },
        venue: { select: { published: true } },
      },
    }),
    prisma.venue.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.talentCategory.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!talent) notFound();

  return (
    <div>
      <EditHeader title="Edit Talent" backHref="/admin/talents" />
      <Card>
        <TalentForm
          altsByPath={altsByPath} action={updateTalentAction.bind(null, id)} talent={talent} venues={venues} categories={categories} />
        <div className="mt-6 pt-6 border-t border-zinc-200">
          <ConfirmDeleteButton action={deleteTalentAction.bind(null, id)} label="Delete talent" />
        </div>
      </Card>

      <div className="mt-6">
        <Card>
          <h2 className="mb-4 text-sm font-semibold text-zinc-900">SEO Details</h2>
          <SeoDetailsPanel
            seo={talentSeo(talent)}
            publicPath={`/talents/${talent.slug}`}
            unavailableReason={
              talent.status !== "RESIDENT"
                ? "Only resident talents get a public page, so this one has none yet."
                : talent.venue && !talent.venue.published
                  ? "This talent's venue is unpublished, so the talent has no public page yet."
                  : undefined
            }
          />
        </Card>
      </div>
    </div>
  );
}
