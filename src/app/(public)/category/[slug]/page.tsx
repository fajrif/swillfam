import { cache } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getArticleRows } from "@/lib/articles";
import { Reveal } from "@/components/Reveal";
import { Container } from "@/components/shared/Container";
import { StickyHero } from "@/components/shared/StickyHero";
import { ArticleListSection } from "@/components/shared/ArticleListSection";
import {
  CategoryIntro,
  VenuesGrid,
  SiblingCategorySection,
  ContinueExperience,
} from "@/components/category";

const FALLBACK = "/home/hero.png";

// SSG per known slug at build time, but data-driven — revalidate periodically so
// admin edits/seeds show up without a full rebuild.
export const revalidate = 60;

/** Cached so generateMetadata and the page share a single DB read per request. */
const getCategoryBySlug = cache((slug: string) =>
  prisma.category.findUnique({
    where: { slug },
    include: { venues: { orderBy: { name: "asc" } } },
  }),
);

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({ select: { slug: true } });
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category | SwillFam" };
  return {
    title: `${category.name} | SwillFam`,
    description: category.headline ?? category.caption,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [sibling, articles] = await Promise.all([
    prisma.category.findFirst({
      where: { id: { not: category.id } },
      orderBy: { name: "asc" },
    }),
    getArticleRows(3),
  ]);

  return (
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
  );
}
