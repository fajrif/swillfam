/** Small image thumbnail for admin list tables. Renders a placeholder when empty. */
export function Thumb({ src, alt = "" }: { src?: string | null; alt?: string }) {
  if (!src) {
    return <div className="h-10 w-10 rounded bg-zinc-100 border border-zinc-200" />;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className="h-10 w-10 rounded object-cover bg-zinc-100 border border-zinc-200" />;
}
