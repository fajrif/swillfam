import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";
import { getArticleRows } from "@/lib/articles";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { GalleryCarousel } from "@/components/shared/GalleryCarousel";
import {
  EventSectionWithImage,
  type EventCarouselItem,
} from "@/components/shared/EventSectionWithImage";
import { FaqSection } from "@/components/shared/FaqSection";
import { ArticleListSection } from "@/components/shared/ArticleListSection";
import { ContinueExperience } from "@/components/category";
import {
  VenueHero,
  DishesSection,
  TalentSection,
  VenueLocationHours,
  OtherVenuesSection,
} from "@/components/venues";

const POSTER_FALLBACK = "/home/hero.png";

/** Cached so generateMetadata and the page share a single DB read per request. */
const getVenueBySlug = cache((slug: string) =>
  prisma.venue.findUnique({
    where: { slug },
    include: {
      category: true,
      segmentGalleries: { orderBy: { createdAt: "asc" } },
      talents: { orderBy: { createdAt: "asc" } },
      promotions: { orderBy: { startDate: "asc" } },
      events: { orderBy: { startDate: "asc" } },
    },
  }),
);

export async function generateStaticParams() {
  const venues = await prisma.venue.findMany({ select: { slug: true } });
  return venues.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const venue = await getVenueBySlug(slug);
  if (!venue) return { title: "Venue | SwillFam" };
  return {
    title: `${venue.name} | SwillFam`,
    description: venue.description,
  };
}

export default async function VenueSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venue = await getVenueBySlug(slug);
  if (!venue) notFound();

  const [otherVenues, faqs, settings, articles] = await Promise.all([
    venue.categoryId
      ? prisma.venue.findMany({
          where: { categoryId: venue.categoryId, id: { not: venue.id } },
          orderBy: { name: "asc" },
          take: 2,
        })
      : Promise.resolve([]),
    prisma.faq.findMany({
      where: { published: true, segment: "venue" },
      orderBy: { sortOrder: "asc" },
    }),
    getSiteSettings(),
    getArticleRows(3),
  ]);

  const galleries = venue.segmentGalleries.filter((g) => !g.special);
  const dishGalleries = venue.segmentGalleries.filter((g) => g.special);

  const eventItems: EventCarouselItem[] = venue.events.map((e) => ({
    img: e.posterImage ?? e.image ?? e.bannerImage ?? POSTER_FALLBACK,
    title: e.name,
    shortDescription: e.shortDescription,
    href: `/events/${e.slug}`,
  }));

  const promotionItems: EventCarouselItem[] = venue.promotions.map((p) => ({
    img: p.posterImage ?? p.image ?? p.bannerImage ?? POSTER_FALLBACK,
    title: p.name,
    shortDescription: p.shortDescription,
  }));

  return (
    <main className="min-h-dvh bg-sf-bg font-inter text-sf-text">
      {/* Header overlays the hero */}
      <div className="relative">
        <SiteHeader />
        <VenueHero venue={venue} />
      </div>

      {galleries.map((gallery) => (
        <Reveal key={gallery.id}>
          <GalleryCarousel
            title={gallery.title}
            description={gallery.description}
            images={gallery.images}
          />
        </Reveal>
      ))}

      {dishGalleries.map((gallery) => (
        <Reveal key={gallery.id}>
          <DishesSection gallery={gallery} />
        </Reveal>
      ))}

      {venue.talents.length > 0 ? (
        <Reveal>
          <TalentSection talents={venue.talents} />
        </Reveal>
      ) : null}

      {eventItems.length > 0 ? (
        <Reveal>
          <EventSectionWithImage
            title={`What's Happening at ${venue.name}`}
            description="Discover upcoming events, live performances, and special nights happening at this venue."
            ctaText="See all events"
            ctaHref="/events"
            items={eventItems}
          />
        </Reveal>
      ) : null}

      {promotionItems.length > 0 ? (
        <Reveal>
          <EventSectionWithImage
            title="Current Promotions"
            description="Make the most of your visit with the latest offers and promotions running at this venue."
            ctaText="See all promotions"
            ctaHref="/promotions"
            items={promotionItems}
          />
        </Reveal>
      ) : null}

      <Reveal>
        <VenueLocationHours
          name={venue.name}
          location={venue.location}
          operatingHours={venue.operatingHours}
          lat={venue.lat}
          lng={venue.lng}
        />
      </Reveal>

      {faqs.length > 0 ? (
        <Reveal>
          <FaqSection faqs={faqs} />
        </Reveal>
      ) : null}

      {otherVenues.length > 0 ? (
        <Reveal>
          <OtherVenuesSection venues={otherVenues} />
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
