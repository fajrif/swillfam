const STYLES: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700",
  CONTACTED: "bg-amber-100 text-amber-700",
  CLOSED: "bg-zinc-100 text-zinc-600",
  ACTIVE: "bg-green-100 text-green-700",
  DUE_SOON: "bg-amber-100 text-amber-700",
  EXPIRED: "bg-red-100 text-red-700",
  CANCELLED: "bg-zinc-100 text-zinc-600",
};

const LABELS: Record<string, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  CLOSED: "Closed",
  ACTIVE: "Active",
  DUE_SOON: "Due Soon",
  EXPIRED: "Expired",
  CANCELLED: "Cancelled",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full text-xs font-medium px-2.5 py-1 ${STYLES[status] ?? "bg-zinc-100 text-zinc-600"}`}
    >
      {LABELS[status] ?? status}
    </span>
  );
}
