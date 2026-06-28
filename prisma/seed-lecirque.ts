import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { ensureUniqueSlug } from "../src/lib/slug";

const FOLDER = "lecirque";
const asset = (file: string) => `/categories/venues/${FOLDER}/${file}`;

async function getOrCreateVenue() {
  const existing = await prisma.venue.findUnique({ where: { slug: "lecirque" } });
  if (existing) return existing;

  const category = await prisma.category.findFirst({ where: { name: "Nightlife" } });
  const slug = await ensureUniqueSlug("Lecirque", async (s) => {
    const found = await prisma.venue.findUnique({ where: { slug: s } });
    return !!found;
  });
  return prisma.venue.create({
    data: {
      name: "Lecirque",
      slug,
      description:
        "LE CIRQUE REPRESENTS A SHIFT TOWARD A BOLDER, MORE DYNAMIC AND MORE SOULFUL NIGHTLIFE CULTURE MIXED WITH MAD + FUN EXPERIENCE.\n\nA new cultural nightlife house built for Jakarta\u2019s growing community of music lovers. Designed as a playground of sound, style, and energy, Le Cirque brings an experience that blends intimacy, credibility, and modern nightlife culture \u2014 something truly different from anything currently offered in Indonesia. Powered by a custom lighting and visual system, the venue offers a dynamic, immersive atmosphere that moves in sync with the sound. Le Cirque champions a spectrum of unique house-driven styles \u2014 deep house, disco, minimal house, tech house, and modern club rhythms, presented by Indonesia\u2019s top talents and curated international guests. Built for tastemakers, dancers, and true music lovers, Le Cirque is where fun feels inevitable and every night feels alive.",
      caption: "A new cultural nightlife house",
      shortDescription:
        "A theatrical nightlife destination built for headline performances and venue takeovers. Lecirque blends live entertainment, immersive production, and a charged dance floor for unforgettable late-night experiences.",
      image: asset("image.png"),
      bannerImage: asset("banner.jpg"),
      logo: asset("logo.png"),
      categoryId: category?.id ?? null,
      operatingHours: "Friday - Saturday: 21:00 - 05:00",
      location: "SCBD, Jakarta",
      lat: -6.226252844973073,
      lng: 106.80709598215432,
    },
  });
}

async function seedGalleries(venueId: string) {
  await prisma.segmentGallery.create({
    data: {
      title: "Inside Le Cirque",
      description:
        "A playground of sound, style, and energy \u2014 where custom lighting and immersive visuals move in sync with the music, creating an atmosphere unlike anything in Jakarta.",
      images: [
        asset("gallery-1.jpg"), asset("gallery-2.jpg"), asset("gallery-3.jpg"),
        asset("gallery-4.jpg"), asset("gallery-5.jpg"), asset("gallery-6.jpg"),
        asset("gallery-7.jpg"), asset("gallery-8.jpg"),
      ],
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
        "Premium bottles, curated cocktails, and a selection fit for a night that moves from the lounge to the dance floor.",
      images: [asset("menu-1.png"), asset("menu-2.png")],
      imageTitles: [],
      imageDescriptions: [],
      special: false,
      venueId,
    },
  });

  console.log("Seeded 2 segment galleries (Inside, Menu).");
}

async function seedPromotions(venueId: string) {
  const now = new Date();
  const in30 = new Date(now.getTime() + 30 * 86400000);
  const PROMOS = [
    {
      poster: asset("promo-1.png"),
      name: "Le Cirque Opening Hour",
      shortDescription: "Free-flow selected drinks and discounted bottles during opening hour every Friday and Saturday.",
      description:
        "Arrive early and enjoy free-flow selected drinks and discounted bottle service during Le Cirque's opening hour. The best time to settle in, explore the room, and catch the first set of the night.",
      caption: "Fri \u2013 Sat, 21:00 \u2013 22:00",
      terms: "<p>Valid Friday and Saturday from 21:00 to 22:00. Dine-in only. Not combinable with other promotions.</p>",
      startHour: "21:00",
      endHour: "22:00",
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

async function seedVenueFaqs() {
  await prisma.faq.deleteMany({ where: { segment: "venue" } });
  const FAQS = [
    {
      question: "Do I need to make a reservation?",
      answer: "Walk-ins are welcome, but reservations are recommended for weekends, VIP tables, and group bookings.",
    },
    {
      question: "What kind of music does Le Cirque play?",
      answer: "Le Cirque champions house-driven styles \u2014 deep house, disco, minimal house, tech house, and modern club rhythms, presented by Indonesia's top talents and curated international guests.",
    },
    {
      question: "Can I host a private event at Le Cirque?",
      answer: "Yes. Le Cirque can be booked for private events, brand activations, and full-venue buyouts. Reach out to our team to discuss availability.",
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

  await prisma.segmentGallery.deleteMany({ where: { venueId: venue.id } });
  await prisma.promotion.deleteMany({ where: { venueId: venue.id } });

  await seedGalleries(venue.id);
  await seedPromotions(venue.id);
  await seedVenueFaqs();

  console.log(`\nDone seeding Le Cirque (${venue.slug}).`);
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
