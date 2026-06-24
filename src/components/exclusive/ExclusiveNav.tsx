"use client";

import { cn } from "@/lib/utils";

const TABS = ["GALLERY", "VIDEOS", "EDITORIAL"] as const;

export type ExclusiveTab = (typeof TABS)[number];

/** GALLERY / VIDEOS / EDITORIAL tab switcher. */
export function ExclusiveNav({
  active,
  onChange,
}: {
  active: ExclusiveTab;
  onChange: (tab: ExclusiveTab) => void;
}) {
  return (
    <nav className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
      {TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={cn(
            "font-syne text-[clamp(2rem,6vw,64px)] font-bold uppercase leading-none tracking-tight transition-colors",
            active === tab ? "text-white" : "text-white/40 hover:text-white",
          )}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}
