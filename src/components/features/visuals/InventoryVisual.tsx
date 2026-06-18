export function InventoryVisual() {
  return (
    <>
      <div
        className="absolute inset-0 opacity-50 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at center, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
        aria-hidden
      />

      <div className="relative w-full aspect-square md:aspect-video lg:aspect-square max-w-md border-2 border-brand-lime p-2 z-10 group bg-zinc-950">
        <img
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80"
          alt="Organized warehouse inventory tracking"
          className="w-full h-full object-cover opacity-60 mix-blend-luminosity group-hover:opacity-100 transition-opacity duration-500"
        />

        <div className="absolute bottom-6 left-6 right-6 bg-brand-black/90 backdrop-blur-sm border border-brand-lime/30 p-4 flex justify-between items-center z-20">
          <div className="font-mono text-brand-lime text-xs">
            <div className="mb-1">SKU_8492_V2</div>
            <div className="text-white">QUANTITY: 4,192 UNITS</div>
          </div>
          <div className="w-8 h-8 rounded-full border border-brand-lime flex items-center justify-center animate-pulse">
            <div className="w-2 h-2 bg-brand-lime rounded-full" />
          </div>
        </div>
      </div>
    </>
  );
}
