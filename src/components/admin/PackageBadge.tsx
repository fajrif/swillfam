import type { Package } from "@/generated/prisma/client";

const LABELS: Record<Package, string> = {
  BASIC: "Basic",
  PLUS: "Plus",
  BUSINESS: "Business",
};

export function PackageBadge({ value }: { value: Package | null }) {
  if (!value) return <span className="text-zinc-400 text-sm">—</span>;
  return (
    <span className="inline-flex items-center rounded-full bg-zinc-100 text-zinc-700 text-xs font-medium px-2.5 py-1">
      {LABELS[value]}
    </span>
  );
}
