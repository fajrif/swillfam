const CLIENTS = [
  "Kedai Senja",
  "Toko Berkah",
  "Kopi Pagi",
  "Boutique 42",
  "Mini Mart Jaya",
  "Roti & Kue Bunda",
];

function MarqueeRow() {
  return (
    <span className="text-zinc-500 font-display text-xl uppercase tracking-widest mx-4 flex items-center gap-8">
      {CLIENTS.map((name, i) => (
        <span key={i} className="flex items-center gap-8">
          {name}
          <span className={i % 2 === 0 ? "text-brand-lime" : "text-brand-orange"}>●</span>
        </span>
      ))}
    </span>
  );
}

export function ClientsMarquee() {
  return (
    <section className="py-6 bg-brand-black border-y-2 border-brand-black overflow-hidden flex items-center">
      <div className="w-full relative flex overflow-x-hidden">
        <div className="w-full flex items-center whitespace-nowrap animate-marquee">
          <MarqueeRow />
          <MarqueeRow />
        </div>
      </div>
    </section>
  );
}
