-- AlterTable
ALTER TABLE "Promotion" ADD COLUMN     "promotionCategoryId" TEXT;

-- CreateTable
CREATE TABLE "PromotionCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromotionCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Promotion" ADD CONSTRAINT "Promotion_promotionCategoryId_fkey" FOREIGN KEY ("promotionCategoryId") REFERENCES "PromotionCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
