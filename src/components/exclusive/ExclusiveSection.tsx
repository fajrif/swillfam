"use client";

import { useState } from "react";
import { Container } from "@/components/shared/Container";
import { ExclusiveNav, type ExclusiveTab } from "./ExclusiveNav";
import { GalleryGrid } from "./GalleryGrid";
import { VideosGrid } from "./VideosGrid";
import { EditorialList } from "./EditorialList";

/** GALLERY / VIDEOS / EDITORIAL tab switcher above the matching content. */
export function ExclusiveSection() {
  const [tab, setTab] = useState<ExclusiveTab>("GALLERY");

  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col gap-10">
        <ExclusiveNav active={tab} onChange={setTab} />
        {tab === "GALLERY" && <GalleryGrid />}
        {tab === "VIDEOS" && <VideosGrid />}
        {tab === "EDITORIAL" && <EditorialList />}
      </Container>
    </section>
  );
}
