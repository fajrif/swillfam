export function Infrastructure() {
  return (
    <section
      id="infrastructure"
      className="bg-brand-black py-24 relative overflow-hidden text-white section-border"
    >
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle at center, #888 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10 flex flex-col md:flex-row gap-16 items-center">
        <div className="flex-1 reveal-element">
          <div className="font-bold text-brand-lime text-xs uppercase tracking-[0.2em] mb-4">
            Architecture Layer
          </div>
          <h2 className="font-display text-3xl md:text-5xl uppercase tracking-tight mb-6 text-white/90">
            Dedicated Servers.
            <br />
            No Shared Lag.
          </h2>
          <p className="text-zinc-400 font-medium mb-8 leading-relaxed max-w-md">
            Unlike conventional POS systems pooling your database with thousands of other clients,
            Laci Business and Enterprise tiers spin up a{" "}
            <strong className="text-white">single-tenant dedicated server</strong> instance
            specifically for your operations.
          </p>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <i className="ph-bold ph-check text-brand-lime" />
              <span className="font-medium text-sm">Absolute data isolation and sovereignty</span>
            </li>
            <li className="flex items-center gap-3">
              <i className="ph-bold ph-check text-brand-lime" />
              <span className="font-medium text-sm">Guaranteed compute power during peak hours</span>
            </li>
            <li className="flex items-center gap-3">
              <i className="ph-bold ph-check text-brand-lime" />
              <span className="font-medium text-sm">Automated 15-minute rolling backups</span>
            </li>
          </ul>
        </div>

        <div className="flex-1 w-full max-w-md mx-auto md:ml-auto border border-zinc-800 bg-zinc-950 p-6 rounded-lg reveal-element shadow-2xl relative">
          <div className="flex gap-2 mb-4 pb-4 border-b border-zinc-800">
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <div className="w-3 h-3 rounded-full bg-brand-lime" />
          </div>
          <div className="font-mono text-xs sm:text-sm text-brand-lime leading-loose whitespace-pre overflow-hidden">
            {`> INITIALIZING LACI INSTANCE...
> ALLOCATING DEDICATED CPU... [OK]
> MOUNTING VOLUME (2TB NVMe)... [OK]
> ESTABLISHING SECURE TUNNEL... [OK]
> STATUS: `}
            <span className="text-white font-bold">ONLINE (1ms latency)</span>
            <span className="block mt-4 text-zinc-500 animate-pulse">_ blinking cursor</span>
          </div>
        </div>
      </div>
    </section>
  );
}
