import { staticPageMetadata } from "@/lib/seo/static-page";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";
import { getArticleRows } from "@/lib/articles";
import { Reveal } from "@/components/Reveal";
import { Container } from "@/components/shared/Container";
import { StickyHero } from "@/components/shared/StickyHero";
import { ArticleListSection } from "@/components/shared/ArticleListSection";
import { ContinueExperience } from "@/components/category";
import { VenuesIntro, VenuesCategories, VenueLocator, SwillfamSpotlightSection } from "@/components/venues";
import { venueHoursText } from "@/lib/opening-hours";

// Statically rendered but data-driven (categories, venues, articles) — revalidate
// periodically so admin edits/seeds show up without a full rebuild.
export const revalidate = 60;

export const generateMetadata = () => staticPageMetadata("venues");

export default async function VenuesPage() {
  const [settings, categories, venues, articles] = await Promise.all([
    getSiteSettings(),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.venue.findMany({
      where: { published: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        location: true,
        operatingHours: true,
        hours: { orderBy: { sortOrder: "asc" }, select: { days: true, opens: true, closes: true } },
        lat: true,
        lng: true,
        whatsapp: true,
      },
    }),
    getArticleRows(3),
  ]);

  // The locator's hours come from the same structured rows as the venue page
  // and the schema, so the three can't disagree. Falls back to the free-text
  // field for venues whose hours aren't structured yet.
  const locatorVenues = venues.map(({ hours, ...venue }) => ({
    ...venue,
    operatingHours: venueHoursText(hours, venue.operatingHours),
  }));

  return (
    <StickyHero
      backdrop={
          <Image
            src="/home/hero.png"
            alt="SwillFam venues"
            fill
            className="object-cover"
            priority
          />
      }
      heroContent={
        <Container className="relative z-10 flex h-full flex-col justify-end gap-4 pb-12">
          <h1 className="max-w-3xl font-syne text-[clamp(2.5rem,6vw,60px)] font-semibold uppercase leading-[1.05] text-white">
            Spaces Made for Every Moment
          </h1>
          <p className="max-w-2xl font-inter text-base leading-relaxed text-white md:text-lg">
            Restaurants, bars, and nights out: eight SwillFam venues, each one built differently,
            each one suits your everyday moment.
          </p>
        </Container>
      }
    >
      <Reveal>
        <VenuesIntro />
      </Reveal>

      <Reveal>
        <VenuesCategories categories={categories} />
      </Reveal>

      <Reveal>
        <VenueLocator venues={locatorVenues} whatsapp={settings.mainWhatsapp} />
      </Reveal>

      <Reveal>
        <SwillfamSpotlightSection />
      </Reveal>

      <Reveal>
        <ContinueExperience />
      </Reveal>

      <Reveal>
        <ArticleListSection articles={articles} />
      </Reveal>
    </StickyHero>
  );
}
