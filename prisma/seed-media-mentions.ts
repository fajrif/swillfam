import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const MENTIONS = [
  {
    title: "Le Cirque Grand Opening",
    articleTitle: "Le Cirque Brings a New Era of Nightlife to SCBD",
    publicationName: "Jakarta Post",
    publishedDate: new Date("2025-11-15"),
    shortDescription:
      "A deep dive into the opening of Jakarta's most anticipated nightlife venue, featuring interviews with the founders and a look at the space.",
    link: "https://example.com/le-cirque-opening",
  },
  {
    title: "SwillFam's Atsumaru Izakaya Feature",
    articleTitle: "Where to Find Authentic Izakaya in Jakarta",
    publicationName: "Indonesia Eats",
    publishedDate: new Date("2025-09-22"),
    shortDescription:
      "Atsumaru Izakaya is highlighted as one of the top spots for Japanese comfort food and late-night drinks in the city.",
    link: "https://example.com/atsumaru-feature",
  },
  {
    title: "Kilo Fashion Week Collaboration",
    articleTitle: "When Fashion Meets Nightlife: Kilo x JFW3",
    publicationName: "Hype Magazine",
    publishedDate: new Date("2025-10-05"),
    shortDescription:
      "Kilo partnered with Jakarta Fashion Week for an exclusive after-party that blended runway aesthetics with the club's industrial vibe.",
    link: "https://example.com/kilo-jfw",
  },
  {
    title: "Dualism Friday Residency",
    articleTitle: "Dualism Is Redefining the Jakarta Clubbing Scene",
    publicationName: "Mixmag Asia",
    publishedDate: new Date("2026-01-12"),
    shortDescription:
      "An inside look at Dualism's Friday night residency series, featuring international headliners and cutting-edge sound design.",
    link: "https://example.com/dualism-residency",
  },
  {
    title: "Zoo Rooftop Bar Review",
    articleTitle: "Best Rooftop Bars in Jakarta for 2026",
    publicationName: "Travel + Leisure",
    publishedDate: new Date("2026-02-18"),
    shortDescription:
      "Zoo is named among the city's top rooftop destinations, praised for its botanical design, craft cocktails, and skyline views.",
    link: "https://example.com/zoo-rooftop",
  },
  {
    title: "SwillFam Experience Launch",
    articleTitle: "SwillFam Launches Curated City Experiences Across Seven Venues",
    publicationName: "The Beat Jakarta",
    publishedDate: new Date("2025-08-30"),
    shortDescription:
      "A feature on the newly launched SwillFam Experience, offering guided journeys through the group's portfolio of venues from afternoon to late night.",
    link: "https://example.com/swillfam-experience",
  },
  {
    title: "SwillHouse Sunday Sessions",
    articleTitle: "Sunday Sessions at SwillHouse Are the New Brunch Spot",
    publicationName: "Cosmopolitan Indonesia",
    publishedDate: new Date("2026-03-10"),
    shortDescription:
      "SwillHouse's laid-back Sunday programming with live acoustic sets and bottomless brunch options earns a spot in the magazine's weekend guide.",
    link: "https://example.com/swillhouse-sundays",
  },
  {
    title: "Truce Speakeasy Profile",
    articleTitle: "Hidden in Plain Sight: Inside Truce, Jakarta's Newest Speakeasy",
    publicationName: "Timeout Jakarta",
    publishedDate: new Date("2026-04-01"),
    shortDescription:
      "A profile on Truce's concealed entrance, curated cocktail menu, and intimate setting that sets it apart in the city's nightlife landscape.",
    link: "https://example.com/truce-speakeasy",
  },
];

async function main() {
  await prisma.mediaMention.deleteMany();
  await prisma.mediaMention.createMany({ data: MENTIONS });
  console.log(`Seeded ${MENTIONS.length} media mentions.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
