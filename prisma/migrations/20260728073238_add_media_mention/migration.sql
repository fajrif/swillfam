-- CreateTable
CREATE TABLE "MediaMention" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "articleTitle" TEXT NOT NULL,
    "publicationName" TEXT NOT NULL,
    "publishedDate" TIMESTAMP(3) NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaMention_pkey" PRIMARY KEY ("id")
);
