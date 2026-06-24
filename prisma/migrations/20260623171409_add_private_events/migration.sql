-- CreateTable
CREATE TABLE "PrivateEventType" (
    "id" TEXT NOT NULL,
    "image" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrivateEventType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrivateEvent" (
    "id" TEXT NOT NULL,
    "image" TEXT,
    "bannerImage" TEXT,
    "title" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "privateEventTypeId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrivateEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PrivateEvent" ADD CONSTRAINT "PrivateEvent_privateEventTypeId_fkey" FOREIGN KEY ("privateEventTypeId") REFERENCES "PrivateEventType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
