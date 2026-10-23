import { staticPageMetadata, staticPageSeo } from "@/lib/seo/static-page";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { publishedVenueScope } from "@/lib/venue-scope";
import { getArticleRows } from "@/lib/articles";
import { Reveal } from "@/components/Reveal";
import { Container } from "@/components/shared/Container";
import { StickyHero } from "@/components/shared/StickyHero";
import {
  TalentsIntro,
  TalentsBrowser,
  type TalentCardData,
} from "@/components/talents";
import { PrivateEventsSection } from "@/components/merchandise";
import { ArticleListSection } from "@/components/shared/ArticleListSection";
import { DestinationsFeatureBand } from "@/components/shared/DestinationsFeatureBand";
import { JsonLd, archiveGraph } from "@/lib/schema";

// Statically rendered but data-driven (talents, venues, categories, articles) —
// revalidate periodically so admin edits/seeds show up without a full rebuild.
export const revalidate = 60;

export const generateMetadata = () => staticPageMetadata("talents");

export default async function TalentsPage() {
  const [articles, talents, venues, categories] = await Promise.all([
    getArticleRows(3),
    prisma.talent.findMany({
      where: { status: "RESIDENT", published: true, ...publishedVenueScope },
      orderBy: { name: "asc" },
      include: {
        venue: { select: { name: true, logo: true } },
        talentCategory: { select: { id: true, name: true } },
      },
    }),
    prisma.venue.findMany({ where: { published: true }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.talentCategory.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  const talentCards: TalentCardData[] = talents.map((t) => ({
    id: t.id,
    slug: t.slug,
    name: t.name,
    description: t.description,
    speciality: t.speciality,
    image: t.image,
    venueId: t.venueId,
    talentCategoryId: t.talentCategoryId,
    venueName: t.venue?.name ?? null,
    venueLogo: t.venue?.logo ?? null,
    categoryName: t.talentCategory?.name ?? null,
  }));

  return (
    <StickyHero
      backdrop={
          <Image src="/talents/banner.png" alt="" fill className="object-cover" priority />
      }
      heroContent={
        <Container className="relative z-10 flex h-full flex-col justify-end gap-4 pb-12">
          <h1 className="max-w-3xl font-syne text-[clamp(2.5rem,6vw,60px)] font-semibold uppercase leading-[1.05] text-white">
            The People Behind the Experience
          </h1>
        </Container>
      }
    >
      <JsonLd
        data={archiveGraph({
          path: "/talents",
          ...(await staticPageSeo("talents")),
          crumbName: "Talents",
          items: talents.map((t) => ({ name: t.name, path: `/talents/${t.slug}` })),
        })}
      />
      <TalentsIntro />

      <TalentsBrowser talents={talentCards} venues={venues} categories={categories} />

      <Reveal>
        <DestinationsFeatureBand />
      </Reveal>

      <Reveal>
        <PrivateEventsSection />
      </Reveal>

      <Reveal>
        <ArticleListSection articles={articles} />
      </Reveal>
    </StickyHero>
  );
}
