import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SignedImage } from "@/components/site/SignedImage";
import { formatBRL, formatKm, whatsappLink } from "@/lib/site";
import { ArrowLeft, Calendar, Fuel, Gauge, MessageCircle, Palette, Settings2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/veiculo/$id")({
  component: VeiculoDetalhe,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="font-display text-4xl">Veículo não encontrado</h1>
      <Link to="/estoque" className="mt-6 inline-block text-silver hover:text-silver-bright">← Voltar ao estoque</Link>
    </div>
  ),
});

function VeiculoDetalhe() {
  const { id } = Route.useParams();
  const [activeImg, setActiveImg] = useState(0);

  const { data: v, isLoading } = useQuery({
    queryKey: ["vehicle", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("vehicles").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      return data;
    },
  });

  if (isLoading) return <div className="mx-auto max-w-7xl px-4 py-24"><div className="h-96 rounded-xl bg-card animate-pulse" /></div>;
  if (!v) return null;

  const sold = v.status === "vendido";
  const msg = `Olá! Tenho interesse no ${v.brand} ${v.model} ${v.year} anunciado por ${formatBRL(Number(v.price))}.`;

  const specs = [
    { icon: Calendar, label: "Ano", value: v.year },
    { icon: Gauge, label: "KM", value: formatKm(v.mileage) },
    { icon: Fuel, label: "Combustível", value: v.fuel || "—" },
    { icon: Settings2, label: "Câmbio", value: v.transmission || "—" },
    { icon: Palette, label: "Cor", value: v.color || "—" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 pt-8 pb-24">
      <Link to="/estoque" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Voltar ao estoque
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_400px]">
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-card">
            <SignedImage path={v.images?.[activeImg]} alt={`${v.brand} ${v.model}`} loading="eager" className="size-full object-cover" />
            {sold && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                <span className="rotate-[-8deg] border-2 border-destructive px-8 py-3 text-3xl font-display tracking-widest text-destructive">VENDIDO</span>
              </div>
            )}
          </div>
          {v.images && v.images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 sm:grid-cols-6 gap-2">
              {v.images.map((p, i) => (
                <button key={p} onClick={() => setActiveImg(i)} className={`aspect-square overflow-hidden rounded-md border transition ${i === activeImg ? "border-silver" : "border-border/60 opacity-60 hover:opacity-100"}`}>
                  <SignedImage path={p} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-silver">{v.category === "moto" ? "Moto" : "Carro"} • Seminovo</span>
            <h1 className="mt-2 font-display text-4xl">{v.brand} <span className="text-silver">{v.model}</span></h1>
          </div>
          <div className="rounded-xl border border-silver/20 bg-card p-6 shadow-premium">
            <div className="text-[10px] uppercase tracking-widest text-silver">Preço</div>
            <div className="mt-1 font-display text-4xl text-gradient-silver">{formatBRL(Number(v.price))}</div>
            {!sold && (
              <a href={whatsappLink(msg)} target="_blank" rel="noopener noreferrer" className="mt-6 flex items-center justify-center gap-2 rounded-full bg-success py-3 text-sm uppercase tracking-widest text-black hover:opacity-90 transition">
                <MessageCircle className="size-4" /> Tenho interesse
              </a>
            )}
          </div>

          <div className="rounded-xl border border-border/60 bg-card/40 p-6">
            <h3 className="font-display text-lg mb-4">Especificações</h3>
            <dl className="grid grid-cols-2 gap-y-4">
              {specs.map(({ icon: Icon, label, value }) => (
                <div key={label}>
                  <dt className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-silver"><Icon className="size-3" /> {label}</dt>
                  <dd className="mt-1 text-sm">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </div>

      {v.description && (
        <section className="mt-12 max-w-3xl">
          <h2 className="font-display text-2xl mb-3">Descrição</h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{v.description}</p>
        </section>
      )}
    </div>
  );
}
