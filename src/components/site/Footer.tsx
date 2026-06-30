import { Link, useRouterState } from "@tanstack/react-router";
import { SITE } from "@/lib/site";
import { Instagram, MapPin, Phone, Clock } from "lucide-react";
import logo from "@/assets/costa-logo.jpg.asset.json";

export function Footer() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) return null;

  return (
    <footer className="border-t border-border/60 bg-card/40 mt-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <img src={logo.url} alt="Costa Veículos" className="size-16 rounded-full ring-1 ring-silver/30" />
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">{SITE.tagline}. Atendemos toda a região do Sul de Minas.</p>
          <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm text-silver hover:text-silver-bright">
            <Instagram className="size-4" /> @veiculos.costa
          </a>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.25em] text-silver">Navegação</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground">Início</Link></li>
            <li><Link to="/estoque" className="hover:text-foreground">Estoque</Link></li>
            <li><Link to="/contato" className="hover:text-foreground">Contato</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.25em] text-silver">Contato</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2"><Phone className="size-4 mt-0.5 text-silver" /> {SITE.phone}</li>
            <li className="flex gap-2"><MapPin className="size-4 mt-0.5 text-silver shrink-0" /> {SITE.address}</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.25em] text-silver">Horário</h4>
          <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
            {SITE.hours.map((h) => (
              <li key={h.day} className="flex justify-between gap-3">
                <span>{h.day}</span>
                <span className={h.time === "Fechado" ? "text-destructive/80" : ""}>{h.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Costa Veículos — Todos os direitos reservados.
        <Link to="/auth" className="ml-3 text-silver/40 hover:text-silver">Acesso admin</Link>
      </div>
    </footer>
  );
}
