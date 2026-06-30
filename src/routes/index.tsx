import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { VehicleCard } from "@/components/site/VehicleCard";
import { SITE, whatsappLink } from "@/lib/site";
import heroImg from "@/assets/hero-car.jpg";
import logo from "@/assets/costa-logo.jpg.asset.json";
import { ShieldCheck, Award, Handshake, MessageCircle, ArrowRight, Star } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Costa Veículos — Seminovos em Cachoeira de Minas - MG" },
      { name: "description", content: "Seminovos com procedência e garantia. Financiamento facilitado. Loja localizada em Cachoeira de Minas - MG." },
      { property: "og:title", content: "Costa Veículos — Seminovos com garantia" },
      { property: "og:description", content: "Veículos com procedência em Cachoeira de Minas — MG." },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = useQuery({
    queryKey: ["vehicles", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("id,brand,model,year,mileage,price,fuel,status,images,featured")
        .neq("status", "vendido")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={heroImg} alt="" width={1920} height={1080} className="size-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
        </div>

        <div className="mx-auto max-w-7xl px-4 md:px-8 pt-20 pb-32 md:pt-32 md:pb-48">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-silver/30 bg-silver/5 px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] text-silver">
              <span className="size-1.5 rounded-full bg-success animate-pulse" />
              Cachoeira de Minas — MG
            </span>
            <h1 className="mt-6 font-display text-5xl md:text-7xl leading-[1.05]">
              Seu próximo carro com <span className="text-gradient-silver">procedência</span> e garantia.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              Seminovos selecionados, financiamento facilitado e atendimento transparente.
              Há anos sendo referência em Cachoeira de Minas.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/estoque" className="inline-flex items-center gap-2 rounded-full bg-silver px-7 py-3 text-sm uppercase tracking-widest text-black hover:bg-silver-bright transition shadow-glow">
                Ver estoque <ArrowRight className="size-4" />
              </Link>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-silver/40 px-7 py-3 text-sm uppercase tracking-widest hover:bg-silver/10 transition">
                <MessageCircle className="size-4" /> Falar agora
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-y border-border/60 bg-card/30">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { icon: ShieldCheck, title: "Garantia", text: "Veículos vistoriados com garantia de procedência." },
            { icon: Handshake, title: "Negociação justa", text: "Transparência em cada detalhe da negociação." },
            { icon: Award, title: "Financiamento", text: "Parcerias com bancos para aprovação facilitada." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-4">
              <div className="grid size-12 shrink-0 place-items-center rounded-full border border-silver/30 bg-silver/5 text-silver">
                <Icon className="size-5" />
              </div>
              <div>
                <div className="font-display text-lg">{title}</div>
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-24">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-silver">Destaques</span>
            <h2 className="mt-2 font-display text-4xl md:text-5xl">Veículos em destaque</h2>
          </div>
          <Link to="/estoque" className="hidden sm:inline-flex text-sm text-silver hover:text-silver-bright items-center gap-1">
            Ver todos <ArrowRight className="size-4" />
          </Link>
        </div>

        {featured.isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[400px] rounded-xl bg-card animate-pulse" />
            ))}
          </div>
        ) : featured.data && featured.data.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.data.map((v) => (
              <VehicleCard key={v.id} v={{ ...v, price: Number(v.price) }} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-12 text-center">
            <img src={logo.url} alt="Costa Veículos" className="mx-auto size-32 rounded-full opacity-70 object-cover" />
            <p className="mt-4 text-muted-foreground">Em breve, novos veículos no estoque.</p>
            <a href={whatsappLink("Olá! Gostaria de saber sobre os veículos disponíveis.")} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-silver hover:text-silver-bright">
              <MessageCircle className="size-4" /> Consultar pelo WhatsApp
            </a>
          </div>
        )}
      </section>

      {/* ABOUT */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-24 border-t border-border/60 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-silver">Sobre a loja</span>
          <h2 className="mt-2 font-display text-4xl md:text-5xl">Tradição em <span className="text-gradient-silver">seminovos</span> em Cachoeira de Minas.</h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            A Costa Veículos é uma loja de seminovos de qualidade, com veículos vistoriados,
            garantia e procedência. Trabalhamos com carros e motos, atendendo clientes em
            Cachoeira de Minas — MG e toda a região.
          </p>
          <div className="mt-8 flex gap-3">
            <Link to="/estoque" className="rounded-full border border-silver/40 px-6 py-2.5 text-sm uppercase tracking-widest hover:bg-silver/10">Ver estoque</Link>
            <Link to="/contato" className="rounded-full bg-silver px-6 py-2.5 text-sm uppercase tracking-widest text-black hover:bg-silver-bright">Visite a loja</Link>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { name: "Pedro Lopes", text: "Excelente atendimento, transparência na negociação, veículos de qualidade!" },
            { name: "Kelcilene Santos", text: "Recomendo. Atendimento de primeira e veículos como descritos." },
            { name: "Elias Moisés", text: "Negociação tranquila. Voltarei certamente." },
          ].map((r) => (
            <div key={r.name} className="rounded-xl border border-border/60 bg-card/40 p-5">
              <div className="flex items-center gap-1 text-warning">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-current" />
                ))}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">"{r.text}"</p>
              <div className="mt-3 text-xs uppercase tracking-widest text-silver">— {r.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 pb-24">
        <div className="rounded-2xl border border-silver/20 bg-gradient-to-br from-card via-card to-background p-10 md:p-16 text-center shadow-premium">
          <h2 className="font-display text-3xl md:text-5xl">Pronto para o seu próximo veículo?</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Fale agora com nossos consultores pelo WhatsApp ou visite a loja.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-success px-7 py-3 text-sm uppercase tracking-widest text-black hover:opacity-90">
              <MessageCircle className="size-4" /> {SITE.phone}
            </a>
            <Link to="/estoque" className="inline-flex items-center gap-2 rounded-full border border-silver/40 px-7 py-3 text-sm uppercase tracking-widest hover:bg-silver/10">
              Ver estoque <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
