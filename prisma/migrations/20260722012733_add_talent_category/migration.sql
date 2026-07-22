-- AlterTable
ALTER TABLE "Talent" ADD COLUMN     "talentCategoryId" TEXT;

-- CreateTable
CREATE TABLE "TalentCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TalentCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Talent" ADD CONSTRAINT "Talent_talentCategoryId_fkey" FOREIGN KEY ("talentCategoryId") REFERENCES "TalentCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
