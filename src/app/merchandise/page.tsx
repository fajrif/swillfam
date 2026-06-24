import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { getSiteSettings } from "@/lib/site-settings";
import { formatIDR } from "@/lib/currency";
import {
  MerchandiseHero,
  EssentialsSection,
  ProductGrid,
  PrivateEventsSection,
} from "@/components/merchandise";
import { StandForColumnsSection } from "@/components/about";
import { ArticleListSection } from "@/components/shared/ArticleListSection";
import { getArticleRows } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Merchandise | SwillFam",
  description:
    "SwillFam merchandise made for those who live the scene beyond the venue — selected pieces inspired by our venues, events, and lifestyle culture.",
};

const PAGE_SIZE = 9;

export default async function MerchandisePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [items, total, settings, articles] = await Promise.all([
    prisma.merchandise.findMany({ orderBy: { createdAt: "desc" }, take: PAGE_SIZE * page }),
    prisma.merchandise.count(),
    getSiteSettings(),
    getArticleRows(3),
  ]);

  const products = items.map((m) => ({
    img: m.image,
    title: m.name,
    description: m.shortDescription,
    price: formatIDR(m.price.toString()),
  }));

  const hasMore = items.length < total;
  const loadMoreHref = `/merchandise?page=${page + 1}`;

  return (
    <main className="min-h-dvh bg-sf-bg font-inter text-sf-text">
      {/* Header overlays the hero */}
      <div className="relative">
        <SiteHeader />
        <MerchandiseHero />
      </div>

      <Reveal>
        <EssentialsSection settings={settings} />
      </Reveal>

      <Reveal>
        <ProductGrid products={products} hasMore={hasMore} loadMoreHref={loadMoreHref} />
      </Reveal>

      <Reveal>
        <StandForColumnsSection />
      </Reveal>

      <Reveal>
        <PrivateEventsSection />
      </Reveal>

      <Reveal>
        <ArticleListSection articles={articles} />
      </Reveal>

      <SiteFooter settings={settings} />
    </main>
  );
}
