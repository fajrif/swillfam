-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('ADMINISTRATOR', 'OPERATOR');

-- AlterTable — rename (not drop + add) so existing names carry over into fullName.
ALTER TABLE "AdminUser" RENAME COLUMN "name" TO "fullName";

ALTER TABLE "AdminUser" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "passwordChangedAt" TIMESTAMP(3),
ADD COLUMN     "position" TEXT,
ADD COLUMN     "role" "AdminRole" NOT NULL DEFAULT 'OPERATOR',
ADD COLUMN     "venueId" TEXT;

-- Every account that existed before roles had full access — keep it that way.
-- New rows default to the least-privileged OPERATOR.
UPDATE "AdminUser" SET "role" = 'ADMINISTRATOR';

-- AddForeignKey
ALTER TABLE "AdminUser" ADD CONSTRAINT "AdminUser_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE SET NULL ON UPDATE CASCADE;
