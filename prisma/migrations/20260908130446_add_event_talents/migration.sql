-- CreateTable
CREATE TABLE "_EventToTalent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EventToTalent_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_EventToTalent_B_index" ON "_EventToTalent"("B");

-- AddForeignKey
ALTER TABLE "_EventToTalent" ADD CONSTRAINT "_EventToTalent_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToTalent" ADD CONSTRAINT "_EventToTalent_B_fkey" FOREIGN KEY ("B") REFERENCES "Talent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
