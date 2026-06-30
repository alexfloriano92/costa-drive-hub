import { Link, useRouterState } from "@tanstack/react-router";
import logo from "@/assets/costa-logo.jpg.asset.json";
import { whatsappLink } from "@/lib/site";
import { MessageCircle, Menu, X, Lock } from "lucide-react";
import { useState } from "react";


const nav: Array<{ to: string; label: string; hash?: string }> = [
  { to: "/", label: "Início" },
  { to: "/estoque", label: "Estoque" },
  { to: "/", hash: "contato", label: "Contato" },
];

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo.url} alt="Costa Veículos" className="size-24 md:size-28 rounded-full ring-2 ring-silver/40 shadow-glow object-cover" />
          <div className="hidden sm:block leading-tight">
            <div className="font-display text-base tracking-wide">COSTA</div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-silver">Veículos</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {nav.map((n) => {
            const active = !n.hash && (pathname === n.to || (n.to !== "/" && pathname.startsWith(n.to)));
            return (
              <Link
                key={`${n.to}#${n.hash ?? ""}`}
                to={n.to}
                hash={n.hash}
                className={`text-sm uppercase tracking-widest transition-colors ${
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-success px-4 py-2 text-xs font-medium uppercase tracking-wider text-black hover:opacity-90 transition"
          >
            <MessageCircle className="size-4" />
            WhatsApp
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex size-10 items-center justify-center rounded-md border border-border text-foreground"
            aria-label="Menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-background">
          <div className="flex flex-col px-4 py-3">
            {nav.map((n) => (
              <Link
                key={`${n.to}#${n.hash ?? ""}`}
                to={n.to}
                hash={n.hash}
                onClick={() => setOpen(false)}
                className="py-3 text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground"
              >
                {n.label}
              </Link>
            ))}
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-success px-4 py-2 text-xs font-medium uppercase tracking-wider text-black"
            >
              <MessageCircle className="size-4" /> WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
