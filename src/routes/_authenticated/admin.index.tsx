import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SignedImage } from "@/components/site/SignedImage";
import { formatBRL, formatKm } from "@/lib/site";
import { Pencil, Trash2, Plus, Star } from "lucide-react";
import { toast } from "sonner";
import { deleteVehicleImage } from "@/lib/vehicle-images";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminList,
});

const STATUS_LABEL: Record<string, string> = {
  disponivel: "Disponível",
  reservado: "Reservado",
  vendido: "Vendido",
};

const STATUS_COLOR: Record<string, string> = {
  disponivel: "bg-success/15 text-success border-success/30",
  reservado: "bg-warning/15 text-warning border-warning/30",
  vendido: "bg-destructive/15 text-destructive border-destructive/30",
};

function AdminList() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "vehicles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  async function toggleFeatured(id: string, current: boolean) {
    const { error } = await supabase.from("vehicles").update({ featured: !current }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success(current ? "Removido dos destaques" : "Marcado como destaque");
      qc.invalidateQueries({ queryKey: ["admin", "vehicles"] });
      qc.invalidateQueries({ queryKey: ["vehicles", "featured"] });
    }
  }

  async function handleDelete(id: string, images: string[]) {
    if (!confirm("Excluir este veículo definitivamente?")) return;
    const { error } = await supabase.from("vehicles").delete().eq("id", id);
    if (error) return toast.error(error.message);
    await Promise.all((images ?? []).map((p) => deleteVehicleImage(p).catch(() => {})));
    toast.success("Veículo excluído.");
    qc.invalidateQueries({ queryKey: ["admin", "vehicles"] });
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
                <SignedImage path={v.images?.[0]} alt="" className="size-full object-cover" />
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
                  {v.year} • {formatKm(v.mileage)} • {formatBRL(Number(v.price))}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => toggleFeatured(v.id, v.featured)} title="Alternar destaque" className="grid size-9 place-items-center rounded-md border border-border hover:border-silver/40 hover:text-silver">
                  <Star className={`size-4 ${v.featured ? "fill-silver text-silver" : ""}`} />
                </button>
                <Link to="/admin/$id" params={{ id: v.id }} className="grid size-9 place-items-center rounded-md border border-border hover:border-silver/40 hover:text-silver">
                  <Pencil className="size-4" />
                </Link>
                <button onClick={() => handleDelete(v.id, v.images ?? [])} className="grid size-9 place-items-center rounded-md border border-border hover:border-destructive hover:text-destructive">
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
