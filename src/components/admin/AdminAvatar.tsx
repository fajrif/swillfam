import { cn } from "@/lib/utils";

/** Round admin-user avatar; falls back to the user's initials when no image is set. */
export function AdminAvatar({
  src,
  name,
  className,
}: {
  src?: string | null;
  name: string;
  className?: string;
}) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={name} className={cn("size-9 shrink-0 rounded-full object-cover bg-zinc-100", className)} />;
  }

  return (
    <div
      aria-hidden
      className={cn(
        "size-9 shrink-0 rounded-full bg-zinc-200 text-zinc-700 text-xs font-semibold flex items-center justify-center",
        className,
      )}
    >
      {initials || "?"}
    </div>
  );
}
