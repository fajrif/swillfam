"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type DropdownIconOption = {
  value: string;
  label: string;
  /** Rendered in a fixed-size, unrounded image box (e.g. a venue logo). */
  image?: string | null;
  /** Alternative to `image` for icon-based options — an already-sized ReactNode. */
  icon?: ReactNode;
};

/**
 * Single-select dropdown whose trigger and options each show an image or icon
 * next to their label — e.g. a venue picker driven by `venue.logo` +
 * `venue.name`. Built on shadcn's `dropdown-menu` primitive. Selection state is
 * shown purely through text colour (white = selected/hover, white/70 =
 * unselected) rather than a checkmark/dot indicator.
 */
export function DropdownIcons({
  options,
  value,
  onValueChange,
  className,
}: {
  options: DropdownIconOption[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}) {
  const selected = options.find((option) => option.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full cursor-pointer items-center justify-between gap-3 border border-sf-border/60 bg-sf-surface px-5 py-3 font-inter text-base text-white transition-colors hover:bg-white/10",
            className,
          )}
        >
          <span className="flex min-w-0 items-center gap-3">
            {selected && <OptionMedia option={selected} />}
            <span className="truncate font-semibold">{selected?.label ?? "Select"}</span>
          </span>
          <ChevronDown className="size-5 shrink-0 opacity-70" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="min-w-0 w-(--radix-dropdown-menu-trigger-width) rounded-none border border-sf-border/60 bg-sf-surface p-1 text-white"
      >
        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            <DropdownMenuItem
              key={option.value}
              onSelect={() => onValueChange(option.value)}
              className={cn(
                "cursor-pointer gap-3 rounded-none py-2.5 font-inter text-base transition-colors focus:bg-white/10",
                isSelected ? "text-white" : "text-white/70 focus:text-white",
              )}
            >
              <OptionMedia option={option} />
              <span className={cn("truncate", isSelected && "font-semibold")}>{option.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function OptionMedia({ option }: { option: DropdownIconOption }) {
  if (option.image) {
    return (
      <span className="relative size-7 shrink-0">
        <Image src={option.image} alt="" fill sizes="28px" className="object-contain" />
      </span>
    );
  }
  if (option.icon) return <>{option.icon}</>;
  return null;
}
