-- AlterTable
ALTER TABLE "PrivateEvent" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PrivateEvent_slug_key" ON "PrivateEvent"("slug");
