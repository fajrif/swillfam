import { cn } from "@/lib/utils";

/**
 * Section heading for the SwillFam home page.
 * Title = Syne ~64px (Figma section titles); optional lead = Inter ~24px.
 */
export function SectionHeading({
  title,
  lead,
  align = "left",
  className,
  titleClassName,
}: {
  title: string;
  lead?: string;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <h2
        className={cn(
          "font-syne text-[clamp(2.25rem,5vw,4rem)] leading-[1.05] text-sf-text",
          titleClassName,
        )}
      >
        {title}
      </h2>
      {lead ? (
        <p
          className={cn(
            "max-w-[640px] font-inter text-base leading-relaxed text-white md:text-lg",
            align === "center" && "mx-auto",
          )}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}
