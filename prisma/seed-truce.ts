import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { ensureUniqueSlug } from "../src/lib/slug";

const FOLDER = "truce";
const asset = (file: string) => `/categories/venues/${FOLDER}/${file}`;

async function getOrCreateVenue() {
  const existing = await prisma.venue.findUnique({ where: { slug: "truce" } });
  if (existing) return existing;

  const category = await prisma.category.findFirst({ where: { name: "Lifestyle" } });
  const slug = await ensureUniqueSlug("Truce", async (s) => {
    const found = await prisma.venue.findUnique({ where: { slug: s } });
    return !!found;
  });
  return prisma.venue.create({
    data: {
      name: "Truce",
      slug,
      description:
        "In the heart of SCBD, Truce introduces Jakarta to a slow bar experience inspired by Japanese bar philosophy. Every detail at Truce is intentional. The beverage programme focuses on spirit-forward, classic drinks crafted with method over novelty. Sugar is used sparingly, and a deep respect for base spirits remains central to the offerings. To keep the experience dynamic, the bar also features house ferments, savoury tinctures and hydroponic herbs grown on site.\n\nThe cocktail list is divided into four categories. Crafted Creations reinterpret classic structures with a smoked, late-night twist, while Original Vol. 1 experiments with Japanese ingredients such as edamame, gari and ogura. Seasonal specials, like Hail Mary Pass, push the boundaries of savoury drinking. For lighter moods, highballs, teas and spritzes can be found in the Seltzers and Mizuwari section, reflecting Tokyo\u2019s preference for refreshing drinks that extend the evening.",
      caption: "A slow bar inspired by Japanese philosophy",
      shortDescription:
        "A laid-back bar and lounge built for after-work unwinding and easy evenings out. Truce offers a curated drinks list, considered small plates, and a warm room that invites you to settle in and stay a while.",
      image: asset("image.png"),
      bannerImage: asset("banner.webp"),
      logo: asset("logo.png"),
      categoryId: category?.id ?? null,
      operatingHours: "Tuesday - Sunday: 18:00 - 02:00",
      location: "SCBD, Jakarta",
      lat: -6.22616914830079,
      lng: 106.80707301098985,
    },
  });
}

async function seedGalleries(venueId: string) {
  await prisma.segmentGallery.create({
    data: {
      title: "Inside Truce",
      description:
        "A slow bar where every detail is intentional \u2014 a warm, considered space built for spirit-forward classics and unhurried evenings in the heart of SCBD.",
      images: [asset("gallery-1.jpg"), asset("gallery-2.jpg"), asset("gallery-3.jpg")],
      imageTitles: [],
      imageDescriptions: [],
      special: false,
      venueId,
    },
  });

  console.log("Seeded 1 segment gallery (Inside).");
}

async function seedPromotions(venueId: string) {
  const now = new Date();
  const in30 = new Date(now.getTime() + 30 * 86400000);

  const cats = await prisma.promotionCategory.findMany({ select: { id: true, name: true } });
  const catId = (name: string) => cats.find((c) => c.name === name)?.id ?? null;

  const PROMOS = [
    {
      poster: "/promotions/sample-promo-truce.png",
      category: "Group & Table",
      name: "Group Table Package",
      shortDescription: "Reserve a table for your group and enjoy a curated round of house classics to start the night.",
      description:
        "Settle in with your crew at Truce. Our group table package includes a reserved table and a curated round of spirit-forward house classics, the perfect way to begin an unhurried evening together.",
      caption: "Valid for groups of 4+",
      terms: "<p>Valid for groups of four or more with advance table reservation. Not combinable with other promotions.</p>",
      startHour: "18:00",
      endHour: "23:00",
    },
    {
      poster: asset("gallery-1.jpg"),
      category: "Food & Drink",
      name: "Truce Happy Hour",
      shortDescription: "Selected classic cocktails and highballs at a special price from open until 8 PM.",
      description:
        "Ease into the evening with Truce's happy hour. Enjoy selected spirit-forward classics and refreshing highballs at a special price from opening until 8 PM, paired with our small plates.",
      caption: "Tue – Sun, open – 20:00",
      terms: "<p>Valid Tuesday to Sunday from opening until 20:00. Dine-in only. Not combinable with other promotions.</p>",
      startHour: "18:00",
      endHour: "20:00",
    },
    {
      poster: asset("gallery-2.jpg"),
      category: "Seasonal",
      name: "Seasonal Sessions",
      shortDescription: "A rotating list of seasonal specials built around house ferments and hydroponic herbs.",
      description:
        "Discover Truce's seasonal specials, a rotating selection of drinks built around house ferments, savoury tinctures, and hydroponic herbs grown on site. Available for a limited time each season.",
      caption: "Limited seasonal run",
      terms: "<p>Available while the seasonal list runs. Selection changes without notice. One per guest per visit.</p>",
      startHour: "18:00",
      endHour: "02:00",
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
        promotionCategoryId: catId(p.category),
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
      answer: "Walk-ins are welcome, but reservations are recommended for weekends and peak hours.",
    },
    {
      question: "Does Truce serve food?",
      answer: "Truce focuses on a curated beverage programme with a selection of bar snacks and small plates designed to complement the drinks menu.",
    },
    {
      question: "Can I host a private event at Truce?",
      answer: "Yes. Truce can be booked for private events and intimate gatherings. Reach out to our team to discuss availability.",
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

  console.log(`\nDone seeding Truce (${venue.slug}).`);
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
