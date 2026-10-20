import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { publishedVenueScope } from "@/lib/venue-scope";
import { getSiteSettings } from "@/lib/site-settings";
import { getArticleRows } from "@/lib/articles";
import { formatDateRange } from "@/lib/date";
import { Reveal } from "@/components/Reveal";
import { Container } from "@/components/shared/Container";
import { OfferCardSection } from "@/components/shared/OfferCardSection";
import { type OfferCardData } from "@/components/shared/OfferCard";
import { DestinationsFeatureBand } from "@/components/shared/DestinationsFeatureBand";
import { PrivateEventsSection } from "@/components/merchandise";
import { ArticleListSection } from "@/components/shared/ArticleListSection";
import { PromotionDetailTop } from "@/components/promotions";
import { JsonLd, breadcrumbOnlyGraph } from "@/lib/schema";
import {
  buildMetadata,
  resolveDescription,
  resolveOgImage,
} from "@/lib/seo/metadata";

// SSG per known slug at build time, but data-driven — revalidate periodically so
// admin edits/seeds show up without a full rebuild.
export const revalidate = 60;

/** Cached so generateMetadata and the page share a single DB read per request. */
const getPromotionBySlug = cache((slug: string) =>
  // findFirst, not findUnique: the venue scope is not part of the unique key.
  prisma.promotion.findFirst({
    where: { slug, ...publishedVenueScope },
    include: {
      venue: { include: { hours: { orderBy: { sortOrder: "asc" } } } },
      promotionCategory: true,
    },
  }),
);

export async function generateStaticParams() {
  const rows = await prisma.promotion.findMany({ where: publishedVenueScope, select: { slug: true } });
  return rows.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const promotion = await getPromotionBySlug(slug);
  if (!promotion)
    return { title: "Promotion Not Found", robots: { index: false, follow: true } };

  return buildMetadata({
    path: `/promotions/${promotion.slug}`,
    title:
      promotion.metaTitle ||
      `${promotion.name}${promotion.venue ? ` at ${promotion.venue.name}` : ""}`,
    description: resolveDescription(
      promotion.metaDescription,
      promotion.shortDescription,
      promotion.caption,
      promotion.description,
    ),
    image: resolveOgImage(
      promotion.ogImage,
      promotion.bannerImage,
      promotion.posterImage,
      promotion.image,
    ),
    imageAlt: promotion.name,
  });
}

export default async function PromotionSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const promotion = await getPromotionBySlug(slug);
  if (!promotion) notFound();

  const [otherPromotions, settings, articles] = await Promise.all([
    promotion.venueId
      ? prisma.promotion.findMany({
          where: { venueId: promotion.venueId, id: { not: promotion.id } },
          orderBy: { startDate: "desc" },
          take: 3,
          include: { venue: { select: { name: true, logo: true } } },
        })
      : Promise.resolve([]),
    getSiteSettings(),
    getArticleRows(3),
  ]);

  const otherOffers: OfferCardData[] = otherPromotions.map((p) => ({
    id: p.id,
    image: p.image ?? p.posterImage,
    title: p.name,
    description: p.shortDescription,
    venueName: p.venue?.name ?? null,
    venueLogo: p.venue?.logo ?? null,
    meta: formatDateRange(p.startDate, p.endDate),
    href: `/promotions/${p.slug}`,
  }));

  return (
    <>
      {/* Breadcrumbs only — see the /promotions archive for why. */}
      <JsonLd
        data={breadcrumbOnlyGraph(
          { name: "Promotions", path: "/promotions" },
          { name: promotion.name },
        )}
      />
      <Container className="pt-30 lg:pt-60">
        <Link
          href="/promotions"
          className="group inline-flex w-fit items-center gap-3 font-inter text-sm uppercase tracking-[0.06em] text-white"
        >
          <span aria-hidden className="transition-transform group-hover:-translate-x-1">
            &larr;
          </span>
          Back to Promotions
        </Link>
      </Container>

      <PromotionDetailTop promotion={promotion} settings={settings} />

      {otherOffers.length > 0 ? (
        <Reveal>
          <OfferCardSection
            title="More Offers To Explore"
            lead="Other promotions currently running across SwillFam venues that might be worth checking out."
            offers={otherOffers}
          />
        </Reveal>
      ) : null}

      <Reveal>
        <DestinationsFeatureBand
          rightTitle="Explore Promotions"
          rightBody="Explore the latest promotions and special offers running across SwillFam venues, from food and drinks deals to ladies nights, group packages, table deals, and seasonal specials."
          rightCtaLabel="View Promotions"
          rightCtaHref="/promotions"
        />
      </Reveal>

      <Reveal>
        <PrivateEventsSection />
      </Reveal>

      <Reveal>
        <ArticleListSection articles={articles} />
      </Reveal>
    </>
  );
}
