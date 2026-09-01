import "dotenv/config";
import { prisma } from "../../src/lib/prisma";

/**
 * One-off content update for the "Venues Category Lifestyle Page" and
 * "Venues Category Nightlife Page" sheets of Swillfam.xlsx.
 * Updates Category.headline (hero), Category.introTitle (new field, intro section
 * heading), and Category.description (intro paragraph) for Lifestyle and Nightlife.
 * Run with: npx tsx prisma/copy-updates/category-pages-sheet.ts
 */

const LIFESTYLE = {
  headline: "Dining, Cocktails, and Everything In Between",
  introTitle: "Where Jakarta Comes to Gather",
  description:
    "Discover SwillFam's lifestyle venues, where food, drinks, atmosphere, and people come together. Each destination is built with its own identity, from relaxed daytime spots to elevated evening spaces, designed to feel considered rather than generic. Whether you're catching up over a casual meal, settling in for something more elevated, or simply looking for a space that fits the mood, every SwillFam venue is shaped around good company and moments worth remembering.",
};

const NIGHTLIFE = {
  headline: "Jakarta After Dark: SwillFam's Nightlife Venues",
  introTitle: "Where the City Comes Alive",
  description:
    "Discover SwillFam's nightlife venues, where sound, energy, and atmosphere collide. Each space carries its own identity, from rooms built around rhythm and movement to spaces made for a slower, more intentional kind of night. Whether you're chasing the crowd, the music, or simply somewhere that matches your energy, every SwillFam venue is shaped around the kind of night you'll still be talking about tomorrow.",
};

async function main() {
  const lifestyle = await prisma.category.findFirst({ where: { name: "Lifestyle" } });
  const nightlife = await prisma.category.findFirst({ where: { name: "Nightlife" } });

  if (!lifestyle) throw new Error('Category "Lifestyle" not found');
  if (!nightlife) throw new Error('Category "Nightlife" not found');

  await prisma.category.update({ where: { id: lifestyle.id }, data: LIFESTYLE });
  await prisma.category.update({ where: { id: nightlife.id }, data: NIGHTLIFE });

  console.log("Updated headline/introTitle/description for Lifestyle and Nightlife.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
