export function ContactHero() {
  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-16 border-b-2 border-brand-black bg-brand-bg relative">
      <div className="absolute right-0 top-0 w-1/4 h-full border-l-2 border-brand-black bg-brand-lime/10 pointer-events-none hidden lg:block">
        <div className="w-full h-full border-brand-black border-b-2 -translate-x-4 -translate-y-4" />
      </div>

      <div className="max-w-3xl relative z-10 reveal-element">
        <span className="inline-block bg-brand-black text-white font-display text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 mb-4 border-2 border-brand-black shadow-brutal">
          Get In Touch
        </span>
        <h1 className="font-display text-3xl md:text-4xl lg:text-5xl uppercase tracking-tighter leading-none text-brand-black mb-4">
          Let&apos;s Talk
          <br />
          <span className="text-brand-orange">Throughput.</span>
        </h1>
        <p className="text-brand-black/70 font-medium text-base md:text-lg max-w-xl leading-relaxed">
          Tell us about your business and we&apos;ll help you find the right package — usually
          within one business day.
        </p>
      </div>
    </section>
  );
}
