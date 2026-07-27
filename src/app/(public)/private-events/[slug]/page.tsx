import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getArticleRows } from "@/lib/articles";
import { getFaqs } from "@/lib/faqs";
import { Reveal } from "@/components/Reveal";
import { GalleryCarousel } from "@/components/shared/GalleryCarousel";
import { CardImageInfoSection } from "@/components/shared/CardImageInfoSection";
import { FaqSection } from "@/components/shared/FaqSection";
import { ArticleListSection } from "@/components/shared/ArticleListSection";
import { StandForColumnsSection } from "@/components/about";
import { PrivateEventsSection } from "@/components/merchandise";
import {
  PrivateEventBanner,
  PrivateEventIntro,
  PrivateEventTestimonials,
  RecommendedVenuesSection,
} from "@/components/private-events";

// Statically rendered but data-driven — revalidate periodically so admin edits
// and seeds show up without a full rebuild.
export const revalidate = 60;

// cache() so generateMetadata and the page share a single read.
const getPrivateEventBySlug = cache(async (slug: string) =>
  prisma.privateEvent.findUnique({
    where: { slug },
    include: {
      // Implicit m2m carries no sort column, so order by the venue's own name.
      venues: { orderBy: { name: "asc" } },
      occasions: { where: { published: true }, orderBy: { sortOrder: "asc" } },
      testimonials: { where: { published: true }, orderBy: { sortOrder: "asc" } },
    },
  }),
);

export async function generateStaticParams() {
  const privateEvents = await prisma.privateEvent.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return privateEvents.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const privateEvent = await getPrivateEventBySlug(slug);
  if (!privateEvent) return { title: "Private Events | SwillFam" };
  return {
    title: `${privateEvent.title} | SwillFam`,
    description: privateEvent.shortDescription,
  };
}

export default async function PrivateEventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const privateEvent = await getPrivateEventBySlug(slug);
  if (!privateEvent || !privateEvent.published) notFound();

  const [faqs, articles] = await Promise.all([getFaqs("private_event", slug), getArticleRows(3)]);

  return (
    <>
      <PrivateEventBanner image={privateEvent.bannerImage ?? privateEvent.image} title={privateEvent.title} />

      <Reveal>
        <PrivateEventIntro caption={privateEvent.caption} description={privateEvent.description} />
      </Reveal>

      {privateEvent.occasions.length > 0 ? (
        <Reveal>
          <CardImageInfoSection
            title={privateEvent.occasionsTitle ?? "Suitable for Different Occasions:"}
            lead={null}
            cards={privateEvent.occasions.map((o) => ({
              img: o.image ?? undefined,
              title: o.title,
              description: o.description,
            }))}
          />
        </Reveal>
      ) : null}

      <Reveal>
        <PrivateEventTestimonials
          title={privateEvent.testimonialsTitle ?? "Trusted for Private Moments"}
          lead={privateEvent.testimonialsLead ?? undefined}
          testimonials={privateEvent.testimonials}
        />
      </Reveal>

      <Reveal>
        <RecommendedVenuesSection
          title={privateEvent.venuesTitle ?? `Recommended Venues for ${privateEvent.title}`}
          venues={privateEvent.venues}
        />
      </Reveal>

      {privateEvent.galleries.length > 0 ? (
        <Reveal>
          <GalleryCarousel
            title={privateEvent.galleryTitle ?? `${privateEvent.title} We Can Host`}
            description={privateEvent.galleryLead ?? undefined}
            images={privateEvent.galleries}
          />
        </Reveal>
      ) : null}

      <Reveal>
        <StandForColumnsSection />
      </Reveal>

      <Reveal>
        <PrivateEventsSection />
      </Reveal>

      {faqs.length > 0 ? (
        <Reveal>
          <FaqSection faqs={faqs} />
        </Reveal>
      ) : null}

      <Reveal>
        <ArticleListSection articles={articles} />
      </Reveal>
    </>
  );
}
