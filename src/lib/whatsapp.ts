/** Build a wa.me link from a phone number (any format) and an optional prefilled message. */
export function whatsappHref(phone: string, message?: string): string {
  const digits = phone.replace(/[^0-9]/g, "");
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
