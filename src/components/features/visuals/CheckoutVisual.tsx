export function CheckoutVisual() {
  return (
    <>
      <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" aria-hidden />

      <div className="relative w-full aspect-square md:aspect-video lg:aspect-square max-w-md border-2 border-brand-black bg-white p-6 shadow-brutal-lg z-10 flex items-center justify-center overflow-hidden group">
        <div className="relative w-48 h-48 sm:w-64 sm:h-64 border-4 border-brand-black p-3 bg-white">
          <div className="absolute top-3 left-3 w-10 h-10 sm:w-14 sm:h-14 border-4 border-brand-black flex items-center justify-center">
            <div className="w-3 h-3 sm:w-5 sm:h-5 bg-brand-black" />
          </div>
          <div className="absolute top-3 right-3 w-10 h-10 sm:w-14 sm:h-14 border-4 border-brand-black flex items-center justify-center">
            <div className="w-3 h-3 sm:w-5 sm:h-5 bg-brand-black group-hover:bg-brand-orange transition-colors" />
          </div>
          <div className="absolute bottom-3 left-3 w-10 h-10 sm:w-14 sm:h-14 border-4 border-brand-black flex items-center justify-center">
            <div className="w-3 h-3 sm:w-5 sm:h-5 bg-brand-black" />
          </div>

          <div className="w-full h-full grid grid-cols-7 grid-rows-7 gap-1 sm:gap-2 pt-16 sm:pt-20 pb-16 pl-16 sm:pl-20 pr-1">
            <div className="bg-brand-black animate-[data-blink_1s_infinite]" />
            <div className="bg-brand-black col-span-2" />
            <div className="bg-brand-lime animate-[data-blink_1.5s_infinite]" />
            <div className="bg-brand-black row-span-2" />
            <div className="bg-brand-black" />
            <div className="bg-brand-orange animate-[data-blink_0.8s_infinite]" />
            <div className="bg-brand-black col-span-2" />
            <div className="border-2 border-brand-black" />
            <div className="bg-brand-black" />
            <div className="border-2 border-brand-black" />
            <div className="bg-brand-black col-span-3" />
            <div className="bg-brand-lime animate-[data-blink_2s_infinite]" />
            <div className="bg-brand-black" />
          </div>

          <div className="absolute left-0 w-full h-[2px] sm:h-1 bg-brand-orange shadow-[0_0_12px_#FF4911] animate-[scan_2s_ease-in-out_infinite] z-20" />
        </div>

        <div className="absolute top-6 right-6 bg-brand-lime text-brand-black font-display text-[10px] uppercase font-bold py-1 px-3 border border-brand-black shadow-brutal animate-bounce z-20">
          Tx: 14ms
        </div>
      </div>
    </>
  );
}
