/** Extract only digits from a phone string. */
function digitsOnly(phone: string): string {
  return phone.replace(/[^0-9]/g, "");
}

/** Build a wa.me link from a phone number (any format) and an optional prefilled message. */
export function whatsappHref(phone: string, message?: string): string {
  const digits = digitsOnly(phone);
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Format a phone number for display: "+5digits-4digits-rest". */
export function formatPhone(phone: string): string {
  const digits = digitsOnly(phone);
  if (digits.length <= 5) return `+${digits}`;
  return `+${digits.slice(0, 5)}-${digits.slice(5, 9)}-${digits.slice(9)}`;
}
