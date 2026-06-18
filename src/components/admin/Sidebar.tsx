import Link from "next/link";

export function Sidebar({ email }: { email: string }) {
  return (
    <aside className="w-60 shrink-0 bg-zinc-900 text-zinc-300 flex flex-col min-h-screen">
      <div className="px-6 py-6 border-b border-zinc-800">
        <span className="font-display text-sm tracking-widest uppercase text-white">LACI*POS</span>
        <div className="text-xs text-zinc-500 mt-1">Admin</div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 text-sm font-medium">
        <Link href="/admin/inquiries" className="block px-3 py-2 rounded-md hover:bg-zinc-800 hover:text-white transition-colors">
          Inquiries
        </Link>
        <Link href="/admin/contracts" className="block px-3 py-2 rounded-md hover:bg-zinc-800 hover:text-white transition-colors">
          Contracts
        </Link>
      </nav>

      <div className="px-3 py-4 border-t border-zinc-800 space-y-2">
        <div className="px-3 text-xs text-zinc-500 truncate">{email}</div>
        <form action="/admin/logout" method="POST">
          <button
            type="submit"
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-zinc-800 hover:text-white transition-colors"
          >
            Log out
          </button>
        </form>
      </div>
    </aside>
  );
}
