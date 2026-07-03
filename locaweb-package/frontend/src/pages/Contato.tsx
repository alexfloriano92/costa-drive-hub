import { SITE, whatsappLink } from "@/lib/site";
import { MapPin, Phone, Clock, MessageCircle, Instagram } from "lucide-react";

export default function Contato() {
  return (
    <div className="mx-auto max-w-6xl px-4 md:px-8 pt-16 pb-24">
      <span className="text-[10px] uppercase tracking-[0.3em] text-silver">Contato</span>
      <h1 className="mt-2 font-display text-4xl md:text-5xl">Visite a Costa Veículos</h1>
      <p className="mt-4 text-muted-foreground max-w-2xl">Estamos prontos para te atender pessoalmente ou pelo WhatsApp.</p>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <Card icon={Phone} title="Telefone / WhatsApp">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="text-lg hover:text-silver-bright">{SITE.phone}</a>
          </Card>
          <Card icon={MapPin} title="Endereço">
            <p className="text-muted-foreground">{SITE.address}</p>
          </Card>
          <Card icon={Instagram} title="Instagram">
            <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="text-silver hover:text-silver-bright">@veiculos.costa</a>
          </Card>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="block w-full text-center rounded-full bg-success py-4 text-sm uppercase tracking-widest text-black hover:opacity-90">
            <MessageCircle className="inline size-4 mr-2" /> Falar pelo WhatsApp
          </a>
        </div>

        <Card icon={Clock} title="Horário de funcionamento">
          <ul className="divide-y divide-border/60">
            {SITE.hours.map((h) => (
              <li key={h.day} className="flex justify-between py-2.5 text-sm">
                <span>{h.day}</span>
                <span className={h.time === "Fechado" ? "text-destructive/80" : "text-foreground"}>{h.time}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-12 overflow-hidden rounded-xl border border-border/60">
        <iframe title="Localização Costa Veículos" src="https://www.google.com/maps?q=Rodovia+Prefeito+Jo%C3%A3o+Belmiro+da+Costa%2C+146+-+Centro%2C+Cachoeira+de+Minas+-+MG&output=embed" className="w-full h-[240px]" loading="lazy" />
      </div>
    </div>
  );
}

function Card({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/40 p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="grid size-9 place-items-center rounded-full bg-silver/10 text-silver"><Icon className="size-4" /></div>
        <h3 className="font-display text-lg">{title}</h3>
      </div>
      {children}
    </div>
  );
}
