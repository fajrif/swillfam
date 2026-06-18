export function Hero() {
  return (
    <section className="relative min-h-[90dvh] flex flex-col md:flex-row border-b-2 border-brand-black/10 section-border pt-12 md:pt-0">
      <div className="flex-1 px-4 sm:px-6 lg:px-12 flex flex-col justify-center relative z-10 py-16 md:py-0">
        <div className="reveal-element" style={{ transitionDelay: "100ms" }}>
          <div className="inline-flex items-center gap-2 bg-brand-black text-brand-lime px-3 py-1.5 rounded-sm mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-lime animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
              Operating System v2.4 Live
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.1] uppercase text-brand-black mb-6 max-w-2xl">
            Velocity <i className="ph-bold ph-lightning text-brand-orange inline-block align-middle -translate-y-1" />
            <br />
            At The
            <br />
            Checkout.
          </h1>

          <p className="text-zinc-600 font-medium text-lg max-w-md mb-10 leading-relaxed border-l-2 border-brand-orange pl-4">
            The highest-performance operational terminal built for scale. Stop wrestling with clunky
            registers. Systematize transactions instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a
              href="#pricing"
              className="w-full sm:w-auto h-14 px-8 flex items-center justify-center rounded-sm bg-brand-lime text-brand-black font-bold text-sm uppercase tracking-widest shadow-[4px_4px_0_0_#111111] border-2 border-brand-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
              rel="nofollow"
            >
              Review Segments <i className="ph-bold ph-arrow-right ml-2 text-lg" />
            </a>
            <a
              href="#"
              className="w-full sm:w-auto h-14 px-8 flex items-center justify-center font-bold text-sm text-brand-black uppercase tracking-widest hover-underline"
              rel="nofollow"
            >
              Watch Demo
            </a>
          </div>
        </div>
      </div>

      <div className="flex-1 relative border-t-2 md:border-t-0 md:border-l-2 border-brand-black/10 overflow-hidden bg-zinc-200">
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div
            className="glass-refraction rounded-xl p-6 w-full max-w-sm shadow-2xl animate-float relative z-20 reveal-element"
            style={{ transitionDelay: "300ms" }}
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-200">
              <div>
                <h3 className="font-display text-sm uppercase text-brand-black tracking-wider">
                  Live Register
                </h3>
                <p className="text-xs font-semibold text-zinc-500">Terminal 01</p>
              </div>
              <div className="bg-brand-black text-white px-2 py-1 rounded text-[10px] uppercase font-bold tracking-widest">
                Processing
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-brand-black">2x Nasi Goreng Spesial</span>
                <span>Rp 48.000</span>
              </div>
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-brand-black">1x Es Teh Manis</span>
                <span>Rp 8.000</span>
              </div>
            </div>

            <div className="bg-zinc-100 rounded p-4 flex justify-between items-end border border-zinc-200">
              <span className="text-xs uppercase font-bold text-zinc-400 tracking-widest">Total</span>
              <span className="font-display text-2xl text-brand-black">Rp 56.000</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 right-0 w-32 h-32 bg-brand-orange mix-blend-screen blur-3xl opacity-50" />
      </div>
    </section>
  );
}
