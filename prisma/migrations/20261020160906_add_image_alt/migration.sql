-- CreateTable
CREATE TABLE "ImageAlt" (
    "path" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImageAlt_pkey" PRIMARY KEY ("path")
);
