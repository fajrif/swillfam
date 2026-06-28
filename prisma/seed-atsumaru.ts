import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { ensureUniqueSlug } from "../src/lib/slug";

/**
 * Seeds the full detail content for the "Atsumaru Izakaya" venue only:
 * segment galleries (Inside / Menu), the special "dishes" gallery (with per-image
 * captions), talents, promotions, events, and venue-segment FAQs.
 *
 * Idempotent: re-running replaces this venue's child rows and the "venue" FAQs.
 * Run with: npx tsx prisma/seed-atsumaru.ts
 */

const FOLDER = "atsumaru-izakaya";
const asset = (file: string) => `/categories/venues/${FOLDER}/${file}`;

async function getOrCreateVenue() {
  const existing = await prisma.venue.findUnique({ where: { slug: "atsumaru-izakaya" } });
  if (existing) return existing;

  const category = await prisma.category.findFirst({ where: { name: "Lifestyle" } });
  const slug = await ensureUniqueSlug("Atsumaru Izakaya", async (s) => {
    const found = await prisma.venue.findUnique({ where: { slug: s } });
    return !!found;
  });
  return prisma.venue.create({
    data: {
      name: "Atsumaru Izakaya",
      slug,
      description:
        "A Japanese-inspired dining and social destination made for good food, good drinks, and good company. Atsumaru Izakaya brings together warm hospitality, flavorful dishes, and a relaxed atmosphere for casual lunches, intimate dinners, and group gatherings.",
      image: asset("image.png"),
      bannerImage: asset("banner.png"),
      logo: asset("logo.png"),
      categoryId: category?.id ?? null,
      operatingHours: "Tuesday - Sunday: 18:00 - 02:00",
      location: "SCBD, Jakarta",
      lat: -6.249291022294074,
      lng: 106.8003771668123,
    },
  });
}

async function seedGalleries(venueId: string) {
  // Plain galleries (rendered as titled carousels, in creation order).
  await prisma.segmentGallery.create({
    data: {
      title: "Inside Atsumaru",
      description:
        "Step into a warm, design-led izakaya room built for long dinners, easy conversation, and late-night drinks across an intimate, atmospheric space.",
      images: [asset("gallery-1.png"), asset("gallery-2.png"), asset("gallery-3.png")],
      imageTitles: [],
      imageDescriptions: [],
      special: false,
      venueId,
    },
  });

  await prisma.segmentGallery.create({
    data: {
      title: "Explore the Menu",
      description:
        "From charcoal-grilled skewers to fresh sashimi and Japanese comfort classics, our menu is built to be shared across the table.",
      images: [asset("menu-1.png"), asset("menu-2.png"), asset("menu-3.png")],
      imageTitles: [],
      imageDescriptions: [],
      special: false,
      venueId,
    },
  });

  // Special "dishes" gallery — per-image title + description (hover cards).
  const dishes = [
    {
      img: asset("dishes-1.png"),
      title: "Chicken Karaage",
      description:
        "Crispy Japanese fried chicken marinated in soy, ginger, and garlic, served with house yuzu mayo.",
    },
    {
      img: asset("dishes-2.png"),
      title: "Salmon Aburi",
      description: "Lightly torched salmon nigiri brushed with sweet soy and finished with citrus zest.",
    },
    {
      img: asset("dishes-3.png"),
      title: "Beef Yakitori",
      description: "Charcoal-grilled beef skewers glazed in our house tare sauce.",
    },
    {
      img: asset("dishes-4.png"),
      title: "Matcha Warabi Mochi",
      description: "Soft warabi mochi dusted with stone-ground matcha and toasted kinako.",
    },
  ];
  await prisma.segmentGallery.create({
    data: {
      title: "What to Try at Atsumaru",
      description: "A few of the dishes our regulars keep coming back for.",
      images: dishes.map((d) => d.img),
      imageTitles: dishes.map((d) => d.title),
      imageDescriptions: dishes.map((d) => d.description),
      special: true,
      venueId,
    },
  });

  console.log("Seeded 3 segment galleries (Inside, Menu, Dishes).");
}

async function seedTalents(venueId: string) {
  const TALENTS = [
    {
      image: asset("talent-1.png"),
      name: "DJ Rei",
      speciality: "Resident DJ",
      description:
        "Atsumaru's resident selector, blending laid-back dining sessions with late-night energy across the week.",
      instagramUrl: "https://instagram.com/",
    },
    {
      image: asset("talent-2.png"),
      name: "Chef Hiro",
      speciality: "Head Chef",
      description:
        "Leads the kitchen with a menu rooted in Japanese comfort classics and seasonal, share-friendly plates.",
      instagramUrl: "https://instagram.com/",
    },
    {
      image: asset("talent-3.png"),
      name: "Aiko",
      speciality: "Live Vocalist",
      description:
        "Brings intimate live sets to the room on weekends, setting the tone from dinner service into the night.",
      instagramUrl: "https://instagram.com/",
    },
  ];
  await prisma.talent.createMany({ data: TALENTS.map((t) => ({ ...t, venueId })) });
  console.log(`Seeded ${TALENTS.length} talents.`);
}

async function seedPromotions(venueId: string) {
  const now = new Date();
  const in30 = new Date(now.getTime() + 30 * 86400000);
  const PROMOS = [
    {
      poster: asset("promo-1.png"),
      name: "Atsumaru Happy Hour",
      shortDescription: "Two-for-one signature highballs and sake every evening from open until 8 PM.",
      description:
        "Start the evening right with our daily happy hour. Enjoy two-for-one on signature highballs, draft beer, and house sake from opening until 8 PM, paired perfectly with our small plates.",
      caption: "Daily, open – 20:00",
      terms:
        "<p>Valid Tuesday to Sunday from opening until 20:00. Dine-in only. Not combinable with other promotions.</p>",
      startHour: "18:00",
      endHour: "20:00",
    },
    {
      poster: asset("promo-2.png"),
      name: "Weekend Sake Flight",
      shortDescription: "A curated flight of three premium sakes, available all weekend long.",
      description:
        "Discover the range of Japanese sake with a curated weekend flight. Three premium pours selected by our team, served with a tasting guide and a complimentary small plate.",
      caption: "Friday – Sunday",
      terms: "<p>Available Friday to Sunday while stocks last. One flight per guest per visit.</p>",
      startHour: "18:00",
      endHour: "23:00",
    },
  ];

  for (const p of PROMOS) {
    const slug = await ensureUniqueSlug(p.name, async (s) => {
      const found = await prisma.promotion.findUnique({ where: { slug: s } });
      return !!found;
    });
    await prisma.promotion.create({
      data: {
        name: p.name,
        slug,
        posterImage: p.poster,
        image: p.poster,
        shortDescription: p.shortDescription,
        description: p.description,
        caption: p.caption,
        terms: p.terms,
        startDate: now,
        endDate: in30,
        startHour: p.startHour,
        endHour: p.endHour,
        venueId,
      },
    });
  }
  console.log(`Seeded ${PROMOS.length} promotions.`);
}

async function seedEvents(venueId: string) {
  const categories = await prisma.eventCategory.findMany({ select: { id: true, name: true } });
  const categoryId = (name: string) => categories.find((c) => c.name === name)?.id ?? null;
  const now = new Date();

  const EVENTS = [
    {
      poster: asset("gallery-1.png"),
      name: "Sake & Jazz Night",
      category: "Music",
      shortDescription: "Live jazz paired with a curated sake list for a slow, atmospheric evening.",
      description:
        "An evening of live jazz and premium sake at Atsumaru. Settle in for a relaxed night of music, small plates, and considered pours as the room shifts from dinner into the night.",
      caption: "Live music",
      daysFromNow: 7,
      startHour: "20:00",
      endHour: "23:30",
    },
    {
      poster: asset("gallery-2.png"),
      name: "Izakaya Omakase Evening",
      category: "Dining Experience",
      shortDescription: "A chef-led omakase menu showcasing the best of the season, one course at a time.",
      description:
        "Join Chef Hiro for a special omakase evening — a multi-course tasting that showcases seasonal ingredients and the kitchen's signature techniques, paired with optional sake flights.",
      caption: "Dining experience",
      daysFromNow: 14,
      startHour: "19:00",
      endHour: "22:00",
    },
  ];

  for (const e of EVENTS) {
    const slug = await ensureUniqueSlug(e.name, async (s) => {
      const found = await prisma.event.findUnique({ where: { slug: s } });
      return !!found;
    });
    await prisma.event.create({
      data: {
        name: e.name,
        slug,
        posterImage: e.poster,
        image: e.poster,
        shortDescription: e.shortDescription,
        description: e.description,
        caption: e.caption,
        eventCategoryId: categoryId(e.category),
        eventType: "FIXED",
        startDate: new Date(now.getTime() + e.daysFromNow * 86400000),
        startHour: e.startHour,
        endHour: e.endHour,
        venueId,
      },
    });
  }
  console.log(`Seeded ${EVENTS.length} events.`);
}

async function seedVenueFaqs() {
  await prisma.faq.deleteMany({ where: { segment: "venue" } });
  const FAQS = [
    {
      question: "Do I need to make a reservation?",
      answer: "Walk-ins are welcome, but reservations are recommended for weekends, group bookings, and peak hours.",
    },
    {
      question: "Is Atsumaru Izakaya suitable for group dining?",
      answer:
        "Yes. The venue is suitable for casual gatherings, celebrations, after-work meals, and group dining experiences.",
    },
    {
      question: "Can I host a private event here?",
      answer:
        "Yes. Atsumaru Izakaya can be booked for private events, from intimate gatherings to full-venue celebrations. Reach out to our team to discuss availability.",
    },
    {
      question: "Is there parking available?",
      answer: "Yes, valet and self-parking are available at the SCBD complex where the venue is located.",
    },
  ];
  await prisma.faq.createMany({
    data: FAQS.map((f, i) => ({
      question: f.question,
      answer: `<p>${f.answer}</p>`,
      segment: "venue",
      sortOrder: i,
    })),
  });
  console.log(`Seeded ${FAQS.length} venue FAQs.`);
}

async function main() {
  const venue = await getOrCreateVenue();

  // Idempotent: clear this venue's child rows before reseeding.
  await prisma.segmentGallery.deleteMany({ where: { venueId: venue.id } });
  await prisma.talent.deleteMany({ where: { venueId: venue.id } });
  await prisma.promotion.deleteMany({ where: { venueId: venue.id } });
  await prisma.event.deleteMany({ where: { venueId: venue.id } });

  await seedGalleries(venue.id);
  await seedTalents(venue.id);
  await seedPromotions(venue.id);
  await seedEvents(venue.id);
  await seedVenueFaqs();

  console.log(`\nDone seeding Atsumaru Izakaya (${venue.slug}).`);
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
