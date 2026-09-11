-- CreateEnum
CREATE TYPE "TalentStatus" AS ENUM ('RESIDENT', 'GUEST');

-- AlterTable
ALTER TABLE "Talent" ADD COLUMN     "status" "TalentStatus" NOT NULL DEFAULT 'RESIDENT';
