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
    <span className="font-display text-2xl uppercase tracking-wider font-bold px-8 flex items-center">
      Trusting Laci POS:
      {CLIENTS.map((name, i) => (
        <span key={i} className="flex items-center">
          <span
            className={
              "mx-6 text-3xl leading-none " + (i % 2 === 0 ? "text-brand-orange" : "text-white/20")
            }
          >
            *
          </span>
          {name}
        </span>
      ))}
      <span className="mx-6 text-3xl leading-none text-brand-orange">*</span>
    </span>
  );
}

export function ClientsMarquee() {
  return (
    <section className="border-t-2 border-b-2 border-brand-black bg-brand-black text-brand-lime py-4 overflow-hidden flex items-center">
      <div className="w-full relative flex overflow-x-hidden">
        <div className="w-full flex items-center whitespace-nowrap animate-marquee">
          <MarqueeRow />
          <MarqueeRow />
        </div>
      </div>
    </section>
  );
}
