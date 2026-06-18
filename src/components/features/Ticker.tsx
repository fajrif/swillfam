const TICKER_TEXT = "SYSTEM ARCHITECTURE // MODULE SPECIFICATIONS // KINETIC THROUGHPUT // ";

export function Ticker() {
  return (
    <div className="border-b-2 border-brand-black bg-brand-black text-brand-lime py-3 overflow-hidden flex whitespace-nowrap">
      <div className="animate-marquee font-display text-xs uppercase tracking-[0.3em] font-bold">
        {TICKER_TEXT.repeat(3)}
      </div>
    </div>
  );
}
