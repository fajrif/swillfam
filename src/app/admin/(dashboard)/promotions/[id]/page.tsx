import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin, assertVenueOwnership, lockedVenue } from "@/lib/admin-auth";
import { PromotionForm } from "@/components/admin/PromotionForm";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { EditHeader } from "@/components/admin/PageHeader";
import { updatePromotionAction, deletePromotionAction } from "../actions";
import { EditPageTabs } from "@/components/admin/EditPageTabs";
import { SeoDetailsPanel } from "@/components/admin/SeoDetailsPanel";
import { promotionSeo } from "@/lib/seo/entities";
import { getImageAltRecord } from "@/lib/image-alt";

export default async function EditPromotionPage({ params }: { params: Promise<{ id: string }> }) {
  const altsByPath = await getImageAltRecord();
  const { id } = await params;
  const admin = await requireAdmin();
  const [promotion, venues, categories] = await Promise.all([
    prisma.promotion.findUnique({
      where: { id },
      include: { venue: { select: { name: true, published: true } } },
    }),
    prisma.venue.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.promotionCategory.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!promotion) notFound();
  assertVenueOwnership(admin, promotion.venueId);

  return (
    <div>
      <EditHeader title="Edit Promotion" backHref="/admin/promotions" />
      <EditPageTabs
        details={
          <>
            <PromotionForm
              altsByPath={altsByPath}
              action={updatePromotionAction.bind(null, id)}
              promotion={promotion}
              venues={venues}
              categories={categories}
              operatorVenue={lockedVenue(admin)}
            />
            <div className="mt-6 pt-6 border-t border-zinc-200">
              <ConfirmDeleteButton action={deletePromotionAction.bind(null, id)} label="Delete promotion" />
            </div>
          </>
        }
        seo={
          <>
            <SeoDetailsPanel
              seo={promotionSeo(promotion)}
              publicPath={`/promotions/${promotion.slug}`}
              unavailableReason={
                promotion.venue && !promotion.venue.published
                  ? "This promotion's venue is unpublished, so the promotion has no public page yet."
                  : undefined
              }
            />
          </>
        }
      />
    </div>
  );
}
