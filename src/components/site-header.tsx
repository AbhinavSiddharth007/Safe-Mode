import Link from "next/link";

const links = [
  { href: "/", label: "Map" },
  { href: "/feed", label: "Feed" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-black/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            Safe Mode
          </p>
          <h1 className="text-lg font-semibold text-slate-950">
            Live disruption tracker
          </h1>
        </div>
        <nav className="flex items-center gap-2 rounded-full border border-black/10 bg-slate-50 p-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white hover:text-slate-950"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
