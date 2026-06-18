type Bullet = { icon: string; label: string };

type FeatureModuleProps = {
  number: string;
  icon: string;
  iconChipClassName: string;
  title: React.ReactNode;
  description: string;
  bullets: Bullet[];
  visual: React.ReactNode;
  visualBgClassName: string;
  reversed?: boolean;
  variant: "light" | "dark" | "lime";
};

export function FeatureModule({
  number,
  icon,
  iconChipClassName,
  title,
  description,
  bullets,
  visual,
  visualBgClassName,
  reversed,
  variant,
}: FeatureModuleProps) {
  const sectionBg =
    variant === "dark" ? "bg-brand-black text-white" : variant === "lime" ? "bg-brand-bg" : "bg-white";
  const moduleLabelColor = variant === "dark" ? "text-zinc-600" : "text-brand-black/40";
  const titleColor = variant === "dark" ? "text-white" : "text-brand-black";
  const descColor = variant === "dark" ? "text-zinc-400" : "text-brand-black/80";
  const bulletColor = variant === "dark" ? "text-white" : "text-brand-black";

  // The first DOM child always carries the divider border (bottom on mobile, right on desktop);
  // the second has none — matches the canvas regardless of whether text or visual comes first.
  const dividerBorder = "border-b-2 lg:border-b-0 lg:border-r-2 border-brand-black";

  const textBlock = (
    <div
      className={`lg:w-1/2 p-6 sm:p-10 md:p-16 flex flex-col justify-center reveal-element ${
        reversed ? "" : dividerBorder
      }`}
    >
      <div
        className={`w-16 h-16 border-2 border-brand-black flex items-center justify-center text-3xl mb-8 ${iconChipClassName}`}
      >
        <i className={icon} />
      </div>
      <div className={`font-display text-sm font-bold uppercase tracking-widest mb-2 ${moduleLabelColor}`}>
        Module {number}
      </div>
      <h2 className={`font-display text-3xl md:text-4xl uppercase tracking-tight mb-6 ${titleColor}`}>{title}</h2>
      <p className={`font-medium text-lg leading-relaxed mb-8 ${descColor}`}>{description}</p>
      <ul className={`space-y-4 font-semibold ${bulletColor}`}>
        {bullets.map((bullet) => (
          <li key={bullet.label} className="flex items-center gap-3">
            <i className={`${bullet.icon} text-xl`} />
            {bullet.label}
          </li>
        ))}
      </ul>
    </div>
  );

  const visualBlock = (
    <div
      className={`lg:w-1/2 relative p-6 md:p-12 reveal-element flex items-center justify-center ${
        reversed ? dividerBorder : ""
      } ${visualBgClassName}`}
      style={{ transitionDelay: "100ms" }}
    >
      {visual}
    </div>
  );

  return (
    <section className={`border-b-2 border-brand-black flex flex-col${reversed ? "-reverse" : ""} lg:flex-row ${sectionBg}`}>
      {reversed ? (
        <>
          {visualBlock}
          {textBlock}
        </>
      ) : (
        <>
          {textBlock}
          {visualBlock}
        </>
      )}
    </section>
  );
}
