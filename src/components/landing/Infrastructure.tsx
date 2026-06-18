export function Infrastructure() {
  return (
    <section
      id="infrastructure"
      className="border-y-2 border-brand-black bg-brand-black text-white relative overflow-hidden section-border"
    >
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=2000&q=80"
          alt="Server infrastructure"
          className="w-full h-full object-cover opacity-20 mix-blend-luminosity grayscale"
        />
        <div className="absolute inset-0 bg-brand-black/80" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-24 relative z-10 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 reveal-element">
          <span className="inline-block border-2 border-brand-lime text-brand-lime px-3 py-1 font-display text-[10px] font-bold uppercase tracking-widest mb-6 shadow-[2px_2px_0px_#C5F82A]">
            Infrastructure
          </span>
          <h2 className="font-display text-4xl md:text-5xl uppercase tracking-tighter mb-8 leading-[0.9]">
            Dedicated.
            <br />
            Isolated.
            <br />
            <span className="text-brand-orange">Uncompromised.</span>
          </h2>
          <p className="text-zinc-300 font-base text-lg max-w-md mb-8 leading-relaxed">
            We don&apos;t pool your database with a thousand other coffee shops. The Laci Business
            tier spins up a single-tenant instance guaranteeing compute power during peak Friday
            rushes.
          </p>
          <div className="grid grid-cols-2 gap-6 border-l-2 border-brand-lime pl-6">
            <div>
              <div className="font-display text-2xl font-bold text-white mb-1">99.99%</div>
              <div className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Uptime SLA</div>
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-white mb-1">15m</div>
              <div className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Rolling Backups</div>
            </div>
          </div>
        </div>

        <div
          className="flex-1 w-full max-w-lg lg:ml-auto reveal-element"
          style={{ transitionDelay: "200ms" }}
        >
          <div className="border-2 border-zinc-700 bg-[#0A0A0A] shadow-[8px_8px_0px_rgba(197,248,42,0.2)] flex flex-col h-80">
            <div className="border-b-2 border-zinc-700 p-3 flex gap-2 items-center bg-zinc-900">
              <div className="w-3 h-3 bg-red-500 border border-zinc-900 rounded-full" />
              <div className="w-3 h-3 bg-yellow-500 border border-zinc-900 rounded-full" />
              <div className="w-3 h-3 bg-brand-lime border border-zinc-900 rounded-full" />
              <span className="ml-auto font-mono text-[10px] text-zinc-500">root@laci-instance-091</span>
            </div>
            <div className="p-4 font-mono text-xs sm:text-sm text-brand-lime leading-loose overflow-hidden">
              <p className="text-zinc-500 mb-2">Connecting to Laci Mainframe...</p>
              {`> RUN deployment_protocol.sh
> ALLOCATING DEDICATED CPU CORES... `}
              <span className="text-white">[OK]</span>
              {`
> MOUNTING NVME STORAGE... `}
              <span className="text-white">[OK]</span>
              {`
> SYNCING SSL DOMAINS... `}
              <span className="text-white">[OK]</span>
              {`
> WARMING CACHE REGISTERS... `}
              <span className="text-white">[OK]</span>
              <br />
              <br />
              {`> STATUS: `}
              <span className="bg-brand-lime text-brand-black px-1 font-bold">
                SYSTEM ONLINE. READY FOR TRAFFIC.
              </span>
              <span className="block mt-2 text-white animate-pulse">_</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
