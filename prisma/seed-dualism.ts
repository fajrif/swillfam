import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { ensureUniqueSlug } from "../src/lib/slug";

const FOLDER = "dualism";
const asset = (file: string) => `/categories/venues/${FOLDER}/${file}`;

async function getOrCreateVenue() {
  const existing = await prisma.venue.findUnique({ where: { slug: "dualism" } });
  if (existing) return existing;

  const category = await prisma.category.findFirst({ where: { name: "Lifestyle" } });
  const slug = await ensureUniqueSlug("Dualism", async (s) => {
    const found = await prisma.venue.findUnique({ where: { slug: s } });
    return !!found;
  });
  return prisma.venue.create({
    data: {
      name: "Dualism",
      slug,
      description:
        "Dualism is Jakarta\u2019s innovative cocktail bar where contrast takes center stage.\n\nEvery cocktail begins with the same foundation, then branches into two distinct expressions: one bold and spirit-forward, the other playful and elegant. This dual-format menu invites guests to explore the endless possibilities of flavor, texture, and technique. At Dualism, you\u2019ll experience both the familiar and the unexpected. From clean and composed sips to indulgent and expressive pours, each pair reveals the dynamic spectrum of modern mixology. Whether you\u2019re a fan of classic cocktails or experimental drinks, Dualism redefines how we taste by celebrating the power of duality. This isn\u2019t just a bar, it\u2019s an exploration of opposites. And in every contrast, you\u2019ll discover something new.",
      caption: "Where every cocktail explores both sides",
      shortDescription:
        "A modern restaurant and bar where dinner service shifts effortlessly into an evening of drinks and music. Dualism balances a refined kitchen with a social, atmospheric room designed to carry a night from the first course onward.",
      image: asset("image.png"),
      bannerImage: asset("banner.jpg"),
      logo: asset("logo.png"),
      categoryId: category?.id ?? null,
      operatingHours: "Tuesday - Sunday: 18:00 - 02:00",
      location: "SCBD, Jakarta",
      lat: -6.230096084344473,
      lng: 106.80957632448332,
    },
  });
}

async function seedGalleries(venueId: string) {
  await prisma.segmentGallery.create({
    data: {
      title: "Inside Dualism",
      description:
        "An atmospheric cocktail bar where contrast takes center stage \u2014 a refined space built for exploring both the familiar and the unexpected.",
      images: [asset("gallery-1.jpg"), asset("gallery-2.jpg"), asset("gallery-3.jpg")],
      imageTitles: [],
      imageDescriptions: [],
      special: false,
      venueId,
    },
  });

  const beverages = [
    { img: asset("drinks-1.jpg"), title: "The Duality", description: "A split-base cocktail that begins identically then diverges \u2014 one half bold and spirit-forward, the other light and botanical." },
    { img: asset("drinks-2.jpg"), title: "Parallel Old Fashioned", description: "Two interpretations of the classic: one with smoked bourbon and demerara, the other with clarified milk and tea." },
    { img: asset("drinks-3.jpg"), title: "Mirror Martini", description: "A single gin meets two vermouths \u2014 dry and herbaceous on one side, blanc and floral on the other." },
    { img: asset("drinks-4.jpg"), title: "Dual Negroni", description: "The same Campari and sweet vermouth frame, split between a London dry gin build and a mezcal-led variation." },
    { img: asset("drinks-5.jpg"), title: "Contrast Collins", description: "A refreshing lemon base diverges into a cucumber-mint cooler and a spicy ginger-ginger variant." },
    { img: asset("drinks-6.jpg"), title: "Split Daiquiri", description: "One side aged rum, lime, and rich sugar; the other unaged Rhum agricole with grapefruit and honey." },
    { img: asset("drinks-7.jpg"), title: "Yin & Yang Sour", description: "A whiskey sour split \u2014 one with egg white and Angostura, the other with aquafaba and activated charcoal for a dramatic black-white serve." },
    { img: asset("drinks-8.jpg"), title: "Opposite Manhattan", description: "Rye and sweet vermouth meet two amaro choices \u2014 one alpine and bright, the other dark and bitter." },
    { img: asset("drinks-9.jpg"), title: "Eclipse Spritz", description: "Aperol and prosecco form the base; one side gets grapefruit and rosemary, the other blood orange and thyme." },
    { img: asset("drinks-10.jpg"), title: "Twin Margarita", description: "Classic lime and agave on one side, a smoky mezcal and yuzu variation on the other." },
    { img: asset("drinks-11.jpg"), title: "Half-Light Highball", description: "Japanese whisky and soda \u2014 one with ginger and shiso, the other with plum and jasmine." },
    { img: asset("drinks-12.jpg"), title: "Flipside Sazerac", description: "Cognac and absinthe on one side, rye and peychauds on the other, served in mirrored glasses." },
    { img: asset("drinks-13.jpg"), title: "Dual Boulevardier", description: "Bourbon and Campari split between a sweet vermouth route and a blanc vermouth variation." },
    { img: asset("drinks-14.jpg"), title: "Echo Tiki", description: "A tropical duo \u2014 one bright and citrus-led with rum blend, the other deep and spiced with falernum." },
    { img: asset("drinks-15.jpg"), title: "Polar Paloma", description: "Tequila and grapefruit branch into a salted rim classic and a spicy chili-honey rim alternative." },
    { img: asset("drinks-16.jpg"), title: "Shadow Julep", description: "Bourbon and mint, with one side using traditional crushed ice and the other a pebble-ice frozen finish." },
    { img: asset("drinks-17.jpg"), title: "Divided Sling", description: "A Singapore Sling split \u2014 one cherry-and-pineapple sweet, the other dry and herbaceous with B\u00e9n\u00e9dictine." },
  ];

  await prisma.segmentGallery.create({
    data: {
      title: "Signature Beverages",
      description:
        "Every cocktail begins with the same foundation, then branches into two distinct expressions \u2014 one bold and spirit-forward, the other playful and elegant. Each pair reveals the dynamic spectrum of modern mixology.",
      images: beverages.map((b) => b.img),
      imageTitles: beverages.map((b) => b.title),
      imageDescriptions: beverages.map((b) => b.description),
      special: true,
      venueId,
    },
  });

  console.log("Seeded 2 segment galleries (Inside, Beverages).");
}

async function seedVenueFaqs() {
  await prisma.faq.deleteMany({ where: { segment: "venue" } });
  const FAQS = [
    {
      question: "Do I need to make a reservation?",
      answer: "Walk-ins are welcome, but reservations are recommended for weekends and peak hours.",
    },
    {
      question: "Is Dualism suitable for group visits?",
      answer: "Yes. Dualism's bar layout works well for small groups looking to explore the cocktail menu together.",
    },
    {
      question: "Can I host a private event at Dualism?",
      answer: "Yes. Dualism can be booked for private events and cocktail experiences. Reach out to our team to discuss availability.",
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

  await seedGalleries(venue.id);
  await seedVenueFaqs();

  console.log(`\nDone seeding Dualism (${venue.slug}).`);
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
