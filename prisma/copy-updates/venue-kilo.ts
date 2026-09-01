import "dotenv/config";
import { prisma } from "../../src/lib/prisma";

/**
 * One-off content update for the "Venue Kilo" sheet of Swillfam.xlsx.
 * Run with: npx tsx prisma/copy-updates/venue-kilo.ts
 */

const SLUG = "kilo";

const HERO_TITLE = "Flavor without Borders";
const HERO_DESCRIPTION =
  "Refined comfort food with Latin and Asian roots. A casual and vibrant dining experience where food, music, culture come together.";

const CAPTION = "Latin Heat, Asian Soul";
const DESCRIPTION =
  "Kilo Kitchen Jakarta is a comforting space where food and lifestyle meld, on the Ground Floor of Ashta District 8, right beside the Senopati lobby. Already a familiar name in the Senopati neighbourhood, Kilo has built its reputation on a distinctive blend of Latin and Asian cuisine, set inside a fresh, industrial space suited for an office lunch, a birthday lunch, or a dinner date. Just as accessible from SCBD, Senayan, and Pacific Place, the Kilo Jakarta menu features signature dishes like Squid Ink Rice, Slow-Cooked Beef Cheek, Octopus a la Plancha, and Jerk Lamb Shank, alongside cocktails including Black Mamba, Blue Scent, and Petrichor.";

const GALLERY_TITLE = "Inside Kilo";
const GALLERY_DESCRIPTION = "Step inside Kilo and see the space for yourself.";

const MENU_TITLE = "Explore Our Menu";
const MENU_DESCRIPTION =
  "From Squid Ink Rice to taco selections, signature cocktails to weekend brunch, discover the full Kilo Jakarta menu.";

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
      "Kilo is relaxed but considered. Come dressed for a good meal in a space that has an eye for detail. Smart casual works, weekend casual works.",
    sortOrder: 1,
  },
  {
    question: "Do you take private event bookings?",
    answer:
      "Yes, Kilo is available for private dining, corporate lunches, birthday celebrations, and group bookings. Get in touch and we'll make sure all your event needs are met.",
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

  await galleryUpdate("Inside Kilo", GALLERY_TITLE, GALLERY_DESCRIPTION);
  await galleryUpdate("Explore the Menu", MENU_TITLE, MENU_DESCRIPTION);
  // No "special" dish gallery exists for Kilo — the xlsx's "What to Try" header has nowhere to
  // render (DishesSection is only shown for special=true galleries). Not created here since there's
  // no dish image content to populate it with.

  await prisma.faq.deleteMany({ where: { segment: "venue", refSlug: SLUG } });
  await prisma.faq.createMany({
    data: FAQS.map((f) => ({ ...f, segment: "venue", refSlug: SLUG, published: true })),
  });

  console.log("Updated Venue Kilo: hero, caption, description, gallery headers, FAQs.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
