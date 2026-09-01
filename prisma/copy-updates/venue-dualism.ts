import "dotenv/config";
import { prisma } from "../../src/lib/prisma";

/**
 * One-off content update for the "Venue Dualism" sheet of Swillfam.xlsx.
 * Run with: npx tsx prisma/copy-updates/venue-dualism.ts
 */

const SLUG = "dualism";

const HERO_TITLE = "Two stories, One pour";
const HERO_DESCRIPTION =
  "Every cocktail begins the same way, then splits into two distinct expressions, bold and spirit-forward, or playful and delicate.";

const CAPTION = "Contrast, Crafted Into Cocktails";
const DESCRIPTION =
  "Dualism is a cocktail bar in SCBD, built on a simple idea: every cocktail has two stories. As one of the standout names in cocktail bar Jakarta Selatan, Dualism Jakarta invites guests to explore a menu where each drink starts from the same base before branching into two versions, one bold and spirit-forward, the other playful and delicate. Some pours are clean and composed, others decadent and expressive, together showing that contrast isn't about difference, it's about discovery. Recognized among the best bars in Jakarta, Dualism Bar brings a speakeasy sensibility to SCBD bar culture, raising the bar for what cocktails in Jakarta Selatan can be.";

const GALLERY_TITLE = "Inside Dualism";
const GALLERY_DESCRIPTION = "Step inside Dualism and see the space for yourself.";

// Dualism has no non-special "menu" gallery — the xlsx's "Menu" header (Photo/Pdf-Only Display)
// has nowhere to render; its only special gallery is a dish-card gallery, mapped to "What to Try" below.
const WHAT_TO_TRY_TITLE = "What to Try";
const WHAT_TO_TRY_DESCRIPTION = "First time at Dualism? These are the pairings to start with.";

const TALENT_SECTION_TITLE = "Meet the Bar Team";
const TALENT_SECTION_DESCRIPTION = "The mixologists and bartenders behind every pour at Dualism.";

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
      "Most SwillFam venues lean smart casual. Think polished, put-together, and ready for a night out. Specific dress codes may vary by venue, so it's worth checking ahead for the space you're visiting.",
    sortOrder: 1,
  },
  {
    question: "Do you take private event bookings?",
    answer:
      "Yes, many SwillFam venues are available for private events and celebrations. Reach out through our contact page to check availability and start planning.",
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
      talentSectionTitle: TALENT_SECTION_TITLE,
      talentSectionDescription: TALENT_SECTION_DESCRIPTION,
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

  await galleryUpdate("Inside Dualism", GALLERY_TITLE, GALLERY_DESCRIPTION);
  await galleryUpdate("Signature Beverages", WHAT_TO_TRY_TITLE, WHAT_TO_TRY_DESCRIPTION);

  await prisma.faq.deleteMany({ where: { segment: "venue", refSlug: SLUG } });
  await prisma.faq.createMany({
    data: FAQS.map((f) => ({ ...f, segment: "venue", refSlug: SLUG, published: true })),
  });

  console.log("Updated Venue Dualism: hero, caption, description, gallery headers, talent section, FAQs.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
