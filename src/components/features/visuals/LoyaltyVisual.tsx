export function LoyaltyVisual() {
  return (
    <>
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 11px, rgba(17,17,17,0.6) 11px, rgba(17,17,17,0.6) 12px)",
        }}
        aria-hidden
      />

      <div className="relative w-full aspect-square md:aspect-video lg:aspect-square max-w-md border-2 border-brand-black bg-white shadow-brutal-lg z-10 group overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1000&q=80"
          alt="Barista engaging with customer for loyalty program"
          className="w-full h-full object-cover filter grayscale contrast-125 mix-blend-multiply group-hover:scale-110 group-hover:grayscale-0 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-brand-lime mix-blend-color opacity-30 group-hover:opacity-0 transition-opacity duration-700" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5">
          <div className="bg-brand-black text-white p-4 border-2 border-brand-black shadow-brutal rotate-[-4deg] group-hover:rotate-0 transition-transform duration-500 z-30 relative">
            <div className="flex justify-between items-center mb-2">
              <span className="font-display text-xs uppercase text-brand-lime">Elite Member</span>
              <i className="ph-fill ph-check-circle text-brand-lime text-xl" />
            </div>
            <div className="font-display text-xl uppercase tracking-tighter">VIP-783-XX</div>
          </div>
        </div>
      </div>
    </>
  );
}
