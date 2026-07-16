import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { VehicleCard } from "@/components/site/VehicleCard";
import { SITE, whatsappLink, formatBRL, formatKm } from "@/lib/site";
import heroImg from "@/assets/hero-car.jpg";
import {
  ShieldCheck, Award, Handshake, MessageCircle, ArrowRight, Star,
  MapPin, Phone, Clock, Instagram, Gauge, Calendar, Fuel, CheckCircle2,
  Sparkles, TrendingUp, Users,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Costa Veículos — Seminovos premium em Cachoeira de Minas - MG" },
      { name: "description", content: "Seminovos selecionados com procedência, garantia e financiamento facilitado. Hatch, sedan, SUV, picape e motos em Cachoeira de Minas - MG." },
      { property: "og:title", content: "Costa Veículos — Seminovos com garantia" },
      { property: "og:description", content: "Veículos com procedência em Cachoeira de Minas — MG." },
    ],
  }),
  component: Home,
});

// Demo cars — for owner presentation until real inventory is loaded via Admin
const DEMO_VEHICLES: ReadonlyArray<{ id: string; brand: string; model: string; year: number; mileage: number; price: number; fuel: string; category: string; img: string; tag?: string }> = [
  { id: "d1", brand: "Volkswagen", model: "Nivus Highline", year: 2023, mileage: 28500, price: 129900, fuel: "Flex", category: "SUV", img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80", tag: "Novo no estoque" },
  { id: "d2", brand: "Toyota", model: "Corolla XEi", year: 2022, mileage: 42000, price: 138500, fuel: "Flex", category: "Sedan", img: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80", tag: "Destaque" },
  { id: "d3", brand: "Jeep", model: "Compass Longitude", year: 2021, mileage: 58000, price: 149900, fuel: "Diesel", category: "SUV", img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80", tag: "Único dono" },
  { id: "d4", brand: "Honda", model: "Civic Touring", year: 2020, mileage: 65200, price: 132900, fuel: "Flex", category: "Sedan", img: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80" },
  { id: "d5", brand: "Chevrolet", model: "Onix Premier", year: 2023, mileage: 19800, price: 89900, fuel: "Flex", category: "Hatch", img: "https://images.unsplash.com/photo-1568844293986-8d0400bd4745?auto=format&fit=crop&w=1200&q=80", tag: "Baixa km" },
  { id: "d6", brand: "Toyota", model: "Hilux SRX 4x4", year: 2022, mileage: 71000, price: 289900, fuel: "Diesel", category: "Picape", img: "https://images.unsplash.com/photo-1519752594763-2633d556c1e8?auto=format&fit=crop&w=1200&q=80", tag: "Top de linha" },
  { id: "d7", brand: "Hyundai", model: "HB20 Comfort", year: 2022, mileage: 31500, price: 74900, fuel: "Flex", category: "Hatch", img: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80" },
  { id: "d8", brand: "Yamaha", model: "MT-07 ABS", year: 2023, mileage: 8200, price: 52900, fuel: "Gasolina", category: "Moto", img: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80", tag: "Semi-nova" },
];

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

  const hasReal = (featured.data?.length ?? 0) > 0;

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative isolate overflow-hidden bg-hero">
        <div className="absolute inset-0 -z-10">
          <img src={heroImg} alt="" width={1920} height={1080} className="size-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
          <div className="absolute -top-40 -right-40 size-[600px] rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 md:px-8 pt-24 pb-32 md:pt-36 md:pb-48">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] text-primary">
              <span className="size-1.5 rounded-full bg-success animate-pulse" />
              Cachoeira de Minas — MG
            </span>
            <h1 className="mt-8 font-display text-6xl md:text-8xl leading-[0.95] tracking-tight">
              O carro certo,<br />
              <span className="italic text-gradient-silver">com procedência</span><br />
              e negociação justa.
            </h1>
            <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-xl font-light leading-relaxed">
              Seminovos selecionados, vistoriados e prontos para rodar. Financiamento em até 60x com aprovação facilitada.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/estoque" className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm uppercase tracking-widest text-primary-foreground font-medium hover:bg-accent transition shadow-glow">
                Ver estoque completo <ArrowRight className="size-4" />
              </Link>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-8 py-3.5 text-sm uppercase tracking-widest hover:bg-primary/10 transition">
                <MessageCircle className="size-4" /> Simular financiamento
              </a>
            </div>

            {/* Inline metrics */}
            <div className="mt-16 grid grid-cols-3 gap-6 max-w-xl border-t border-border/60 pt-8">
              {[
                { n: "+12", l: "anos de mercado" },
                { n: "+1.500", l: "clientes satisfeitos" },
                { n: "100%", l: "veículos vistoriados" },
              ].map((m) => (
                <div key={m.l}>
                  <div className="font-display text-3xl md:text-4xl text-primary">{m.n}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">{m.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ TRUST BAR ============ */}
      <section className="border-y border-border/60 bg-card/40">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-12 grid grid-cols-1 sm:grid-cols-3 gap-10">
          {[
            { icon: ShieldCheck, title: "Garantia real", text: "Todo veículo passa por vistoria mecânica e de procedência antes de entrar no estoque." },
            { icon: Handshake, title: "Sem letra miúda", text: "Preço final claro, sem taxas escondidas. Você entra e sai da loja no controle." },
            { icon: Award, title: "Financiamento fácil", text: "Parcerias com Santander, Bradesco, Itaú e BV. Aprovação em minutos." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-4">
              <div className="grid size-12 shrink-0 place-items-center rounded-lg border border-primary/30 bg-primary/5 text-primary">
                <Icon className="size-5" />
              </div>
              <div>
                <div className="font-display text-xl">{title}</div>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ SHOWCASE / DEMO VEHICLES ============ */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-24">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-primary">
              <Sparkles className="size-3" /> {hasReal ? "Destaques do estoque" : "Amostra do estoque"}
            </span>
            <h2 className="mt-3 font-display text-5xl md:text-6xl leading-tight">
              Modelos que <span className="italic text-gradient-silver">saem rápido</span>.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Hatch, sedan, SUV, picape e motos. Selecionados para você chegar em qualquer estrada com segurança.
            </p>
          </div>
          <Link to="/estoque" className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-6 py-2.5 text-sm uppercase tracking-widest text-primary hover:bg-primary/10">
            Ver todos <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Bento-style asymmetric grid: 1 big + rest */}
        {hasReal ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.data!.map((v) => (
              <VehicleCard key={v.id} v={{ ...v, price: Number(v.price) }} />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-6 lg:grid-cols-12 auto-rows-[260px]">
            {DEMO_VEHICLES.map((v, i) => {
              // First is a wide feature card
              const wide = i === 0;
              const span = wide
                ? "md:col-span-6 lg:col-span-8 row-span-2"
                : i === 1
                ? "md:col-span-3 lg:col-span-4 row-span-1"
                : i === 2
                ? "md:col-span-3 lg:col-span-4 row-span-1"
                : "md:col-span-3 lg:col-span-3 row-span-1";
              return (
                <DemoCard key={v.id} v={v} wide={wide} className={span} />
              );
            })}
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Link to="/estoque" className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm uppercase tracking-widest text-primary-foreground font-medium hover:bg-accent transition shadow-glow">
            Ver todos os veículos <ArrowRight className="size-4" />
          </Link>
        </div>

      </section>

      {/* ============ PROCESS ============ */}
      <section className="border-y border-border/60 bg-card/30">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-24">
          <div className="max-w-2xl">
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary">Como funciona</span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Do primeiro contato à chave na mão em <span className="italic text-gradient-silver">4 passos</span>.</h2>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-4">
            {[
              { n: "01", t: "Escolha", d: "Navegue pelo estoque ou nos conte o que procura." },
              { n: "02", t: "Simule", d: "Envie os dados. Retornamos com a melhor condição de financiamento." },
              { n: "03", t: "Test drive", d: "Venha até a loja e sinta o carro. Sem compromisso." },
              { n: "04", t: "Chave na mão", d: "Documentação e transferência resolvidas por nós." },
            ].map((s) => (
              <div key={s.n} className="relative">
                <div className="font-display text-5xl text-primary/40">{s.n}</div>
                <div className="mt-3 font-display text-2xl">{s.t}</div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ABOUT + REVIEWS ============ */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-24 grid md:grid-cols-2 gap-16 items-start">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-primary">Sobre a Costa</span>
          <h2 className="mt-3 font-display text-5xl md:text-6xl leading-tight">
            Tradição em <span className="italic text-gradient-silver">seminovos</span> no sul de Minas.
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            A Costa Veículos nasceu com um propósito simples: vender carro do jeito que a gente gostaria de comprar. Transparência, procedência e um atendimento que trata cada cliente como visita de casa.
          </p>
          <ul className="mt-8 space-y-3 text-sm">
            {[
              "Vistoria mecânica e cautelar em todos os veículos",
              "Documentação sem pendências, transferência incluída",
              "Aceita seu usado como parte do pagamento",
              "Retorno em até 15 minutos no WhatsApp",
            ].map((i) => (
              <li key={i} className="flex gap-3">
                <CheckCircle2 className="size-5 text-primary shrink-0" />
                <span className="text-muted-foreground">{i}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex gap-3">
            <Link to="/estoque" className="rounded-full border border-primary/40 px-6 py-2.5 text-sm uppercase tracking-widest hover:bg-primary/10">Ver estoque</Link>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="rounded-full bg-primary px-6 py-2.5 text-sm uppercase tracking-widest text-primary-foreground hover:bg-accent">
              Falar agora
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <Users className="size-8 text-primary" />
            <div>
              <div className="font-display text-2xl">5.0 / 5.0</div>
              <div className="text-xs text-muted-foreground">Baseado em avaliações reais de clientes</div>
            </div>
          </div>
          {[
            { name: "Pedro Lopes", text: "Excelente atendimento, transparência na negociação, veículos de qualidade! Recomendo demais." },
            { name: "Kelcilene Santos", text: "Atendimento de primeira e o carro é exatamente como foi descrito. Voltarei." },
            { name: "Elias Moisés", text: "Negociação tranquila e sem enrolação. Fecharam comigo na primeira visita." },
          ].map((r) => (
            <div key={r.name} className="rounded-xl border border-border/60 bg-card/40 p-6">
              <div className="flex items-center gap-1 text-primary">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-4 fill-current" />)}
              </div>
              <p className="mt-3 text-muted-foreground leading-relaxed">"{r.text}"</p>
              <div className="mt-4 text-xs uppercase tracking-widest text-primary">— {r.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ CONTACT / LOCATION ============ */}
      <section id="contato" className="scroll-mt-24 border-t border-border/60 bg-card/20">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-24 grid gap-10 md:grid-cols-2 items-start">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary">Onde estamos</span>
            <h2 className="mt-3 font-display text-5xl md:text-6xl">Venha nos <span className="italic text-gradient-silver">visitar</span>.</h2>
            <ul className="mt-10 space-y-5 text-sm">
              <li className="flex gap-4"><MapPin className="size-5 mt-0.5 text-primary shrink-0" /><span className="text-muted-foreground">{SITE.address}</span></li>
              <li className="flex gap-4"><Phone className="size-5 mt-0.5 text-primary shrink-0" /><a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition">{SITE.phone}</a></li>
              <li className="flex gap-4"><Instagram className="size-5 mt-0.5 text-primary shrink-0" /><a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition">@veiculos.costa</a></li>
              <li className="flex gap-4">
                <Clock className="size-5 mt-0.5 text-primary shrink-0" />
                <div className="text-muted-foreground space-y-0.5">
                  <div>Seg–Sex: 08:00 – 18:00</div>
                  <div>Sábado: 08:00 – 12:00</div>
                  <div>Domingo: Fechado</div>
                </div>
              </li>
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-success px-7 py-3 text-sm uppercase tracking-widest text-black hover:opacity-90">
                <MessageCircle className="size-4" /> WhatsApp
              </a>
              <Link to="/contato" className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-7 py-3 text-sm uppercase tracking-widest hover:bg-primary/10">
                Mais detalhes <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-border/60 shadow-premium">
            <iframe
              title="Localização Costa Veículos"
              src="https://www.google.com/maps?q=Rodovia+Prefeito+Jo%C3%A3o+Belmiro+da+Costa%2C+146+-+Centro%2C+Cachoeira+de+Minas+-+MG&output=embed"
              className="w-full h-[420px]"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-24">
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 p-10 md:p-20 text-center shadow-premium">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-card via-background to-card" />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-[500px] rounded-full bg-primary/10 blur-3xl" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-primary">Pronto para começar?</span>
          <h2 className="mt-4 font-display text-4xl md:text-6xl max-w-3xl mx-auto leading-tight">
            Seu próximo carro está a <span className="italic text-gradient-silver">uma conversa</span> de distância.
          </h2>
          <p className="mt-5 text-muted-foreground max-w-xl mx-auto">Atendimento humano, resposta rápida e sem pressão. Chame no WhatsApp ou visite a loja.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-success px-8 py-3.5 text-sm uppercase tracking-widest text-black hover:opacity-90">
              <MessageCircle className="size-4" /> {SITE.phone}
            </a>
            <Link to="/estoque" className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-8 py-3.5 text-sm uppercase tracking-widest hover:bg-primary/10">
              Ver estoque <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

// ---- Demo card (used only when DB has no vehicles yet) ----
type Demo = (typeof DEMO_VEHICLES)[number];
function DemoCard({ v, wide, className }: { v: Demo; wide?: boolean; className?: string }) {
  return (
    <Link
      to="/estoque"
      className={`group relative overflow-hidden rounded-xl border border-border/60 bg-card transition-all hover:border-primary/50 hover:shadow-premium ${className ?? ""}`}
    >
      <img src={v.img} alt={`${v.brand} ${v.model}`} className="absolute inset-0 size-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      {v.tag && (
        <span className="absolute top-4 left-4 rounded-full bg-primary/95 px-3 py-1 text-[10px] uppercase tracking-widest text-primary-foreground font-medium">
          {v.tag}
        </span>
      )}
      <span className="absolute top-4 right-4 rounded-full border border-white/20 bg-black/40 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-widest text-white/90">
        {v.category}
      </span>
      <div className={`absolute inset-x-0 bottom-0 p-5 md:p-6 ${wide ? "md:p-8" : ""}`}>
        <div className={`font-display ${wide ? "text-4xl md:text-5xl" : "text-2xl"} leading-tight text-white`}>
          {v.brand} <span className="italic text-primary">{v.model}</span>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/80">
          <span className="inline-flex items-center gap-1"><Calendar className="size-3" /> {v.year}</span>
          <span className="inline-flex items-center gap-1"><Gauge className="size-3" /> {formatKm(v.mileage)}</span>
          <span className="inline-flex items-center gap-1"><Fuel className="size-3" /> {v.fuel}</span>
        </div>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <div className="text-[9px] uppercase tracking-widest text-primary">A partir de</div>
            <div className={`font-display ${wide ? "text-4xl" : "text-2xl"} text-white`}>{formatBRL(v.price)}</div>
          </div>
          <span className="text-xs text-primary group-hover:text-accent transition">Detalhes →</span>
        </div>
      </div>
    </Link>
  );
}
