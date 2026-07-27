-- AlterTable
ALTER TABLE "Faq" ADD COLUMN     "refSlug" TEXT;

-- AlterTable
ALTER TABLE "PrivateEvent" ADD COLUMN     "galleries" TEXT[],
ADD COLUMN     "galleryLead" TEXT,
ADD COLUMN     "galleryTitle" TEXT,
ADD COLUMN     "occasionsTitle" TEXT,
ADD COLUMN     "testimonialsLead" TEXT,
ADD COLUMN     "testimonialsTitle" TEXT,
ADD COLUMN     "venuesTitle" TEXT;

-- CreateTable
CREATE TABLE "PrivateEventOccasion" (
    "id" TEXT NOT NULL,
    "image" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "privateEventId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrivateEventOccasion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrivateEventTestimonial" (
    "id" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "privateEventId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrivateEventTestimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PrivateEventToVenue" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PrivateEventToVenue_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PrivateEventToVenue_B_index" ON "_PrivateEventToVenue"("B");

-- CreateIndex
CREATE INDEX "Faq_segment_refSlug_idx" ON "Faq"("segment", "refSlug");

-- AddForeignKey
ALTER TABLE "PrivateEventOccasion" ADD CONSTRAINT "PrivateEventOccasion_privateEventId_fkey" FOREIGN KEY ("privateEventId") REFERENCES "PrivateEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateEventTestimonial" ADD CONSTRAINT "PrivateEventTestimonial_privateEventId_fkey" FOREIGN KEY ("privateEventId") REFERENCES "PrivateEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PrivateEventToVenue" ADD CONSTRAINT "_PrivateEventToVenue_A_fkey" FOREIGN KEY ("A") REFERENCES "PrivateEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PrivateEventToVenue" ADD CONSTRAINT "_PrivateEventToVenue_B_fkey" FOREIGN KEY ("B") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
