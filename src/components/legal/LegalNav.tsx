import Link from "next/link";

export function LegalNav() {
  return (
    <nav className="fixed top-1 w-full z-40 bg-brand-bg/90 backdrop-blur-md border-b-2 border-brand-black">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-4 sm:px-6 lg:px-12">
        <Link href="/" className="h-6 flex items-center group">
          <span className="font-display text-lg tracking-widest uppercase text-brand-black group-hover:-rotate-2 transition-transform">
            SWILLFAM
          </span>
        </Link>

        <Link
          href="/"
          className="font-display text-xs font-bold uppercase tracking-widest hover:text-brand-orange transition-colors"
        >
          Return Home
        </Link>
      </div>
    </nav>
  );
}
