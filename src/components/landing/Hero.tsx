export function Hero() {
  return (
    <header className="relative min-h-[calc(100dvh-5rem)] flex flex-col lg:flex-row border-b-2 border-brand-black">
      <div className="w-full lg:w-[55%] flex flex-col justify-center px-4 sm:px-6 lg:px-12 py-16 lg:py-0 lg:border-r-2 border-brand-black z-10 bg-brand-bg">
        <div className="max-w-xl reveal-element" style={{ transitionDelay: "100ms" }}>
          <div className="inline-flex items-center border-2 border-brand-black bg-white px-3 py-1 mb-8 shadow-[4px_4px_0px_#111111]">
            <div className="w-2 h-2 bg-brand-orange mr-2 animate-pulse" />
            <span className="font-display font-bold text-[10px] uppercase tracking-widest">
              Swillfam Core v3.0 Live
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl uppercase tracking-tighter leading-[0.9] text-brand-black mb-6">
            Radical <br />
            <span className="text-brand-orange">Speed.</span>
            <br />
            Zero Lag.
          </h1>

          <p className="text-lg md:text-xl font-base text-brand-black/70 mb-10 border-l-4 border-brand-lime pl-4">
            The Point-of-Sale architecture designed strictly for high-volume environments.
            Dedicated servers, instant registers, and absolute data sovereignty.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#pricing"
              className="bg-brand-black text-white px-8 py-5 font-display font-bold text-sm uppercase tracking-widest text-center shadow-[6px_6px_0px_#C5F82A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_#C5F82A] transition-all"
              rel="nofollow"
            >
              View Packages
            </a>
            <a
              href="#infrastructure"
              className="bg-transparent text-brand-black border-2 border-brand-black px-8 py-5 font-display font-bold text-sm uppercase tracking-widest text-center hover:bg-brand-black hover:text-white transition-colors"
              rel="nofollow"
            >
              Explore Demo
            </a>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[45%] relative min-h-[50vh] lg:min-h-full border-t-2 lg:border-t-0 border-brand-black overflow-hidden bg-[#EAE5D9] group">
        <img
          src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1600&q=80"
          alt="High speed point of sale transaction in modern setting"
          className="absolute inset-0 w-full h-full object-cover contrast-[1.1] saturate-0 sepia-[20%] hue-rotate-[-20deg] mix-blend-multiply opacity-80 group-hover:scale-105 transition-transform duration-1000"
        />

        <div
          className="absolute bottom-8 right-8 bg-brand-bg border-2 border-brand-black animate-float p-4 shadow-[8px_8px_0px_0px_#111111] w-64 reveal-element"
          style={{ transitionDelay: "300ms" }}
        >
          <div className="flex justify-between items-center border-b-2 border-brand-black/20 pb-2 mb-3">
            <span className="font-display text-[10px] font-bold uppercase tracking-widest">
              Network Latency
            </span>
            <span className="font-display text-sm font-bold text-brand-lime bg-brand-black px-2 py-0.5">
              4ms
            </span>
          </div>
          <div className="space-y-2">
            <div className="w-full bg-brand-black/10 h-1.5">
              <div className="bg-brand-black w-[98%] h-full" />
            </div>
            <div className="text-[10px] font-bold text-brand-black/50 uppercase">Uptime 99.99%</div>
          </div>
        </div>
      </div>
    </header>
  );
}
