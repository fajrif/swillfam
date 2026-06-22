import Link from "next/link";

type NavbarProps = {
  active?: "features" | "contact";
};

export function Navbar({ active }: NavbarProps = {}) {
  return (
    <nav
      id="navbar"
      className="fixed top-0 w-full z-50 bg-brand-bg flex items-center justify-between border-b-2 border-brand-black h-20 px-4 sm:px-6 lg:px-12 transition-transform duration-300"
    >
      <Link href="/" className="h-10 flex items-center flex-shrink-0">
        <span className="font-display text-xl tracking-widest uppercase text-brand-black">SWILLFAM</span>
      </Link>

      <div className="hidden lg:flex items-center gap-8 font-display text-xs font-bold uppercase tracking-widest">
        <Link
          href="/features"
          className={
            active === "features"
              ? "text-brand-orange border-b-2 border-brand-orange pb-1"
              : "hover:text-brand-orange transition-colors"
          }
        >
          Features
        </Link>
        <Link href="/#infrastructure" className="hover:text-brand-orange transition-colors">
          Infrastructure
        </Link>
        <Link href="/#pricing" className="hover:text-brand-orange transition-colors">
          Pricing
        </Link>
        <Link
          href="/contact"
          className={
            active === "contact"
              ? "text-brand-orange border-b-2 border-brand-orange pb-1"
              : "hover:text-brand-orange transition-colors"
          }
        >
          Contact
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/#pricing"
          className="bg-brand-lime text-brand-black border-2 border-brand-black font-display font-bold text-xs uppercase tracking-widest px-3 md:px-6 py-3 shadow-[4px_4px_0px_#111111] hover:shadow-[2px_2px_0px_#111111] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          Get Demo
        </Link>
      </div>
    </nav>
  );
}
