-- CreateEnum
CREATE TYPE "VenueSchemaType" AS ENUM ('Restaurant', 'BarOrPub', 'CafeOrCoffeeShop', 'NightClub');

-- CreateEnum
CREATE TYPE "EventSchemaType" AS ENUM ('MusicEvent', 'FoodEvent', 'Event');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('EventScheduled', 'EventCancelled', 'EventPostponed', 'EventRescheduled');

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "author" TEXT;

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "eventStatus" "EventStatus" NOT NULL DEFAULT 'EventScheduled',
ADD COLUMN     "recapDuration" TEXT,
ADD COLUMN     "recapThumbnail" TEXT,
ADD COLUMN     "recapVideoUrl" TEXT,
ADD COLUMN     "schemaEventType" "EventSchemaType" NOT NULL DEFAULT 'Event';

-- AlterTable
ALTER TABLE "Venue" ADD COLUMN     "cuisine" TEXT,
ADD COLUMN     "instagramUrl" TEXT,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "schemaTypes" "VenueSchemaType"[],
ADD COLUMN     "streetAddress" TEXT;

-- CreateTable
CREATE TABLE "VenueHour" (
    "id" TEXT NOT NULL,
    "venueId" TEXT,
    "days" "Weekday"[],
    "opens" TEXT NOT NULL,
    "closes" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VenueHour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ArticleToVenue" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ArticleToVenue_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ArticleToVenue_B_index" ON "_ArticleToVenue"("B");

-- AddForeignKey
ALTER TABLE "VenueHour" ADD CONSTRAINT "VenueHour_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleToVenue" ADD CONSTRAINT "_ArticleToVenue_A_fkey" FOREIGN KEY ("A") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleToVenue" ADD CONSTRAINT "_ArticleToVenue_B_fkey" FOREIGN KEY ("B") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
