import { cn } from "@/lib/utils";

/**
 * Page content column for the SwillFam public site.
 * Matches the Figma 1440 canvas with a ~25px gutter; pads down on mobile.
 */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1440px] px-5 lg:px-[25px]", className)}>
      {children}
    </div>
  );
}
