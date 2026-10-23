import { staticPageMetadata, staticPageSeo } from "@/lib/seo/static-page";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { upcomingEventWhere } from "@/lib/event-scope";
import { getArticleRows } from "@/lib/articles";
import { getSiteSettings } from "@/lib/site-settings";
import { Reveal } from "@/components/Reveal";
import { Container } from "@/components/shared/Container";
import { StickyHero } from "@/components/shared/StickyHero";
import {
  FeaturedEventSection,
  EventsBrowser,
  EventCalendarSection,
  type FeaturedEventData,
  type EventCard,
} from "@/components/events";
import { PrivateEventsSection } from "@/components/merchandise";
import { ArticleListSection } from "@/components/shared/ArticleListSection";
import { DestinationsFeatureBand } from "@/components/shared/DestinationsFeatureBand";
import { dateKey, formatEventSchedule, formatHour, type CalendarEvent } from "@/lib/event-calendar";
import { JsonLd, archiveGraph } from "@/lib/schema";

// Statically rendered but data-driven (events, venues, categories, articles) —
// revalidate periodically so admin edits/seeds show up without a full rebuild.
export const revalidate = 60;

export const generateMetadata = () => staticPageMetadata("events");

export default async function EventsPage() {
  // One "now" for the whole render, so the grid and the calendar can't land on
  // opposite sides of a midnight.
  const now = new Date();

  const [settings, articles, events, venues, categories] = await Promise.all([
    getSiteSettings(),
    getArticleRows(3),
    // Finished events — retired by hand, or past their last day — drop out of
    // the calendar, the Upcoming grid, and the featured slot, but keep a
    // reachable detail page.
    prisma.event.findMany({
      where: upcomingEventWhere(now),
      orderBy: { startDate: "desc" },
      include: {
        venue: { select: { name: true, logo: true } },
        extraVenues: { select: { id: true } },
        eventCategory: { select: { id: true, name: true } },
      },
    }),
    prisma.venue.findMany({
      where: { published: true },
      orderBy: { name: "asc" },
      select: { id: true, slug: true, name: true, logo: true },
    }),
    prisma.eventCategory.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  const venueIdsOf = (e: (typeof events)[number]) => [
    ...(e.venueId ? [e.venueId] : []),
    ...e.extraVenues.map((v) => v.id),
  ];

  const featuredSource = events.find((e) => e.featured);
  const featured: FeaturedEventData | null = featuredSource
    ? {
        slug: featuredSource.slug,
        name: featuredSource.name,
        image: featuredSource.image ?? featuredSource.posterImage,
        venueName: featuredSource.venue?.name ?? null,
        shortDescription: featuredSource.shortDescription,
        dateLabel: formatEventSchedule(featuredSource),
        timeLabel: `${formatHour(featuredSource.startHour)} – ${formatHour(featuredSource.endHour)}`,
      }
    : null;

  const eventCards: EventCard[] = events.map((e) => ({
    id: e.id,
    slug: e.slug,
    name: e.name,
    shortDescription: e.shortDescription,
    image: e.image ?? e.posterImage,
    venueIds: venueIdsOf(e),
    eventCategoryId: e.eventCategoryId,
    venueName: e.venue?.name ?? null,
    venueLogo: e.venue?.logo ?? null,
    meta: formatEventSchedule(e),
  }));

  const calendarEvents: CalendarEvent[] = events.map((e) => ({
    id: e.id,
    slug: e.slug,
    name: e.name,
    shortDescription: e.shortDescription,
    eventType: e.eventType,
    startDate: e.startDate,
    endDate: e.endDate,
    startHour: e.startHour,
    endHour: e.endHour,
    recurringDays: e.recurringDays,
    featured: e.featured,
    venueIds: venueIdsOf(e),
    venueName: e.venue?.name ?? null,
    categoryName: e.eventCategory?.name ?? null,
    waPhone: e.waPhone,
  }));

  return (
    <StickyHero
      backdrop={
          <Image src="/events/banner.png" alt="" fill className="object-cover" priority />
      }
      heroContent={
        <Container className="relative z-10 flex h-full flex-col justify-end gap-4 pb-12">
          <h1 className="max-w-3xl font-syne text-[clamp(2.5rem,6vw,60px)] font-semibold uppercase leading-[1.05] text-white">
            Find Your Next Night Out
          </h1>
          <p className="max-w-2xl font-inter text-base leading-relaxed text-white md:text-lg">
            Explore what&apos;s on now, catch up on past events, and stay close to what&apos;s
            coming next.
          </p>
        </Container>
      }
    >
      <JsonLd
        data={archiveGraph({
          path: "/events",
          ...(await staticPageSeo("events")),
          crumbName: "Events",
          items: events.map((e) => ({ name: e.name, path: `/events/${e.slug}` })),
        })}
      />
      <FeaturedEventSection event={featured} />

      <EventsBrowser events={eventCards} venues={venues} categories={categories} />

      <EventCalendarSection
        events={calendarEvents}
        venues={venues}
        whatsapp={settings.mainWhatsapp}
        todayKey={dateKey(new Date())}
      />

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
    </StickyHero>
  );
}
