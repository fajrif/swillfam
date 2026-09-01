import "dotenv/config";
import { prisma } from "../../src/lib/prisma";

/**
 * One-off content update for the "Venues" sheet of Swillfam.xlsx.
 * Updates Category.shortDescription (Lifestyle / Nightlife) — already rendered live
 * on /venues via SiblingCategorySection. Run with: npx tsx prisma/copy-updates/venues-sheet.ts
 */

const LIFESTYLE_DESCRIPTION = `SwillFam's lifestyle venues are spread across some of Jakarta's most sought-after dining pockets, from Senopati to Panglima Polim to Ashta District 8. Whether it's a proper lunch time with colleagues or dinner in Jakarta with people who matter, each restaurant carries its own identity while sharing one thing in common: menus built around flavor, and rooms built around comfort.

Beyond the table, discover a chill bar for easy conversation, a hidden bar tucked away from the usual crowd, or a cocktail bar SCBD regulars know for some of the best cocktails in Jakarta. From intimate lounges to late-night spots, every space is built to match the mood you're chasing.`;

const NIGHTLIFE_DESCRIPTION = `When the sun goes down, Jakarta Selatan comes alive, and SwillFam sits right at the center of it. Our club in SCBD delivers a scene built for those who live for the night, anchored by Zoo Club's signature sound and energy. House music and hip hop music shift the mood from room to room, giving every night its own rhythm, home to a proper hip hop club experience, and something different for those chasing a change of pace.

As one of the standout names in Jakarta Selatan, SwillFam has redefined what a night club in this city should feel like. This is a club the crowd trusts for real character, where every room is built to keep the night moving.`;

async function main() {
  const lifestyle = await prisma.category.findFirst({ where: { name: "Lifestyle" } });
  const nightlife = await prisma.category.findFirst({ where: { name: "Nightlife" } });

  if (!lifestyle) throw new Error('Category "Lifestyle" not found');
  if (!nightlife) throw new Error('Category "Nightlife" not found');

  await prisma.category.update({
    where: { id: lifestyle.id },
    data: { shortDescription: LIFESTYLE_DESCRIPTION },
  });

  await prisma.category.update({
    where: { id: nightlife.id },
    data: { shortDescription: NIGHTLIFE_DESCRIPTION },
  });

  console.log("Updated Category.shortDescription for Lifestyle and Nightlife.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
