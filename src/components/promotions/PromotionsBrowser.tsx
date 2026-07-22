"use client";

import { useState } from "react";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PromotionCard, type PromoCard } from "./PromotionCard";

type Mode = "venues" | "categories";

const PAGE = 6;

/**
 * VENUES / CATEGORIES toggle with a left sidebar (All + items) that filters the
 * promotion grid in memory. Client-side; Load More slices the filtered list.
 */
export function PromotionsBrowser({
  promotions,
  venues,
  categories,
}: {
  promotions: PromoCard[];
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
  const filtered = promotions.filter((p) => {
    if (selectedId === null) return true;
    return mode === "venues" ? p.venueId === selectedId : p.promotionCategoryId === selectedId;
  });
  const shown = filtered.slice(0, visible);

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
                {shown.map((p) => (
                  <PromotionCard key={p.id} promo={p} />
                ))}
              </div>
            ) : (
              <p className="w-full py-12 text-center font-inter text-white">No promotions found.</p>
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
