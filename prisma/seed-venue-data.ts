import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { prisma } from "../src/lib/prisma";
import type { VenueSchemaType, Weekday } from "../src/generated/prisma/client";

/**
 * Fills the venue fact-sheet fields and the organisation's contact settings
 * from the client's answers (`prisma/data/swillfam-venue-data.json`, the SEO
 * team's `swillfam-venue-data.json` of 22 Oct 2026), so the schema, the venue
 * pages and `llms.txt` all read the same values.
 *
 * Safe to re-run, and safe next to team edits: by default a field is written
 * only when it is empty or still holds a placeholder, so nothing the content
 * team typed is replaced. Opening hours are written only for a venue that has
 * none.
 *
 *   --dry-run     print what would change, write nothing
 *   --overwrite   also replace name, short description, coordinates, WhatsApp,
 *                 the organisation's email and the venue's hours with the
 *                 client's values. For the first load, where the seeded copy
 *                 from the fork is known to be wrong — check a --dry-run first.
 *
 * Dualism's coordinates are not in the client's file; they were read from its
 * Maps pin and written into the data file with a note.
 */

type HourRow = { days: string[]; opens: string; closes: string };
type VenueData = {
  slug: string;
  name: string;
  schema_type: VenueSchemaType[];
  street: string;
  postal: string;
  lat: number | null;
  lng: number | null;
  hours: HourRow[];
  whatsapp: string;
  instagram: string;
  cuisine: string | null;
  description: string;
};
type OrgData = { email: string; telephone: string; sameAs: string[] };

const DRY = process.argv.includes("--dry-run");
const OVERWRITE = process.argv.includes("--overwrite");

const data = JSON.parse(
  readFileSync(join(__dirname, "data", "swillfam-venue-data.json"), "utf8"),
) as { organization: OrgData; venues: VenueData[] };

const isBlank = (value: unknown) => value === null || value === undefined || value === "";
const isPlaceholder = (value: string | null) => !!value && value.startsWith("[PLACEHOLDER]");

/** Write when the field is empty/placeholder, or when `--overwrite` says the client's value wins. */
function pick<T>(current: T | null, next: T | null, overwritable: boolean): T | null {
  if (next === null) return current;
  if (isBlank(current) || (typeof current === "string" && isPlaceholder(current))) return next;
  return overwritable && OVERWRITE ? next : current;
}

async function seedVenues() {
  for (const v of data.venues) {
    const current = await prisma.venue.findUnique({
      where: { slug: v.slug },
      include: { hours: true },
    });
    if (!current) {
      console.warn(`  ⚠ Venue "${v.slug}" not found — skipped`);
      continue;
    }

    const next = {
      name: pick(current.name, v.name, true) ?? current.name,
      shortDescription: pick(current.shortDescription, v.description, true),
      streetAddress: pick(current.streetAddress, v.street, false),
      postalCode: pick(current.postalCode, v.postal, false),
      lat: pick(current.lat, v.lat, true),
      lng: pick(current.lng, v.lng, true),
      whatsapp: pick(current.whatsapp, v.whatsapp, true),
      instagramUrl: pick(current.instagramUrl, v.instagram, false),
      cuisine: pick(current.cuisine, v.cuisine, false),
    };
    const typesNeeded = current.schemaTypes.length === 0;
    const hoursNeeded = current.hours.length === 0 || OVERWRITE;

    const changed = Object.entries(next)
      .filter(([key, value]) => value !== (current as Record<string, unknown>)[key])
      .map(([key]) => key);
    if (typesNeeded) changed.push("schemaTypes");
    if (hoursNeeded) changed.push(`hours(${v.hours.length})`);

    console.log(`  ${changed.length ? "✓" : "·"} ${v.slug}: ${changed.join(", ") || "nothing to change"}`);
    if (DRY || changed.length === 0) continue;

    await prisma.venue.update({
      where: { id: current.id },
      data: {
        ...next,
        ...(typesNeeded ? { schemaTypes: v.schema_type } : {}),
        ...(hoursNeeded
          ? {
              hours: {
                deleteMany: {},
                create: v.hours.map((row, index) => ({
                  days: row.days.map((day) => day.toUpperCase() as Weekday),
                  opens: row.opens,
                  closes: row.closes,
                  sortOrder: index,
                })),
              },
            }
          : {}),
      },
    });
  }
}

/** Values the fork's `seed-site-settings.ts` writes, i.e. "not filled in yet". */
const SEEDED_DEFAULTS: Record<string, string[]> = {
  mainEmail: ["contact@swillfam.com"],
  mainWhatsapp: ["+62 123 456 7890"],
  mainPhone: ["+62 123 456 7890"],
};

async function seedSettings() {
  const social = (host: string) => data.organization.sameAs.find((url) => url.includes(host)) ?? "";
  const wanted: Record<string, string> = {
    mainEmail: data.organization.email,
    mainWhatsapp: data.organization.telephone,
    mainPhone: data.organization.telephone,
    socialInstagram: social("instagram.com"),
    socialTiktok: social("tiktok.com"),
    socialYoutube: social("youtube.com"),
    socialLinkedin: social("linkedin.com"),
  };

  for (const [key, value] of Object.entries(wanted)) {
    const row = await prisma.siteSetting.findUnique({ where: { key } });
    const current = row?.value ?? "";
    const replaceable =
      current === "" || SEEDED_DEFAULTS[key]?.includes(current) || (OVERWRITE && key === "mainEmail");
    if (!replaceable || current === value) {
      console.log(`  · ${key}: kept`);
      continue;
    }
    console.log(`  ✓ ${key}: ${JSON.stringify(current)} → ${JSON.stringify(value)}`);
    if (!DRY) {
      await prisma.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } });
    }
  }
}

async function main() {
  console.log(`${DRY ? "[dry run] " : ""}${OVERWRITE ? "[overwrite] " : ""}Venues:`);
  await seedVenues();
  console.log("Organisation settings:");
  await seedSettings();
  console.log("Done.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
