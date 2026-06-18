export function Features() {
  return (
    <section
      id="why-laci"
      className="py-24 px-4 sm:px-6 lg:px-12 section-border relative z-10 max-w-7xl mx-auto"
    >
      <div className="mb-16 md:flex justify-between items-end reveal-element">
        <div>
          <h2 className="font-display text-3xl md:text-5xl uppercase tracking-tighter text-brand-black mb-4">
            Functional &<br />
            Unforgiving.
          </h2>
          <p className="text-zinc-500 font-base max-w-sm">
            We stripped away the bloat. Laci POS focuses entirely on raw transaction speed,
            inventory logic, and absolute uptime.
          </p>
        </div>
        <div className="hidden md:block">
          <i className="ph-fill ph-target text-6xl text-brand-orange opacity-40" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:auto-rows-[300px]">
        <div
          className="md:col-span-2 bg-white rounded-xl border border-brand-black/10 p-8 flex flex-col justify-between shadow-premium group reveal-element relative overflow-hidden"
          style={{ transitionDelay: "100ms" }}
        >
          <div className="absolute -right-12 -top-12 opacity-5 scale-150 group-hover:scale-[2] transition-transform duration-700">
            <i className="ph-bold ph-projector-screen text-[200px] text-brand-black" />
          </div>
          <div className="w-12 h-12 bg-brand-lime text-brand-black rounded flex items-center justify-center mb-12">
            <i className="ph-bold ph-rocket text-2xl" />
          </div>
          <div className="relative z-10">
            <h3 className="font-display text-xl uppercase tracking-tight text-brand-black mb-2">
              Zero-Latency Register
            </h3>
            <p className="text-zinc-500 font-base max-w-md">
              Ring customers instantly. No loading spinners, no web-request bottlenecks. Pre-cached
              catalogs mean it processes as fast as you can tap.
            </p>
          </div>
        </div>

        <div
          className="bg-brand-black rounded-xl p-8 flex flex-col justify-between shadow-premium reveal-element group"
          style={{ transitionDelay: "200ms" }}
        >
          <div className="w-12 h-12 bg-zinc-800 text-brand-orange rounded flex items-center justify-center mb-12 transition-transform group-hover:-rotate-12 duration-300">
            <i className="ph-bold ph-stack text-2xl" />
          </div>
          <div>
            <h3 className="font-display text-xl uppercase tracking-tight text-white mb-2">
              Atomic Inventory
            </h3>
            <p className="text-zinc-400 font-base text-sm">
              Every sale automatically updates massive catalogs without database locking. Highly
              granular stock levels, globally synced.
            </p>
          </div>
        </div>

        <div
          className="bg-brand-orange rounded-xl p-8 flex flex-col justify-between shadow-premium reveal-element relative overflow-hidden group"
          style={{ transitionDelay: "300ms" }}
        >
          <div className="absolute top-4 right-4 flex gap-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
            <span className="w-2 h-2 bg-white rounded-full" />
            <span className="w-2 h-2 bg-white/50 rounded-full" />
          </div>

          <div className="w-12 h-12 bg-black/20 text-white rounded flex items-center justify-center mb-12">
            <i className="ph-bold ph-wifi-slash text-2xl" />
          </div>
          <div>
            <h3 className="font-display text-xl uppercase tracking-tight text-white mb-2">
              Offline Resilience
            </h3>
            <p className="text-white/80 font-base text-sm">
              Internet down? Laci stores transactions aggressively on local memory and syncs back
              when uplink drops back in.
            </p>
          </div>
        </div>

        <div
          className="md:col-span-2 bg-white rounded-xl border border-brand-black/10 p-8 flex flex-col justify-between shadow-premium group reveal-element relative overflow-hidden"
          style={{ transitionDelay: "400ms" }}
        >
          <div className="w-12 h-12 bg-zinc-100 border border-zinc-200 text-brand-black rounded flex items-center justify-center mb-12">
            <i className="ph-bold ph-trend-up text-xl" />
          </div>

          <div className="absolute right-0 bottom-0 p-8 w-1/2 flex items-end justify-end gap-2 opacity-20 pointer-events-none">
            <div className="w-8 bg-brand-black h-12 rounded-t-sm group-hover:h-16 transition-all duration-500" />
            <div className="w-8 bg-brand-black h-24 rounded-t-sm group-hover:h-32 transition-all duration-500 delay-75" />
            <div className="w-8 bg-brand-lime h-32 rounded-t-sm group-hover:h-48 transition-all duration-500 delay-100" />
            <div className="w-8 bg-brand-black h-20 rounded-t-sm group-hover:h-24 transition-all duration-500 delay-150" />
          </div>

          <div className="relative z-10">
            <h3 className="font-display text-xl uppercase tracking-tight text-brand-black mb-2">
              Macro-Level Analytics
            </h3>
            <p className="text-zinc-500 font-base max-w-sm">
              Aggregated metrics, shift analysis, and real-time dashboarding. Generate CSVs instantly
              to interface with existing accounting software.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
