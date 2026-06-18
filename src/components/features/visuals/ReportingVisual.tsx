const BARS: { height: string; value: string; color: string; delay: string }[] = [
  { height: "40%", value: "80k", color: "bg-zinc-700 hover:bg-brand-lime", delay: "0ms" },
  { height: "65%", value: "125k", color: "bg-brand-orange hover:bg-brand-lime", delay: "100ms" },
  { height: "35%", value: "65k", color: "bg-zinc-700 hover:bg-brand-orange", delay: "200ms" },
  { height: "85%", value: "180k", color: "bg-brand-lime hover:bg-brand-orange", delay: "300ms" },
  { height: "100%", value: "210k", color: "bg-white hover:bg-brand-lime", delay: "400ms" },
];

export function ReportingVisual() {
  return (
    <>
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" aria-hidden />

      <div className="relative w-full aspect-square md:aspect-video lg:aspect-square max-w-md border-2 border-brand-black bg-zinc-950 p-6 sm:p-10 shadow-[8px_8px_0px_#FF4911] z-10 group overflow-hidden flex flex-col justify-end">
        <div className="absolute inset-0 grid grid-rows-5 opacity-20 pointer-events-none" aria-hidden>
          <div className="border-b border-white" />
          <div className="border-b border-white" />
          <div className="border-b border-white" />
          <div className="border-b border-white" />
          <div className="border-b border-white" />
        </div>

        <div className="relative z-20 flex items-end gap-3 sm:gap-6 h-[80%] w-full">
          {BARS.map((bar) => (
            <div
              key={bar.value}
              className={`relative w-full border-2 border-brand-black origin-bottom transition-colors ${bar.color}`}
              style={{
                height: bar.height,
                animation: `bar-grow 1s cubic-bezier(0.16,1,0.3,1) ${bar.delay} forwards`,
              }}
            >
              <div
                className="absolute -top-6 left-1/2 text-[10px] bg-brand-black px-1 border border-brand-black font-mono text-white opacity-0"
                style={{ animation: `fade-in-label 0.5s ease-out ${bar.delay} forwards` }}
              >
                {bar.value}
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-lime z-20" />

        <div className="absolute top-6 right-6 bg-brand-black text-brand-lime font-display text-[10px] uppercase font-bold py-2 px-3 border border-brand-lime shadow-brutal z-30">
          Volume: High
        </div>
      </div>
    </>
  );
}
