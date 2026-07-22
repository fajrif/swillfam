-- AlterTable: add social embed columns (nullable, mirror Venue)
ALTER TABLE "Talent" ADD COLUMN     "spotifyEmbed" TEXT;
ALTER TABLE "Talent" ADD COLUMN     "youtubeEmbed" TEXT;
ALTER TABLE "Talent" ADD COLUMN     "instagramEmbed" TEXT;

-- AlterTable: add slug as NULLABLE first so existing rows can be backfilled
ALTER TABLE "Talent" ADD COLUMN     "slug" TEXT;

-- Backfill slug from name. Mirrors src/lib/slug.ts: lowercase, non-alphanumerics -> '-',
-- trim leading/trailing '-', fall back to 'item'; collisions get a -2/-3 suffix.
WITH base AS (
    SELECT
        "id",
        COALESCE(
            NULLIF(trim(BOTH '-' FROM regexp_replace(lower("name"), '[^a-z0-9]+', '-', 'g')), ''),
            'item'
        ) AS root
    FROM "Talent"
),
ranked AS (
    SELECT "id", root, row_number() OVER (PARTITION BY root ORDER BY "id") AS rn
    FROM base
)
UPDATE "Talent" t
SET "slug" = CASE WHEN r.rn = 1 THEN r.root ELSE r.root || '-' || r.rn END
FROM ranked r
WHERE t."id" = r."id";

-- Enforce NOT NULL + uniqueness now that every row has a slug
ALTER TABLE "Talent" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Talent_slug_key" ON "Talent"("slug");
