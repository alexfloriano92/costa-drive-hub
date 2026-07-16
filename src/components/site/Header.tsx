import { Link, useRouterState } from "@tanstack/react-router";
import logo from "@/assets/costa-logo-transparent.png.asset.json";
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
      <div className="border-b border-border/40 bg-gradient-to-r from-background via-card/60 to-background">
        <div className="mx-auto flex max-w-7xl items-center justify-end gap-4 px-4 py-1.5 md:px-8 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          <Link
            to="/auth"
            className="group inline-flex items-center gap-1.5 rounded-full border border-silver/20 bg-card/40 px-3 py-1 text-silver transition hover:border-silver/60 hover:text-silver-bright"
          >
            <Lock className="size-3 transition group-hover:scale-110" />
            <span>Área Restrita</span>
          </Link>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">

        <Link to="/" className="flex items-center" aria-label="Costa Veículos — Início">
          <img
            src={logo.url}
            alt="Costa Veículos"
            className="h-24 md:h-28 w-auto object-contain"
            style={{ mixBlendMode: "screen" }}
          />
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
