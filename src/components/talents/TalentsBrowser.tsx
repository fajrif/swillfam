"use client";

import { useState } from "react";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { OfferCard, type OfferCardData } from "@/components/shared/OfferCard";

export type TalentCardData = {
  id: string;
  name: string;
  description: string;
  image: string | null;
  venueId: string | null;
  talentCategoryId: string | null;
  venueName: string | null;
  venueLogo: string | null;
  categoryName: string | null;
};

type Mode = "venues" | "categories";

const PAGE = 6;

/**
 * VENUES / CATEGORIES toggle with a left sidebar (All + items) that filters the
 * talent grid in memory. Client-side; Load More slices the filtered list.
 */
export function TalentsBrowser({
  talents,
  venues,
  categories,
}: {
  talents: TalentCardData[];
  venues: { id: string; name: string }[];
  categories: { id: string; name: string }[];
}) {
  const [mode, setMode] = useState<Mode>("venues");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [visible, setVisible] = useState(PAGE);

  function switchMode(next: Mode) {
    if (next === mode) return;
    setMode(next);
    setSelectedId(null);
    setVisible(PAGE);
  }

  function select(id: string | null) {
    setSelectedId(id);
    setVisible(PAGE);
  }

  const items = mode === "venues" ? venues : categories;
  const filtered = talents.filter((t) => {
    if (selectedId === null) return true;
    return mode === "venues" ? t.venueId === selectedId : t.talentCategoryId === selectedId;
  });
  const shown: OfferCardData[] = filtered.slice(0, visible).map((t) => ({
    id: t.id,
    image: t.image,
    title: t.name,
    description: t.description,
    venueName: t.venueName,
    venueLogo: t.venueLogo,
    meta: t.categoryName,
  }));

  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col gap-10">
        {/* VENUES / CATEGORIES toggle */}
        <nav className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
          {(["venues", "categories"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => switchMode(m)}
              className={cn(
                "font-syne text-[clamp(2rem,6vw,64px)] font-bold uppercase leading-none tracking-tight transition-colors",
                mode === m ? "text-white" : "text-white/40 hover:text-white",
              )}
            >
              {m === "venues" ? "Venues" : "Categories"}
            </button>
          ))}
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr] lg:gap-12">
          {/* Sidebar: All + venues or categories */}
          <aside className="flex flex-col gap-3">
            <SidebarItem label="All" active={selectedId === null} onClick={() => select(null)} />
            {items.map((it) => (
              <SidebarItem
                key={it.id}
                label={it.name}
                active={selectedId === it.id}
                onClick={() => select(it.id)}
              />
            ))}
          </aside>

          {/* Grid + Load More */}
          <div className="flex flex-col items-center gap-12">
            {shown.length > 0 ? (
              <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
                {shown.map((offer) => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            ) : (
              <p className="w-full py-12 text-center font-inter text-white">No talents found.</p>
            )}

            {filtered.length > visible && (
              <Button type="button" variant="swillfam" size="pill" onClick={() => setVisible((v) => v + PAGE)}>
                Load More
              </Button>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

function SidebarItem({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "text-left font-syne text-2xl leading-tight transition-colors lg:text-[28px]",
        active ? "text-white" : "text-white/40 hover:text-white",
      )}
    >
      {label}
    </button>
  );
}
