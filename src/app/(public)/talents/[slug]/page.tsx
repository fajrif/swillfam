import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getArticleRows } from "@/lib/articles";
import { formatDateRange } from "@/lib/date";
import { Reveal } from "@/components/Reveal";
import { Container } from "@/components/shared/Container";
import { OfferCardSection } from "@/components/shared/OfferCardSection";
import { type OfferCardData } from "@/components/shared/OfferCard";
import { DestinationsFeatureBand } from "@/components/shared/DestinationsFeatureBand";
import { PrivateEventsSection } from "@/components/merchandise";
import { ArticleListSection } from "@/components/shared/ArticleListSection";
import {
  TalentDetailIntro,
  TalentPerformingSection,
  TalentSignatureSound,
} from "@/components/talents";

const POSTER_FALLBACK = "/home/hero.png";

// SSG per known slug at build time, but data-driven — revalidate periodically so
// admin edits/seeds show up without a full rebuild.
export const revalidate = 60;

/** Cached so generateMetadata and the page share a single DB read per request. */
const getTalentBySlug = cache((slug: string) =>
  prisma.talent.findUnique({
    where: { slug },
    include: { venue: true, talentCategory: true },
  }),
);

export async function generateStaticParams() {
  const rows = await prisma.talent.findMany({ select: { slug: true } });
  return rows.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const talent = await getTalentBySlug(slug);
  if (!talent) return { title: "Talent | SwillFam" };
  return {
    title: `${talent.name} | SwillFam`,
    description: talent.description,
  };
}

export default async function TalentSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const talent = await getTalentBySlug(slug);
  if (!talent) notFound();

  const [venueEvents, moreTalents, articles] = await Promise.all([
    talent.venueId
      ? prisma.event.findMany({
          where: { venueId: talent.venueId },
          orderBy: { startDate: "asc" },
          take: 3,
          include: { venue: { select: { name: true, logo: true } } },
        })
      : Promise.resolve([]),
    prisma.talent.findMany({
      where: { id: { not: talent.id } },
      orderBy: { name: "asc" },
      take: 3,
      include: {
        venue: { select: { name: true, logo: true } },
        talentCategory: { select: { name: true } },
      },
    }),
    getArticleRows(3),
  ]);

  const eventOffers: OfferCardData[] = venueEvents.map((e) => ({
    id: e.id,
    image: e.posterImage ?? e.image ?? e.bannerImage ?? POSTER_FALLBACK,
    title: e.name,
    description: e.shortDescription,
    venueName: e.venue?.name ?? null,
    venueLogo: e.venue?.logo ?? null,
    meta: e.endDate ? formatDateRange(e.startDate, e.endDate) : null,
    href: `/events/${e.slug}`,
  }));

  const talentOffers: OfferCardData[] = moreTalents.map((t) => ({
    id: t.id,
    image: t.image,
    title: t.name,
    description: t.description,
    venueName: t.venue?.name ?? null,
    venueLogo: t.venue?.logo ?? null,
    meta: t.talentCategory?.name ?? null,
    href: `/talents/${t.slug}`,
  }));

  return (
    <>
      <Container className="pt-30 lg:pt-60">
        <Link
          href="/talents"
          className="group inline-flex w-fit items-center gap-3 font-inter text-sm uppercase tracking-[0.06em] text-white"
        >
          <span aria-hidden className="transition-transform group-hover:-translate-x-1">
            &larr;
          </span>
          Back to All Talents
        </Link>
      </Container>

      <TalentDetailIntro talent={talent} />

      {talent.venue ? (
        <Reveal>
          <TalentPerformingSection venue={talent.venue} />
        </Reveal>
      ) : null}

      <Reveal>
        <TalentSignatureSound
          spotifyEmbed={talent.spotifyEmbed}
          youtubeEmbed={talent.youtubeEmbed}
          instagramEmbed={talent.instagramEmbed}
        />
      </Reveal>

      {eventOffers.length > 0 ? (
        <Reveal>
          <OfferCardSection
            title={`Upcoming Events with ${talent.name}`}
            lead={`Catch ${talent.name} live at upcoming SwillFam events. Explore the latest event schedule, venue appearances, and special nights.`}
            offers={eventOffers}
          />
        </Reveal>
      ) : null}

      {talentOffers.length > 0 ? (
        <Reveal>
          <OfferCardSection
            title="More Talent at SwillFam"
            lead="Discover more SwillFam talents shaping the sound, service, food, drinks, and overall experience across our venues."
            offers={talentOffers}
          />
        </Reveal>
      ) : null}

      <Reveal>
        <DestinationsFeatureBand />
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
