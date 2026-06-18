const TIERS = [
  {
    name: "Basic",
    price: "Rp.299K",
    description: "Single terminal operators requiring core logic.",
    cta: "Select Basic",
    features: ["1 Register Terminal", "Shared Cloud DB", "5,000 SKUs Max", "Email Support"],
    variant: "light" as const,
  },
  {
    name: "Plus",
    price: "Rp.499K",
    description: "Multi-terminal environments requiring deep analytics.",
    cta: "Scale With Plus",
    features: [
      "Up to 5 Terminals",
      "Advanced Macro Analytics",
      "Unlimited SKUs",
      "Priority 24/7 Intel",
    ],
    variant: "highlight" as const,
  },
  {
    name: "Business",
    price: "Rp.999K",
    description: "Total enterprise control with single-tenant isolation.",
    cta: "Request Instance",
    features: [
      "Unlimited Terminals",
      "Dedicated Server Instance",
      "Custom API Integrations",
      "SLA Guarantee (99.99%)",
    ],
    variant: "dark" as const,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-12 bg-white max-w-7xl mx-auto">
      <div className="text-center md:text-left mb-16 reveal-element">
        <h2 className="font-display text-3xl md:text-5xl uppercase tracking-tighter text-brand-black mb-4">
          Choose Your Vector.
        </h2>
        <p className="text-zinc-500 font-base">
          Clear, structured segments capable of pushing high volume.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-brand-black rounded-xl overflow-hidden reveal-element">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={
              tier.variant === "light"
                ? "p-8 md:p-10 v-line border-b-2 md:border-b-0 border-brand-black/10 bg-zinc-50 hover:bg-white transition-colors"
                : tier.variant === "highlight"
                  ? "p-8 md:p-10 bg-brand-lime border-b-2 md:border-b-0 border-brand-black/10 relative shadow-[0_0_40px_rgba(197,248,42,0.3)] z-10 md:-mx-1 md:my-0 scale-[1.02]"
                  : "p-8 md:p-10 bg-brand-black text-white rounded-r-xl"
            }
          >
            {tier.variant === "highlight" && (
              <div className="absolute top-0 right-0 bg-brand-black text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl">
                Popular Vector
              </div>
            )}

            <h3
              className={
                "font-display text-xl uppercase tracking-tight mb-2 " +
                (tier.variant === "dark" ? "text-white" : "text-brand-black")
              }
            >
              {tier.name}
            </h3>
            <div className="mb-6">
              <span className="text-4xl font-display font-base">{tier.price}</span>
              <span
                className={
                  "font-bold uppercase text-xs tracking-widest ml-1 " +
                  (tier.variant === "highlight"
                    ? "text-zinc-700"
                    : tier.variant === "dark"
                      ? "text-zinc-500"
                      : "text-zinc-500")
                }
              >
                /mo
              </span>
            </div>
            <p
              className={
                "text-sm font-base mb-8 h-10 " +
                (tier.variant === "highlight"
                  ? "text-zinc-700"
                  : tier.variant === "dark"
                    ? "text-zinc-400"
                    : "text-zinc-500")
              }
            >
              {tier.description}
            </p>

            <button
              className={
                tier.variant === "light"
                  ? "w-full h-12 border-2 border-brand-black text-brand-black font-bold uppercase text-xs tracking-widest mb-8 hover:bg-brand-black hover:text-white transition-colors"
                  : tier.variant === "highlight"
                    ? "w-full h-12 bg-brand-black text-white font-bold uppercase text-xs tracking-widest mb-8 hover:scale-[0.98] transition-transform shadow-[4px_4px_0_0_#FF4911]"
                    : "w-full h-12 border-2 border-zinc-700 hover:border-brand-orange text-white font-bold uppercase text-xs tracking-widest mb-8 hover:bg-brand-orange hover:text-brand-black transition-colors"
              }
            >
              {tier.cta}
            </button>

            <ul
              className={
                "space-y-3 text-sm font-base " +
                (tier.variant === "dark"
                  ? "text-zinc-300"
                  : tier.variant === "highlight"
                    ? "text-brand-black"
                    : "text-zinc-700")
              }
            >
              {tier.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <i
                    className={
                      "ph-bold ph-check " + (tier.variant === "dark" ? "text-brand-orange" : "text-brand-black")
                    }
                  />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
