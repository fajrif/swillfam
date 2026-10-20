import { cache } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getArticleRows } from "@/lib/articles";
import { Reveal } from "@/components/Reveal";
import { Container } from "@/components/shared/Container";
import { StickyHero } from "@/components/shared/StickyHero";
import { ArticleListSection } from "@/components/shared/ArticleListSection";
import { JsonLd, categoryGraph } from "@/lib/schema";
import {
  CategoryIntro,
  VenuesGrid,
  SiblingCategorySection,
  ContinueExperience,
} from "@/components/category";
import {
  buildMetadata,
  resolveDescription,
  resolveOgImage,
} from "@/lib/seo/metadata";

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
  return buildMetadata({
    path: `/venues/${category.slug}`,
    title: category.metaTitle || `${category.name} Venues in Jakarta`,
    description: resolveDescription(
      category.metaDescription,
      category.shortDescription,
      category.headline,
      category.caption,
      category.description,
    ),
    image: resolveOgImage(
      category.ogImage,
      category.bannerImage,
      category.image,
    ),
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
          <Image
            src={category.bannerImage ?? category.image ?? FALLBACK}
            alt={category.name}
            fill
            className="object-cover"
            priority
          />
      }
      heroContent={
        <Container className="relative z-10 flex h-full flex-col justify-end pb-12">
          <h1 className="max-w-3xl font-syne text-[clamp(2.5rem,6vw,60px)] font-semibold uppercase leading-[1.05] text-white">
            {category.headline ?? category.name}
          </h1>
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
