import { cache } from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getArticleRows } from "@/lib/articles";
import { Reveal } from "@/components/Reveal";
import { Container } from "@/components/shared/Container";
import { StickyHero } from "@/components/shared/StickyHero";
import { HeroTitle } from "@/components/shared/HeroTitle";
import { ArticleListSection } from "@/components/shared/ArticleListSection";
import { JsonLd, categoryGraph } from "@/lib/schema";
import {
  CategoryIntro,
  VenuesGrid,
  SiblingCategorySection,
  ContinueExperience,
} from "@/components/category";
import { buildMetadata } from "@/lib/seo/metadata";
import { categorySeo } from "@/lib/seo/entities";
import { ContentImage } from "@/components/shared/ContentImage";

const FALLBACK = "/home/hero.png";

/** Cached so generateMetadata and the page share a single DB read per request. */
export const getCategoryBySlug = cache((slug: string) =>
  prisma.category.findUnique({
    where: { slug },
    include: { venues: { where: { published: true }, orderBy: { name: "asc" } } },
  }),
);

export type CategoryDetail = NonNullable<Awaited<ReturnType<typeof getCategoryBySlug>>>;

export function categoryMetadata(category: CategoryDetail): Metadata {
  const seo = categorySeo(category);
  return buildMetadata({
    path: `/venues/${category.slug}`,
    title: seo.title.value,
    description: seo.description.value,
    image: seo.image.value,
    imageAlt: `${category.name} venues`,
  });
}

export async function CategoryView({ category }: { category: CategoryDetail }) {
  const [sibling, articles] = await Promise.all([
    prisma.category.findFirst({
      where: { id: { not: category.id } },
      orderBy: { name: "asc" },
    }),
    getArticleRows(3),
  ]);

  return (
    <>
      <JsonLd data={categoryGraph({ category, venues: category.venues })} />
      <StickyHero
      backdrop={
          <ContentImage
            src={category.bannerImage ?? category.image ?? FALLBACK}
            alt={category.name}
            fill
            className="object-cover"
            priority
          />
      }
      heroContent={
        <Container className="relative z-10 flex h-full flex-col justify-end gap-4 pb-12">
          {/* "Lifestyle Venues", not "Lifestyle" — the same phrasing
              `categorySeo` already uses for this page's title, and the H1 of a
              venue listing should say that it lists venues. */}
          <HeroTitle name={`${category.name} Venues`} tagline={category.headline} />
        </Container>
      }
    >
      <Reveal>
        <CategoryIntro category={category} />
      </Reveal>

      <Reveal>
        <VenuesGrid category={category} />
      </Reveal>

      {sibling ? (
        <Reveal>
          <SiblingCategorySection category={sibling} />
        </Reveal>
      ) : null}

      <Reveal>
        <ContinueExperience />
      </Reveal>

      <Reveal>
        <ArticleListSection articles={articles} />
      </Reveal>
      </StickyHero>
    </>
  );
}
