/** Formats a price (e.g. a stringified Prisma Decimal) as "IDR 150.000". */
export function formatIDR(price: string | number): string {
  const amount = typeof price === "string" ? Number(price) : price;
  return `IDR ${Math.round(amount).toLocaleString("id-ID")}`;
}
