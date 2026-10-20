import { cache } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getArticleRows } from "@/lib/articles";
import { getFaqs } from "@/lib/faqs";
import { getSiteSettings } from "@/lib/site-settings";
import { Reveal } from "@/components/Reveal";
import { Container } from "@/components/shared/Container";
import { StickyHero } from "@/components/shared/StickyHero";
import { HeroTitle } from "@/components/shared/HeroTitle";
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
import { upcomingEventWhere } from "@/lib/event-scope";
import { livePromotionWhere } from "@/lib/promotion-scope";
import { venueHoursText } from "@/lib/opening-hours";
import { JsonLd, venueGraph } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo/metadata";
import { venueSeo } from "@/lib/seo/entities";
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

/** Cached so generateMetadata and the page share a single DB read per request. */
export const getVenueBySlug = cache((slug: string) =>
  // findFirst, not findUnique: the published filter is not part of the unique key.
  prisma.venue.findFirst({
    where: { slug, published: true },
    include: {
      category: true,
      hours: { orderBy: { sortOrder: "asc" } },
      segmentGalleries: { orderBy: { createdAt: "asc" } },
      talents: { where: { status: "RESIDENT" }, orderBy: { createdAt: "asc" } },
      // "Current Offers" shows only offers that are actually current; an
      // expired one 301s to /promotions, so a card here would be a link to a
      // redirect.
      promotions: { where: livePromotionWhere(new Date()), orderBy: { startDate: "asc" } },
      // "What's Coming Next" has to mean it: finished events are excluded by
      // the same rule the /events grid uses. `upcomingEventWhere` carries the
      // venue scope too, which is redundant here (we are inside one published
      // venue) but harmless, and spelling the rule out a second time is how
      // the two lists would drift apart.
      events: { where: upcomingEventWhere(new Date()), orderBy: { startDate: "asc" } },
    },
  }),
);

export type VenueDetail = NonNullable<Awaited<ReturnType<typeof getVenueBySlug>>>;

export function venueMetadata(venue: VenueDetail): Metadata {
  const seo = venueSeo(venue);
  return buildMetadata({
    path: `/venues/${venue.slug}`,
    title: seo.title.value,
    description: seo.description.value,
    image: seo.image.value,
    imageAlt: venue.name,
  });
}

export async function VenueView({ venue }: { venue: VenueDetail }) {
  const [otherVenues, faqs, articles, settings] = await Promise.all([
    venue.categoryId
      ? prisma.venue.findMany({
          where: { categoryId: venue.categoryId, id: { not: venue.id }, published: true },
          orderBy: { name: "asc" },
          take: 3,
        })
      : Promise.resolve([]),
    getFaqs("venue", venue.slug),
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
    <>
      {/* The venue node, its breadcrumb, and the FAQs this page renders — the
          FAQPage block is built from the same `faqs` the accordion shows. */}
      <JsonLd data={venueGraph(venue, faqs)} />
      <StickyHero
      backdrop={
          <Image
            src={venue.bannerImage ?? venue.image ?? FALLBACK}
            alt={venue.name}
            fill
            className="object-cover"
            priority
          />
      }
      heroContent={
        <Container className="relative z-10 flex h-full flex-col justify-end gap-4 pb-12">
          {venue.category ? (
            <span className="font-archivo text-sm uppercase tracking-[0.18em] text-white">
              {venue.category.name}
            </span>
          ) : null}
          <HeroTitle name={venue.name} tagline={venue.heroTitle} />
          {venue.heroDescription ? (
            <p className="max-w-2xl font-inter text-base leading-relaxed text-white md:text-lg">
              {venue.heroDescription}
            </p>
          ) : null}
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
          <TalentSection
            talents={venue.talents}
            title={venue.talentSectionTitle ?? "Meet the Team"}
            description={
              venue.talentSectionDescription ??
              `The chefs and crew behind every dish and drink at ${venue.name}.`
            }
          />
        </Reveal>
      ) : null}

      {eventItems.length > 0 ? (
        <Reveal>
          <OfferCardSection
            title="What's Coming Next"
            lead={`Stay close to what's coming next at ${venue.name}.`}
            offers={eventItems}
            ctaText="See all events"
            ctaHref="/events"
          />
        </Reveal>
      ) : null}

      {promotionItems.length > 0 ? (
        <Reveal>
          <EventSectionWithImage
            title="Current Offers"
            description={`Limited-time deals and seasonal specials worth checking before your next visit to ${venue.name}.`}
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
          operatingHours={venueHoursText(venue.hours, venue.operatingHours)}
          lat={venue.lat}
          lng={venue.lng}
          whatsapp={venue.whatsapp ?? settings.mainWhatsapp}
          placeId={venue.placeId}
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
    </>
  );
}
