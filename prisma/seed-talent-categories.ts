import "dotenv/config";
import { prisma } from "../src/lib/prisma";

/**
 * Seeds the talent categories. Idempotent and non-destructive: each category is
 * find-or-created by name, so it is safe to run repeatedly and safe against a
 * production database that may already have some categories (e.g. added in admin).
 */
const CATEGORIES = ["DJ", "Chef", "Bartender", "Special Guest"];

async function main() {
  let created = 0;
  for (const name of CATEGORIES) {
    const existing = await prisma.talentCategory.findFirst({ where: { name } });
    if (existing) continue;
    await prisma.talentCategory.create({ data: { name } });
    created += 1;
  }
  console.log(`Talent categories ready: ${created} created, ${CATEGORIES.length - created} already present.`);
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
