import "dotenv/config";
import { prisma } from "../../src/lib/prisma";

/**
 * One-off content update for the "Venue Atsumaru" sheet of Swillfam.xlsx.
 * Run with: npx tsx prisma/copy-updates/venue-atsumaru.ts
 */

const SLUG = "atsumaru-izakaya";

const HERO_TITLE = "Izakaya Culture, Reimagined";
const HERO_DESCRIPTION =
  "Traditional warmth meets contemporary craft, a space built for everyday dining, after-work drinks, and celebrations worth remembering.";

const CAPTION = "Tokyo Roots, Jakarta Table";
const DESCRIPTION =
  "Atsumaru Izakaya is a modern Japanese restaurant on Jalan Panglima Polim, curated by Tokyo-born Chef Aoyagi Harry, whose experience with Japan's renowned WDI Group shapes every dish on the menu. Rooted in the cherished tradition of izakaya hangouts, Atsumaru invites guests to come together with friends, family, and loved ones, for an office lunch, a birthday lunch, or even a dinner date. Rooted in tradition, shaped by the precision of Tokyo's dining culture, Atsumaru continues to evolve, and the menu shows it.";

const GALLERY_TITLE = "Inside Atsumaru Izakaya";
const GALLERY_DESCRIPTION = "Step inside and see the space that brings izakaya culture to life.";

const MENU_TITLE = "Explore Our Menu";
const MENU_DESCRIPTION =
  "From yakitori to donburi, sashimi to izakaya classics, discover the full Atsumaru menu, dish by dish.";

const WHAT_TO_TRY_TITLE = "What to Try";
const WHAT_TO_TRY_DESCRIPTION = "Not sure where to start? Here are the dishes guests keep coming back for.";

const FAQS: { question: string; answer: string; sortOrder: number }[] = [
  {
    question: "Do I need a reservation, or can I walk in?",
    answer:
      "Reservations are recommended, especially on weekends and for larger groups, but walk-ins are always welcome based on availability.",
    sortOrder: 0,
  },
  {
    question: "What's the dress code?",
    answer:
      "Atsumaru is smart casual. Come as you are, as long as you're ready to eat well. No strict dress code, just a room that rewards a little effort.",
    sortOrder: 1,
  },
  {
    question: "Do you take private event bookings?",
    answer:
      "Yes, Atsumaru is available for private dining, birthday lunches, corporate dinners, and group celebrations. Get in touch and we'll take care of the details.",
    sortOrder: 2,
  },
];

async function main() {
  const venue = await prisma.venue.findUnique({
    where: { slug: SLUG },
    include: { segmentGalleries: true },
  });
  if (!venue) throw new Error(`Venue "${SLUG}" not found`);

  await prisma.venue.update({
    where: { id: venue.id },
    data: {
      heroTitle: HERO_TITLE,
      heroDescription: HERO_DESCRIPTION,
      caption: CAPTION,
      description: DESCRIPTION,
    },
  });

  const galleryUpdate = async (matchTitle: string, title: string, description: string) => {
    const gallery = venue.segmentGalleries.find((g) => g.title === matchTitle);
    if (!gallery) {
      console.warn(`  ! gallery "${matchTitle}" not found, skipping`);
      return;
    }
    await prisma.segmentGallery.update({ where: { id: gallery.id }, data: { title, description } });
  };

  await galleryUpdate("Inside Atsumaru", GALLERY_TITLE, GALLERY_DESCRIPTION);
  await galleryUpdate("Explore the Menu", MENU_TITLE, MENU_DESCRIPTION);
  await galleryUpdate("What to Try at Atsumaru", WHAT_TO_TRY_TITLE, WHAT_TO_TRY_DESCRIPTION);

  await prisma.faq.deleteMany({ where: { segment: "venue", refSlug: SLUG } });
  await prisma.faq.createMany({
    data: FAQS.map((f) => ({ ...f, segment: "venue", refSlug: SLUG, published: true })),
  });

  console.log("Updated Venue Atsumaru: hero, caption, description, gallery headers, FAQs.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
