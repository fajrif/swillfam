import { cache } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getArticleRows } from "@/lib/articles";
import { getSiteSettings } from "@/lib/site-settings";
import { Reveal } from "@/components/Reveal";
import { Container } from "@/components/shared/Container";
import { StickyHero } from "@/components/shared/StickyHero";
import { ParallaxImage } from "@/components/shared/ParallaxImage";
import { GalleryCarousel } from "@/components/shared/GalleryCarousel";
import {
  EventSectionWithImage,
  type EventCarouselItem,
} from "@/components/shared/EventSectionWithImage";
import { OfferCardSection } from "@/components/shared/OfferCardSection";
import { type OfferCardData } from "@/components/shared/OfferCard";
import { FaqSection } from "@/components/shared/FaqSection";
import { ArticleListSection } from "@/components/shared/ArticleListSection";
import { ContinueExperience } from "@/components/category";
import { formatEventSchedule } from "@/lib/event-calendar";
import {
  VenueDescription,
  DishesSection,
  TalentSection,
  VenueLocationHours,
  OtherVenuesSection,
  VenueSocialEmbeds,
} from "@/components/venues";

const POSTER_FALLBACK = "/home/hero.png";
const FALLBACK = "/home/hero.png";

// SSG per known slug at build time, but data-driven — revalidate periodically so
// admin edits/seeds show up without a full rebuild.
export const revalidate = 60;

/** Cached so generateMetadata and the page share a single DB read per request. */
const getVenueBySlug = cache((slug: string) =>
  prisma.venue.findUnique({
    where: { slug },
    include: {
      category: true,
      segmentGalleries: { orderBy: { createdAt: "asc" } },
      talents: { orderBy: { createdAt: "asc" } },
      promotions: { orderBy: { startDate: "asc" } },
      events: { where: { active: true, isPrivate: false }, orderBy: { startDate: "asc" } },
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

  const [otherVenues, faqs, articles, settings] = await Promise.all([
    venue.categoryId
      ? prisma.venue.findMany({
          where: { categoryId: venue.categoryId, id: { not: venue.id } },
          orderBy: { name: "asc" },
          take: 3,
        })
      : Promise.resolve([]),
    prisma.faq.findMany({
      where: { published: true, segment: "venue" },
      orderBy: { sortOrder: "asc" },
    }),
    getArticleRows(3),
    getSiteSettings(),
  ]);

  const galleries = venue.segmentGalleries.filter((g) => !g.special);
  const dishGalleries = venue.segmentGalleries.filter((g) => g.special);

  const eventItems: OfferCardData[] = venue.events.map((e) => ({
    id: e.id,
    image: e.image ?? e.posterImage,
    title: e.name,
    description: e.shortDescription,
    venueName: venue.name,
    venueLogo: venue.logo,
    meta: formatEventSchedule(e),
    href: `/events/${e.slug}`,
  }));

  const promotionItems: EventCarouselItem[] = venue.promotions.map((p) => ({
    img: p.posterImage ?? p.image ?? p.bannerImage ?? POSTER_FALLBACK,
    title: p.name,
    shortDescription: p.shortDescription,
    href: `/promotions/${p.slug}`,
  }));

  return (
    <StickyHero
      backdrop={
        <ParallaxImage>
          <Image
            src={venue.bannerImage ?? venue.image ?? FALLBACK}
            alt={venue.name}
            fill
            className="object-cover"
            priority
          />
        </ParallaxImage>
      }
      heroContent={
        <Container className="relative z-10 flex h-full flex-col justify-end gap-4 pb-12">
          {venue.category ? (
            <span className="font-archivo text-sm uppercase tracking-[0.18em] text-white">
              {venue.category.name}
            </span>
          ) : null}
          <h1 className="max-w-3xl font-syne text-[clamp(2.5rem,6vw,60px)] font-semibold uppercase leading-[1.05] text-white">
            {venue.name}
          </h1>
        </Container>
      }
    >
      <Reveal>
        <VenueDescription venue={venue} />
      </Reveal>

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
          <OfferCardSection
            title={`What's Happening at ${venue.name}`}
            lead="Discover upcoming events, live performances, and special nights happening at this venue."
            offers={eventItems}
            ctaText="See all events"
            ctaHref="/events"
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
          whatsapp={settings.mainWhatsapp}
        />
      </Reveal>

      <Reveal>
        <VenueSocialEmbeds
          spotifyEmbed={venue.spotifyEmbed}
          youtubeEmbed={venue.youtubeEmbed}
          instagramEmbed={venue.instagramEmbed}
          venueName={venue.name}
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
    </StickyHero>
  );
}
