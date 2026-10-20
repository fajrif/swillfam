import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { publishedVenueScope } from "@/lib/venue-scope";
import { getSiteSettings } from "@/lib/site-settings";
import { getArticleRows } from "@/lib/articles";
import { formatDateRange, formatDay } from "@/lib/date";
import {
  formatHour,
  formatLongDate,
  formatRecurringDays,
  isPastEvent,
  nextOccurrence,
  occurrenceStart,
} from "@/lib/event-calendar";
import { pastEventWhere, upcomingEventWhere } from "@/lib/event-scope";
import { Reveal } from "@/components/Reveal";
import { GalleryCarousel } from "@/components/shared/GalleryCarousel";
import { OfferCardSection } from "@/components/shared/OfferCardSection";
import { type OfferCardData } from "@/components/shared/OfferCard";
import { DestinationsFeatureBand } from "@/components/shared/DestinationsFeatureBand";
import { PrivateEventsSection } from "@/components/merchandise";
import { ArticleListSection } from "@/components/shared/ArticleListSection";
import { TalentSection } from "@/components/venues";
import { JsonLd, eventGraph } from "@/lib/schema";
import {
  EventCountdown,
  EventDetailBanner,
  EventRecapSection,
  EventTicketsSection,
  EventVenueSection,
  PastEditionsSection,
  RECAP_ANCHOR,
  RecurringEventDetail,
  SingleEventDetail,
} from "@/components/events";
import { formatIsoDuration } from "@/lib/duration";
import { parseVideoUrl } from "@/lib/video";
import { buildMetadata } from "@/lib/seo/metadata";
import { eventSeo } from "@/lib/seo/entities";
import { withAlts } from "@/lib/image-alt";

// SSG per known slug at build time, but data-driven — revalidate periodically so
// admin edits/seeds show up without a full rebuild.
export const revalidate = 60;

/** Cached so generateMetadata and the page share a single DB read per request. */
const getEventBySlug = cache((slug: string) =>
  // findFirst, not findUnique: the venue scope is not part of the unique key.
  prisma.event.findFirst({
    where: { slug, ...publishedVenueScope },
    include: { venue: true, eventCategory: true, talents: { orderBy: { name: "asc" } } },
  }),
);

export async function generateStaticParams() {
  // Deactivated events are included: they drop out of the calendar and listings
  // but keep a reachable detail page (and are linked from "Past Editions").
  const rows = await prisma.event.findMany({ where: publishedVenueScope, select: { slug: true } });
  return rows.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  // The page itself calls notFound() for this; the tags only need to keep the
  // 404 out of the index should a crawler see it before the status code.
  if (!event) return { title: "Event Not Found", robots: { index: false, follow: true } };

  const seo = eventSeo(event);
  return buildMetadata({
    path: `/events/${event.slug}`,
    title: seo.title.value,
    description: seo.description.value,
    image: seo.image.value,
    imageAlt: event.name,
  });
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

  // One "now" for every date comparison on this page — the queries below, the
  // countdown gate, and the next-edition lookup. This is a Server Component,
  // so it resolves once per render/revalidation.
  const now = new Date();

  const [related, pastEditions, settings, articles] = await Promise.all([
    // "More events like this": upcoming events sharing this one's venue or
    // category. Both scopes own `AND`, and this query adds its own top-level
    // `OR`, which a spread would clobber.
    prisma.event.findMany({
      where: {
        id: { not: event.id },
        ...upcomingEventWhere(now),
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
    // "Past Editions" (recurring only): finished events from the same venue +
    // category, which is as close to "this series" as the schema can express.
    isRecurring
      ? prisma.event.findMany({
          where: {
            id: { not: event.id },
            ...pastEventWhere(now),
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
  const phone = event.waPhone ?? venue?.whatsapp ?? settings.mainWhatsapp;
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

  // The page stays a 200 either way — the brief wants a finished event
  // reachable and recapped, not redirected — but everything that offers to book
  // it switches off. `isPastEvent` also catches a one-off whose date has gone
  // by while still flagged active, which is the state both seeded events were
  // in.
  const isPast = isPastEvent(event, now);

  // A countdown only makes sense for a live, one-off event that hasn't started.
  const startsAt = occurrenceStart(event.startDate, event.startHour);
  const showCountdown = !isRecurring && !isPast && startsAt > now;

  const next = isRecurring ? nextOccurrence(event.recurringDays, now) : null;

  // The recap: a video, a photo gallery, or both. `parseVideoUrl` returns null
  // for a URL this page can't play, which is also the condition under which the
  // schema omits the VideoObject — so the markup and the section appear and
  // disappear together.
  const recapSource = parseVideoUrl(event.recapVideoUrl);
  const hasRecap = recapSource !== null || event.galleries.length > 0;
  // Only a finished event's CTA is redirected; a live one still takes bookings.
  const recapHref = isPast && hasRecap ? `#${RECAP_ANCHOR}` : undefined;

  return (
    <>
      {/* A recurring night emits one Event per upcoming date: a single Event
          with no concrete startDate is invalid markup. */}
      <JsonLd data={eventGraph(event)} />
      <EventDetailBanner
        image={event.bannerImage ?? event.image}
        alt={event.name}
        title={isRecurring ? event.name : undefined}
      />

      {isRecurring ? (
        <RecurringEventDetail
          name={event.name}
          slug={event.slug}
          nextEditionDescription={event.nextEditionDescription || event.shortDescription}
          description={event.description}
          image={event.image}
          dayLabel={formatRecurringDays(event.recurringDays)}
          nextDateLabel={next ? `${formatLongDate(next)} – ${formatHour(event.startHour)}` : null}
          venueName={venue?.name ?? null}
          categoryName={event.eventCategory?.name ?? null}
          phone={phone}
          active={!isPast}
          recapHref={recapHref}
        />
      ) : (
        <SingleEventDetail
          name={event.name}
          slug={event.slug}
          description={event.description}
          poster={event.posterImage}
          categoryName={event.eventCategory?.name ?? null}
          venueName={venue?.name ?? null}
          dateLabel={scheduleLabel(event)}
          timeLabel={timeLabel}
          phone={phone}
          active={!isPast}
          recapHref={recapHref}
        />
      )}

      {showCountdown ? (
        <EventCountdown
          targetIso={startsAt.toISOString()}
          eventName={event.name}
          venueName={venue?.name ?? null}
          phone={phone}
          active={!isPast}
        />
      ) : null}

      {/* The recap, video first. One anchor wraps both blocks so the past-event
          CTA lands on whichever of them this event actually has. */}
      {hasRecap ? (
        <div id={RECAP_ANCHOR} className="scroll-mt-24">
          {recapSource ? (
            <Reveal>
              <EventRecapSection
                source={recapSource}
                // The image the markup reports as `thumbnailUrl`, same order.
                thumbnail={event.recapThumbnail ?? event.posterImage ?? event.image}
                eventName={event.name}
                durationLabel={formatIsoDuration(event.recapDuration)}
              />
            </Reveal>
          ) : null}

          {event.galleries.length > 0 ? (
            <Reveal>
              <GalleryCarousel
                title="Event Recap"
                description="Relive past SwillFam events through selected photos, videos, and highlight moments."
                images={await withAlts(event.galleries, (_, i) => `${event.name} (${i + 1})`)}
              />
            </Reveal>
          ) : null}
        </div>
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
            active={!isPast}
            recapHref={recapHref}
          />
        </Reveal>
      ) : null}

      {event.talents.length > 0 ? (
        <Reveal>
          <TalentSection
            talents={event.talents}
            title="Featured Talents"
            description={`Meet the talents performing at ${event.name}.`}
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
