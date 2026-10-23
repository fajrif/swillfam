-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Promotion" ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Talent" ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "_EventExtraVenues" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EventExtraVenues_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_EventExtraVenues_B_index" ON "_EventExtraVenues"("B");

-- AddForeignKey
ALTER TABLE "_EventExtraVenues" ADD CONSTRAINT "_EventExtraVenues_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventExtraVenues" ADD CONSTRAINT "_EventExtraVenues_B_fkey" FOREIGN KEY ("B") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
