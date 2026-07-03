import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { VehicleImage } from "@/components/VehicleImage";
import { formatBRL, formatKm } from "@/lib/site";
import { Pencil, Trash2, Plus, Star } from "lucide-react";
import { toast } from "sonner";

const STATUS_LABEL: Record<string, string> = { disponivel: "Disponível", reservado: "Reservado", vendido: "Vendido" };
const STATUS_COLOR: Record<string, string> = {
  disponivel: "bg-success/15 text-success border-success/30",
  reservado: "bg-warning/15 text-warning border-warning/30",
  vendido: "bg-destructive/15 text-destructive border-destructive/30",
};

export default function AdminList() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["vehicles"], queryFn: api.listVehicles });

  async function toggleFeatured(id: string, current: boolean) {
    try {
      await api.toggleFeatured(id, !current);
      toast.success(current ? "Removido dos destaques" : "Marcado como destaque");
      qc.invalidateQueries({ queryKey: ["vehicles"] });
    } catch (e) { toast.error(e instanceof Error ? e.message : "Erro"); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir este veículo definitivamente?")) return;
    try {
      await api.deleteVehicle(id);
      toast.success("Veículo excluído.");
      qc.invalidateQueries({ queryKey: ["vehicles"] });
    } catch (e) { toast.error(e instanceof Error ? e.message : "Erro"); }
  }

  return (
    <>
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl">Veículos</h1>
          <p className="text-sm text-muted-foreground">{data?.length ?? 0} cadastrado{(data?.length ?? 0) !== 1 ? "s" : ""}</p>
        </div>
        <Link to="/admin/novo" className="inline-flex items-center gap-2 rounded-full bg-silver px-5 py-2.5 text-xs uppercase tracking-widest text-black hover:bg-silver-bright">
          <Plus className="size-4" /> Adicionar
        </Link>
      </div>

      {isLoading ? (
        <div className="grid gap-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 rounded-xl bg-card animate-pulse" />)}</div>
      ) : !data || data.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">Nenhum veículo cadastrado ainda.</p>
          <Link to="/admin/novo" className="mt-4 inline-flex items-center gap-2 rounded-full bg-silver px-5 py-2 text-xs uppercase tracking-widest text-black">
            <Plus className="size-4" /> Cadastrar primeiro veículo
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((v) => (
            <div key={v.id} className="grid grid-cols-[80px_1fr_auto] sm:grid-cols-[100px_1fr_auto] gap-4 items-center rounded-xl border border-border bg-card/40 p-3">
              <div className="size-20 sm:size-24 overflow-hidden rounded-md bg-muted">
                <VehicleImage path={v.images?.[0]} alt="" className="size-full object-cover" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-lg truncate">{v.brand} {v.model}</h3>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-widest ${STATUS_COLOR[v.status] ?? ""}`}>
                    {STATUS_LABEL[v.status] ?? v.status}
                  </span>
                  {v.featured && <span className="inline-flex items-center gap-1 rounded-full bg-silver/15 text-silver border border-silver/30 px-2 py-0.5 text-[10px] uppercase tracking-widest"><Star className="size-2.5" /> Destaque</span>}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {v.year} • {formatKm(v.mileage)} • {formatBRL(v.price)}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => toggleFeatured(v.id, v.featured)} title="Alternar destaque" className="grid size-9 place-items-center rounded-md border border-border hover:border-silver/40 hover:text-silver">
                  <Star className={`size-4 ${v.featured ? "fill-silver text-silver" : ""}`} />
                </button>
                <Link to={`/admin/${v.id}`} className="grid size-9 place-items-center rounded-md border border-border hover:border-silver/40 hover:text-silver">
                  <Pencil className="size-4" />
                </Link>
                <button onClick={() => handleDelete(v.id)} className="grid size-9 place-items-center rounded-md border border-border hover:border-destructive hover:text-destructive">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
