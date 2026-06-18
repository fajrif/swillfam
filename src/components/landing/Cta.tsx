export function Cta() {
  return (
    <section className="py-24 bg-brand-bg relative overflow-hidden border-t-2 border-brand-black/10">
      <div className="max-w-4xl mx-auto px-4 text-center reveal-element">
        <h2 className="font-display text-4xl sm:text-6xl uppercase tracking-tighter text-brand-black mb-6">
          Stop Waiting.
          <br />
          Start Ringing.
        </h2>
        <div className="h-1 w-20 bg-brand-orange mx-auto mb-8" />
        <p className="text-zinc-600 font-medium text-lg mb-10 max-w-lg mx-auto">
          Transform your retail checkout or bistro counter into a high-throughput engine within
          minutes. No proprietary hardware required.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <a
            href="#pricing"
            className="w-full sm:w-auto h-16 px-10 flex items-center justify-center rounded bg-brand-black text-white font-bold text-sm uppercase tracking-[0.2em] hover:bg-brand-lime hover:text-brand-black transition-colors focus:ring-4 focus:ring-brand-lime/50 ring-offset-2 ring-offset-brand-bg"
            rel="nofollow"
          >
            Initiate Setup System
          </a>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-black/20 to-transparent" />
    </section>
  );
}
