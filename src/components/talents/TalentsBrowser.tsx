"use client";

import { useState } from "react";
import { Container } from "@/components/shared/Container";
import { SpecularButton } from "@/components/reactbits/SpecularButton";
import { DropdownIcons } from "@/components/shared/DropdownIcons";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export type TalentCardData = {
  id: string;
  slug: string;
  name: string;
  description: string;
  speciality: string;
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
  const shown = filtered.slice(0, visible);

  return (
    <section className="py-16 lg:py-24">
      <Container className="flex flex-col gap-10">
        {/* VENUES / CATEGORIES toggle */}
        <nav aria-label="Group talents by" className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
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
          {/* Mobile dropdown */}
          <div className="lg:hidden">
            <DropdownIcons
              options={[
                { value: "", label: "All" },
                ...items.map((it) => ({ value: it.id, label: it.name })),
              ]}
              value={selectedId ?? ""}
              onValueChange={(v) => select(v || null)}
            />
          </div>

          {/* Sidebar: All + venues or categories */}
          <aside className="hidden flex-col gap-3 self-start lg:sticky lg:top-24 lg:flex">
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
              <div
                key={`${mode}-${selectedId}`}
                className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2"
              >
                {shown.map((talent, i) => (
                  <div
                    key={talent.id}
                    className="animate-fade-up"
                    style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
                  >
                    <TalentCard talent={talent} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="w-full py-12 text-center font-inter">No talents found.</p>
            )}

            {filtered.length > visible && (
              <SpecularButton type="button" size="lg" radius={30} onClick={() => setVisible((v) => v + PAGE)}>
                Load More
              </SpecularButton>
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

/** Same card as a venue page's "Meet Our Talents": the photo at 4:5, head kept. */
function TalentCard({ talent }: { talent: TalentCardData }) {
  return (
    <div className="group flex h-full flex-col gap-4 border border-sf-border/40 bg-sf-surface/20 p-4">
      <Link
        href={`/talents/${talent.slug}`}
        className="relative aspect-[4/5] w-full overflow-hidden bg-sf-surface"
      >
        {talent.image ? (
          <Image
            src={talent.image}
            alt={talent.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
      </Link>
      <div className="flex flex-col gap-2">
        <Link href={`/talents/${talent.slug}`}>
          <h3 className="font-syne text-xl font-bold leading-tight text-white transition-colors group-hover:text-sf-accent">
            {talent.name}
          </h3>
        </Link>
        <p className="font-archivo text-xs uppercase tracking-[0.14em] text-white">{talent.speciality}</p>
        <p className="line-clamp-3 font-inter text-sm leading-relaxed">{talent.description}</p>
      </div>
    </div>
  );
}
