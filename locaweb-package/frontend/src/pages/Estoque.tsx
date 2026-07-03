import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { VehicleCard } from "@/components/VehicleCard";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

type Filters = { q: string; category: string; minPrice: string; maxPrice: string; minYear: string; sort: string };
const EMPTY: Filters = { q: "", category: "all", minPrice: "", maxPrice: "", minYear: "", sort: "recent" };

export default function Estoque() {
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [openMobile, setOpenMobile] = useState(false);
  const { data, isLoading } = useQuery({ queryKey: ["vehicles"], queryFn: api.listVehicles });

  const filtered = useMemo(() => {
    if (!data) return [];
    let out = data.filter((v) => {
      if (filters.category !== "all" && v.category !== filters.category) return false;
      if (filters.minPrice && v.price < Number(filters.minPrice)) return false;
      if (filters.maxPrice && v.price > Number(filters.maxPrice)) return false;
      if (filters.minYear && v.year < Number(filters.minYear)) return false;
      if (filters.q && !`${v.brand} ${v.model}`.toLowerCase().includes(filters.q.toLowerCase())) return false;
      return true;
    });
    if (filters.sort === "price-asc") out = [...out].sort((a, b) => a.price - b.price);
    if (filters.sort === "price-desc") out = [...out].sort((a, b) => b.price - a.price);
    if (filters.sort === "year-desc") out = [...out].sort((a, b) => b.year - a.year);
    return out;
  }, [data, filters]);

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 pt-16 pb-24">
      <div className="mb-10">
        <span className="text-[10px] uppercase tracking-[0.3em] text-silver">Catálogo</span>
        <h1 className="mt-2 font-display text-4xl md:text-5xl">Nosso estoque</h1>
        <p className="mt-3 text-muted-foreground">{filtered.length} veículo{filtered.length !== 1 ? "s" : ""} disponível{filtered.length !== 1 ? "is" : ""}</p>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        <aside className={`${openMobile ? "fixed inset-0 z-50 bg-background p-6 overflow-auto" : "hidden"} lg:block lg:static lg:bg-transparent lg:p-0`}>
          {openMobile && <button onClick={() => setOpenMobile(false)} className="lg:hidden absolute top-4 right-4 p-2"><X className="size-5" /></button>}
          <FiltersPanel filters={filters} setFilters={setFilters} />
        </aside>

        <div>
          <div className="lg:hidden mb-4">
            <button onClick={() => setOpenMobile(true)} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm">
              <SlidersHorizontal className="size-4" /> Filtros
            </button>
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-[400px] rounded-xl bg-card animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center">
              <p className="text-muted-foreground">Nenhum veículo encontrado.</p>
              <button onClick={() => setFilters(EMPTY)} className="mt-4 text-silver hover:text-silver-bright">Limpar filtros</button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((v) => <VehicleCard key={v.id} v={v} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FiltersPanel({ filters, setFilters }: { filters: Filters; setFilters: (f: Filters) => void }) {
  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => setFilters({ ...filters, [k]: v });
  return (
    <div className="space-y-6 rounded-xl border border-border/60 bg-card/40 p-5">
      <div>
        <label className="text-[10px] uppercase tracking-widest text-silver">Buscar</label>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input value={filters.q} onChange={(e) => set("q", e.target.value)} placeholder="Marca ou modelo" className="w-full rounded-md bg-input border border-border pl-9 pr-3 py-2 text-sm" />
        </div>
      </div>
      <div>
        <label className="text-[10px] uppercase tracking-widest text-silver">Categoria</label>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {[{ v: "all", l: "Todos" }, { v: "carro", l: "Carros" }, { v: "moto", l: "Motos" }].map((o) => (
            <button key={o.v} onClick={() => set("category", o.v)} className={`rounded-md border px-2 py-2 text-xs uppercase tracking-wider transition ${filters.category === o.v ? "border-silver bg-silver text-black" : "border-border hover:border-silver/40"}`}>{o.l}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-[10px] uppercase tracking-widest text-silver">Preço</label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <input value={filters.minPrice} onChange={(e) => set("minPrice", e.target.value)} type="number" placeholder="Mín" className="rounded-md bg-input border border-border px-3 py-2 text-sm" />
          <input value={filters.maxPrice} onChange={(e) => set("maxPrice", e.target.value)} type="number" placeholder="Máx" className="rounded-md bg-input border border-border px-3 py-2 text-sm" />
        </div>
      </div>
      <div>
        <label className="text-[10px] uppercase tracking-widest text-silver">Ano mínimo</label>
        <input value={filters.minYear} onChange={(e) => set("minYear", e.target.value)} type="number" placeholder="Ex: 2018" className="mt-2 w-full rounded-md bg-input border border-border px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="text-[10px] uppercase tracking-widest text-silver">Ordenar</label>
        <select value={filters.sort} onChange={(e) => set("sort", e.target.value)} className="mt-2 w-full rounded-md bg-input border border-border px-3 py-2 text-sm">
          <option value="recent">Mais recentes</option>
          <option value="price-asc">Menor preço</option>
          <option value="price-desc">Maior preço</option>
          <option value="year-desc">Mais novos</option>
        </select>
      </div>
      <button onClick={() => setFilters(EMPTY)} className="w-full rounded-md border border-border py-2 text-xs uppercase tracking-widest hover:border-silver/40">Limpar filtros</button>
    </div>
  );
}
