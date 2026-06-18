export function Navbar() {
  return (
    <nav
      id="navbar"
      className="fixed top-0 w-full z-50 glass-refraction border-b-2 border-brand-black/10 transition-transform duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-20 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 group flex-shrink-0" rel="nofollow">
          <span className="font-display text-sm tracking-widest uppercase text-brand-black group-hover:scale-105 transition-transform duration-300">
            Laci POS
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm font-bold tracking-widest uppercase">
          <a href="#why-laci" className="text-zinc-500 hover:text-brand-black transition-colors" rel="nofollow">
            Features
          </a>
          <a href="#infrastructure" className="text-zinc-500 hover:text-brand-black transition-colors" rel="nofollow">
            Infrastructure
          </a>
          <a href="#pricing" className="text-zinc-500 hover:text-brand-black transition-colors" rel="nofollow">
            Segments
          </a>
        </div>

        <div className="flex items-center gap-4">
          <a href="#" className="hidden md:flex text-sm font-bold uppercase tracking-widest hover-underline pb-1" rel="nofollow">
            Client Login
          </a>
          <a
            href="#pricing"
            className="h-10 px-6 flex items-center justify-center rounded-sm bg-brand-black text-white font-bold text-xs uppercase tracking-widest hover:bg-brand-orange hover:scale-[0.98] transition-all"
            rel="nofollow"
          >
            Deploy Now
          </a>
        </div>
      </div>
    </nav>
  );
}
