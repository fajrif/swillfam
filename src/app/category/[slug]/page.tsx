import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";
import { getArticleRows } from "@/lib/articles";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { ArticleListSection } from "@/components/shared/ArticleListSection";
import {
  CategoryHero,
  CategoryIntro,
  VenuesGrid,
  SiblingCategorySection,
  ContinueExperience,
} from "@/components/category";

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

  const [sibling, settings, articles] = await Promise.all([
    prisma.category.findFirst({
      where: { id: { not: category.id } },
      orderBy: { name: "asc" },
    }),
    getSiteSettings(),
    getArticleRows(3),
  ]);

  return (
    <main className="min-h-dvh bg-sf-bg font-inter text-sf-text">
      {/* Header overlays the hero */}
      <div className="relative">
        <SiteHeader />
        <CategoryHero category={category} />
      </div>

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

      <SiteFooter settings={settings} />
    </main>
  );
}
