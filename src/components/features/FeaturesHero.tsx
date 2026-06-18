export function FeaturesHero() {
  return (
    <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-16 border-b-2 border-brand-black bg-brand-bg relative">
      <div className="absolute right-0 top-0 w-1/3 h-full border-l-2 border-brand-black bg-brand-lime/10 pointer-events-none hidden lg:block">
        <div className="w-full h-full border-brand-black border-b-2 -translate-x-4 -translate-y-4" />
      </div>

      <div className="max-w-4xl relative z-10 reveal-element">
        <span className="inline-block bg-brand-black text-white font-display text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] px-4 py-2 mb-6 border-2 border-brand-black shadow-brutal">
          Core Module Payload
        </span>
        <h1 className="font-display text-4xl md:text-6xl uppercase tracking-tighter leading-none text-brand-black mb-6">
          Engineered for
          <br />
          <span className="text-brand-orange">Throughput.</span>
        </h1>
        <p className="text-brand-black/70 font-medium text-lg md:text-xl max-w-2xl leading-relaxed">
          We stripped away the bloat and rebuilt the POS experience around pure transaction speed,
          atomic inventory, and uncompromising data resilience.
        </p>
      </div>
    </section>
  );
}
