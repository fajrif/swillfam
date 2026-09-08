import "dotenv/config";
import { prisma } from "../src/lib/prisma";

/**
 * One-time move of the meta title/description that used to be hardcoded in each
 * static page's `export const metadata` into the database (see `PageSeo`). The
 * page files now read from here at request time; this seed just carries the
 * pre-existing copy forward so nothing changes for a visitor on day one.
 */
const ROWS: { pageKey: string; metaTitle: string; metaDescription: string }[] = [
  {
    pageKey: "home",
    metaTitle: "SwillFam — Discover the City's Best Lifestyle & Nightlife Experiences",
    metaDescription:
      "SwillFam connects people with the city's best venues, events, and stories — from casual nights out to curated social experiences and exclusive gatherings.",
  },
  {
    pageKey: "about",
    metaTitle: "About SwillFam — Creating Jakarta's Most Memorable Nights",
    metaDescription:
      "Discover SwillFam's story, philosophy, and mission to create unforgettable experiences in Jakarta's nightlife and hospitality scene.",
  },
  {
    pageKey: "careers",
    metaTitle: "Careers | SwillFam",
    metaDescription:
      "Explore open roles across SwillFam venues and join a team that brings the city's best lifestyle and nightlife experiences to life.",
  },
  {
    pageKey: "contact",
    metaTitle: "Contact SwillFam — Get in Touch",
    metaDescription:
      "Reach the SwillFam team for general inquiries, business opportunities, collaborations, private events, media requests, and venue reservations.",
  },
  {
    pageKey: "experience",
    metaTitle: "The SwillFam Experience | SwillFam",
    metaDescription:
      "One day, different ways to experience SwillFam — a journey through the city from morning coffee to late-night events across our venues.",
  },
  {
    pageKey: "exclusive",
    metaTitle: "Exclusive | SwillFam",
    metaDescription:
      "Stories, moments, and first looks from across the SwillFam family of venues — a curated gallery of celebrations, events, and nightlife.",
  },
  {
    pageKey: "media-mentions",
    metaTitle: "Media Mentions | SwillFam",
    metaDescription:
      "Browse past articles, interviews, features, and external links covering SwillFam venues, events, and experiences.",
  },
  {
    pageKey: "merchandise",
    metaTitle: "Merchandise | SwillFam",
    metaDescription:
      "SwillFam merchandise made for those who live the scene beyond the venue — selected pieces inspired by our venues, events, and lifestyle culture.",
  },
  {
    pageKey: "privacy",
    metaTitle: "Privacy Policy | Swillfam",
    metaDescription: "How Swillfam Group collects, uses, and protects your data.",
  },
  {
    pageKey: "terms",
    metaTitle: "Terms & Conditions | Swillfam",
    metaDescription: "Terms and conditions governing the use of Swillfam Group's website and venues.",
  },
  {
    pageKey: "events",
    metaTitle: "Events | SwillFam",
    metaDescription:
      "Stay updated with upcoming events, parties, and gatherings across SwillFam's network.",
  },
  {
    pageKey: "promotions",
    metaTitle: "Promotions | SwillFam",
    metaDescription:
      "Check out the latest promotions, deals, and special offers across SwillFam venues.",
  },
  {
    pageKey: "talents",
    metaTitle: "Talents | SwillFam",
    metaDescription:
      "Meet the DJs, chefs, bartenders, and special guests behind the SwillFam experience.",
  },
  {
    pageKey: "venues",
    metaTitle: "Venues | SwillFam",
    metaDescription:
      "Explore SwillFam's distinctive venues — each with its own concept, atmosphere, and experience. Browse by category and find every destination on the map.",
  },
  {
    pageKey: "private-events",
    metaTitle: "Private Events | SwillFam",
    metaDescription:
      "Host corporate functions, birthdays, brand activations, and celebrations across SwillFam's distinctive venues — events designed around your vision.",
  },
  {
    pageKey: "articles",
    metaTitle: "Articles & Journals | SwillFam",
    metaDescription:
      "Stories, recommendations, and insider guides from the SwillFam world — nightlife, lifestyle, talents, and the people who make every night memorable.",
  },
];

async function main() {
  for (const { pageKey, metaTitle, metaDescription } of ROWS) {
    await prisma.pageSeo.upsert({
      where: { pageKey },
      update: { metaTitle, metaDescription },
      create: { pageKey, metaTitle, metaDescription },
    });
    console.log(`seeded PageSeo: ${pageKey}`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
