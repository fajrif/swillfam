export function Footer() {
  return (
    <footer className="bg-brand-black text-zinc-500 py-12 px-4 sm:px-6 lg:px-12 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-4">
          <span className="font-display text-sm tracking-widest uppercase text-white/80">
            Laci POS
          </span>
          <span className="text-xs uppercase tracking-widest font-bold font-display">
            &copy; {new Date().getFullYear()} Laci Systems Corp.
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs font-semibold uppercase tracking-widest">
          <a href="#" className="hover:text-white transition-colors" rel="nofollow">
            Terms & Conditions
          </a>
          <span className="w-1 h-1 bg-zinc-700 rounded-full" />
          <a href="#" className="hover:text-white transition-colors" rel="nofollow">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
