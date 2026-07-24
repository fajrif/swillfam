import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";
import { getArticleRows } from "@/lib/articles";
import { formatDateRange, formatDay } from "@/lib/date";
import {
  formatHour,
  formatLongDate,
  formatRecurringDays,
  nextOccurrence,
  occurrenceStart,
} from "@/lib/event-calendar";
import { Reveal } from "@/components/Reveal";
import { GalleryCarousel } from "@/components/shared/GalleryCarousel";
import { OfferCardSection } from "@/components/shared/OfferCardSection";
import { type OfferCardData } from "@/components/shared/OfferCard";
import { DestinationsFeatureBand } from "@/components/shared/DestinationsFeatureBand";
import { PrivateEventsSection } from "@/components/merchandise";
import { ArticleListSection } from "@/components/shared/ArticleListSection";
import {
  EventCountdown,
  EventDetailBanner,
  EventTicketsSection,
  EventVenueSection,
  PastEditionsSection,
  RecurringEventDetail,
  SingleEventDetail,
} from "@/components/events";

// SSG per known slug at build time, but data-driven — revalidate periodically so
// admin edits/seeds show up without a full rebuild.
export const revalidate = 60;

/** Cached so generateMetadata and the page share a single DB read per request. */
const getEventBySlug = cache((slug: string) =>
  prisma.event.findUnique({
    where: { slug },
    include: { venue: true, eventCategory: true },
  }),
);

export async function generateStaticParams() {
  // Deactivated events are included: they drop out of the calendar and listings
  // but keep a reachable detail page (and are linked from "Past Editions").
  const rows = await prisma.event.findMany({ select: { slug: true } });
  return rows.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Event | SwillFam" };
  return {
    title: `${event.name} | SwillFam`,
    description: event.shortDescription,
  };
}

export default async function EventSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const isRecurring = event.eventType === "RECURRING";

  const [related, pastEditions, settings, articles] = await Promise.all([
    // "More events like this": live events sharing this one's venue or category.
    prisma.event.findMany({
      where: {
        id: { not: event.id },
        active: true,
        isPrivate: false,
        ...(event.venueId || event.eventCategoryId
          ? {
              OR: [
                ...(event.venueId ? [{ venueId: event.venueId }] : []),
                ...(event.eventCategoryId ? [{ eventCategoryId: event.eventCategoryId }] : []),
              ],
            }
          : {}),
      },
      orderBy: { startDate: "desc" },
      take: 3,
      include: { venue: { select: { name: true, logo: true } } },
    }),
    // "Past Editions" (recurring only): retired events from the same venue +
    // category, which is as close to "this series" as the schema can express.
    isRecurring
      ? prisma.event.findMany({
          where: {
            id: { not: event.id },
            active: false,
            isPrivate: false,
            ...(event.venueId ? { venueId: event.venueId } : {}),
            ...(event.eventCategoryId ? { eventCategoryId: event.eventCategoryId } : {}),
          },
          orderBy: { startDate: "desc" },
          include: { venue: { select: { name: true, logo: true } } },
        })
      : Promise.resolve([]),
    getSiteSettings(),
    getArticleRows(3),
  ]);

  const venue = event.venue;
  const phone = event.waPhone ?? settings.mainWhatsapp;
  const timeLabel = `${formatHour(event.startHour)} – ${formatHour(event.endHour)}`;

  /** Same labelling rule as the /events listing: weekdays for recurring, dates otherwise. */
  const scheduleLabel = (e: {
    eventType: string;
    recurringDays: string[];
    startDate: Date;
    endDate: Date | null;
  }) => {
    if (e.eventType === "RECURRING") return formatRecurringDays(e.recurringDays);
    if (!e.endDate || e.endDate.getTime() === e.startDate.getTime()) return formatDay(e.startDate);
    return formatDateRange(e.startDate, e.endDate);
  };

  const toOffer = (e: (typeof related)[number]): OfferCardData => ({
    id: e.id,
    image: e.image ?? e.posterImage,
    title: e.name,
    description: e.shortDescription,
    venueName: e.venue?.name ?? null,
    venueLogo: e.venue?.logo ?? null,
    meta: scheduleLabel(e),
    href: `/events/${e.slug}`,
  });

  // Single "now" for both the countdown gate and the next-edition lookup. This
  // is a Server Component, so it resolves once per render/revalidation.
  const now = new Date();

  // A countdown only makes sense for a live, one-off event that hasn't started.
  const startsAt = occurrenceStart(event.startDate, event.startHour);
  const showCountdown = !isRecurring && event.active && startsAt > now;

  const next = isRecurring ? nextOccurrence(event.recurringDays, now) : null;

  return (
    <>
      <EventDetailBanner
        image={event.bannerImage ?? event.image}
        alt={event.name}
        title={isRecurring ? event.name : undefined}
      />

      {isRecurring ? (
        <RecurringEventDetail
          name={event.name}
          shortDescription={event.shortDescription}
          description={event.description}
          image={event.image}
          dayLabel={formatRecurringDays(event.recurringDays)}
          nextDateLabel={next ? `${formatLongDate(next)} – ${formatHour(event.startHour)}` : null}
          venueName={venue?.name ?? null}
          categoryName={event.eventCategory?.name ?? null}
          phone={phone}
          active={event.active}
        />
      ) : (
        <SingleEventDetail
          name={event.name}
          description={event.description}
          poster={event.posterImage}
          categoryName={event.eventCategory?.name ?? null}
          venueName={venue?.name ?? null}
          dateLabel={scheduleLabel(event)}
          timeLabel={timeLabel}
          phone={phone}
          active={event.active}
        />
      )}

      {showCountdown ? (
        <EventCountdown
          targetIso={startsAt.toISOString()}
          eventName={event.name}
          venueName={venue?.name ?? null}
          phone={phone}
          active={event.active}
        />
      ) : null}

      {/* Event Recap — sourced from the event's own gallery images. */}
      {event.galleries.length > 0 ? (
        <Reveal>
          <GalleryCarousel
            title="Event Recap"
            description="Relive past SwillFam events through selected photos, videos, and highlight moments."
            images={event.galleries}
          />
        </Reveal>
      ) : null}

      {isRecurring && pastEditions.length > 0 ? (
        <Reveal>
          <PastEditionsSection seriesName={event.name} editions={pastEditions.map(toOffer)} />
        </Reveal>
      ) : null}

      {!isRecurring && venue ? (
        <Reveal>
          <EventVenueSection
            name={venue.name}
            slug={venue.slug}
            description={venue.description}
            image={venue.image ?? venue.bannerImage}
          />
        </Reveal>
      ) : null}

      {!isRecurring && (event.ticketInfo || event.ticketLink) ? (
        <Reveal>
          <EventTicketsSection
            image={event.image ?? event.bannerImage}
            ticketInfo={event.ticketInfo}
            ticketLink={event.ticketLink}
            eventName={event.name}
            venueName={venue?.name ?? null}
            phone={phone}
            active={event.active}
          />
        </Reveal>
      ) : null}

      {related.length > 0 ? (
        <Reveal>
          <OfferCardSection
            title={isRecurring ? "More Events You Might Like" : "More Events Like This"}
            lead={
              isRecurring
                ? "Discover other recurring events and special programs happening across SwillFam."
                : "Discover more events happening across SwillFam venues."
            }
            offers={related.map(toOffer)}
          />
        </Reveal>
      ) : null}

      <Reveal>
        <DestinationsFeatureBand
          rightTitle="Explore Promotions"
          rightBody="SwillFam promotions bring the latest offers, specials, and venue deals together in one place, making it easier to enjoy food, drinks, events, and nightlife experiences across the SwillFam world."
          rightCtaLabel="View Promotions"
          rightCtaHref="/promotions"
        />
      </Reveal>

      <Reveal>
        <PrivateEventsSection />
      </Reveal>

      <Reveal>
        <ArticleListSection articles={articles} />
      </Reveal>
    </>
  );
}
