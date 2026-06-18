import Link from "next/link";

export function FeaturesCta() {
  return (
    <section className="border-t-2 border-brand-black bg-brand-orange text-brand-black py-24 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
      <div className="absolute -right-20 -bottom-20 text-[300px] opacity-10 pointer-events-none rotate-12" aria-hidden>
        <i className="ph-fill ph-asterisk-simple" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10 reveal-element">
        <h2 className="font-display text-3xl md:text-6xl uppercase tracking-tighter mb-8 font-bold text-white">
          Ready to Upgrade
          <br />
          Your Counter?
        </h2>
        <p className="text-white/90 text-xl max-w-2xl mx-auto mb-12 font-medium">
          Stop compromising on speed. Deploy the terminal architecture built for absolute
          high-volume reliability.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link
            href="/#pricing"
            className="w-full sm:w-auto brutal-card bg-brand-lime text-brand-black border-2 border-brand-black font-display font-bold text-sm uppercase tracking-widest px-8 md:px-12 py-5 shadow-brutal flex items-center justify-center gap-3"
          >
            Review Tiers <i className="ph-bold ph-arrow-right text-lg" />
          </Link>
          <a
            href="#"
            className="w-full sm:w-auto font-display font-bold text-sm text-white uppercase tracking-widest hover:text-brand-black transition-colors py-4 flex items-center justify-center"
            rel="nofollow"
          >
            Read Documentation
          </a>
        </div>
      </div>
    </section>
  );
}
