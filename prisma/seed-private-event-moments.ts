import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { MOMENTS_SETTING_KEY } from "../src/lib/private-event-moments";

/**
 * Seeds the "Moments We've Hosted" gallery on /private-events with the three
 * photos it showed before the gallery became admin-managed, so the page does
 * not lose them on the way.
 *
 * Create-if-missing, and safe to re-run: once the setting row exists the admin
 * owns the list, and this never touches it again — including when they have
 * deliberately emptied it. Likewise an alt text someone has already written is
 * left alone.
 */
const SEED = [
  { path: "/private-events/events-1.png", alt: "A private celebration at a SwillFam venue" },
  { path: "/private-events/events-2.png", alt: "Guests at a SwillFam private event" },
  { path: "/private-events/events-3.png", alt: "A corporate function hosted by SwillFam" },
];

async function main() {
  const existing = await prisma.siteSetting.findUnique({ where: { key: MOMENTS_SETTING_KEY } });
  if (existing) {
    console.log("  · private event moments already configured — skipped");
    return;
  }

  await prisma.siteSetting.create({
    data: { key: MOMENTS_SETTING_KEY, value: JSON.stringify(SEED.map((s) => s.path)) },
  });
  for (const { path, alt } of SEED) {
    await prisma.imageAlt.upsert({ where: { path }, update: {}, create: { path, alt } });
  }
  console.log(`  ✓ seeded ${SEED.length} moments`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
