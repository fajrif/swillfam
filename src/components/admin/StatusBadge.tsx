import { Badge } from "@/components/ui/badge";

const STYLES: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700 border-transparent",
  CONTACTED: "bg-amber-100 text-amber-700 border-transparent",
  CLOSED: "bg-zinc-100 text-zinc-600 border-transparent",
};

const LABELS: Record<string, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  CLOSED: "Closed",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={STYLES[status] ?? ""}>
      {LABELS[status] ?? status}
    </Badge>
  );
}
