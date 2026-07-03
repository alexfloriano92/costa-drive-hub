import { useRef, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2, Upload, X, GripVertical, Star } from "lucide-react";
import { api, type Vehicle } from "@/lib/api";
import { VehicleImage } from "./VehicleImage";

const EMPTY: Partial<Vehicle> = {
  brand: "", model: "", year: new Date().getFullYear(), mileage: 0, price: 0,
  color: "", fuel: "Flex", transmission: "Manual",
  category: "carro", status: "disponivel", featured: false, description: "", images: [],
};

export function VehicleForm({ initial, onDone }: { initial?: Vehicle; onDone: () => void }) {
  const navigate = useNavigate();
  const [v, setV] = useState<Partial<Vehicle>>(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof Vehicle>(k: K, val: Vehicle[K]) {
    setV((p) => ({ ...p, [k]: val }));
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) uploaded.push(await api.uploadImage(file));
      set("images", [...(v.images ?? []), ...uploaded]);
      toast.success(`${uploaded.length} imagem(ns) enviada(s).`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro no upload.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function removeImage(path: string) {
    set("images", (v.images ?? []).filter((p) => p !== path));
    api.deleteImage(path).catch(() => {});
  }

  function moveImage(idx: number, dir: -1 | 1) {
    const next = [...(v.images ?? [])];
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    [next[idx], next[j]] = [next[j], next[idx]];
    set("images", next);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.saveVehicle({
        id: v.id,
        brand: (v.brand ?? "").trim(),
        model: (v.model ?? "").trim(),
        year: Number(v.year),
        mileage: Number(v.mileage),
        price: Number(v.price),
        color: v.color || null,
        fuel: v.fuel || null,
        transmission: v.transmission || null,
        category: v.category ?? "carro",
        status: v.status ?? "disponivel",
        featured: !!v.featured,
        description: v.description || null,
        images: v.images ?? [],
      });
      toast.success(v.id ? "Veículo atualizado." : "Veículo cadastrado.");
      onDone();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <Section title="Identificação">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Marca *"><input required value={v.brand ?? ""} onChange={(e) => set("brand", e.target.value)} className={input} placeholder="Ex: Volkswagen" /></Field>
            <Field label="Modelo *"><input required value={v.model ?? ""} onChange={(e) => set("model", e.target.value)} className={input} placeholder="Ex: Gol 1.0" /></Field>
            <Field label="Categoria">
              <select value={v.category ?? "carro"} onChange={(e) => set("category", e.target.value)} className={input}>
                <option value="carro">Carro</option>
                <option value="moto">Moto</option>
              </select>
            </Field>
            <Field label="Status">
              <select value={v.status ?? "disponivel"} onChange={(e) => set("status", e.target.value)} className={input}>
                <option value="disponivel">Disponível</option>
                <option value="reservado">Reservado</option>
                <option value="vendido">Vendido</option>
              </select>
            </Field>
          </div>
        </Section>

        <Section title="Especificações">
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Ano *"><input required type="number" value={v.year ?? ""} onChange={(e) => set("year", Number(e.target.value))} className={input} /></Field>
            <Field label="KM *"><input required type="number" value={v.mileage ?? 0} onChange={(e) => set("mileage", Number(e.target.value))} className={input} /></Field>
            <Field label="Preço (R$) *"><input required type="number" step="0.01" value={v.price ?? ""} onChange={(e) => set("price", Number(e.target.value))} className={input} /></Field>
            <Field label="Cor"><input value={v.color ?? ""} onChange={(e) => set("color", e.target.value)} className={input} placeholder="Ex: Prata" /></Field>
            <Field label="Combustível">
              <select value={v.fuel ?? ""} onChange={(e) => set("fuel", e.target.value)} className={input}>
                <option value="">—</option>
                <option>Flex</option><option>Gasolina</option><option>Etanol</option><option>Diesel</option><option>GNV</option><option>Híbrido</option><option>Elétrico</option>
              </select>
            </Field>
            <Field label="Câmbio">
              <select value={v.transmission ?? ""} onChange={(e) => set("transmission", e.target.value)} className={input}>
                <option value="">—</option>
                <option>Manual</option><option>Automático</option><option>Automatizado</option><option>CVT</option>
              </select>
            </Field>
          </div>
        </Section>

        <Section title="Descrição">
          <textarea value={v.description ?? ""} onChange={(e) => set("description", e.target.value)} rows={5} className={input + " min-h-[120px] resize-y"} placeholder="Detalhes, opcionais, estado de conservação..." />
        </Section>
      </div>

      <aside className="space-y-6">
        <Section title="Fotos">
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-dashed border-silver/40 py-6 text-sm hover:bg-silver/5 transition disabled:opacity-50">
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
            {uploading ? "Enviando..." : "Adicionar imagens"}
          </button>
          {(v.images ?? []).length > 0 && (
            <ul className="mt-3 space-y-2">
              {(v.images ?? []).map((p, i) => (
                <li key={p} className="flex items-center gap-2 rounded-md border border-border bg-background p-2">
                  <div className="size-12 overflow-hidden rounded bg-muted shrink-0">
                    <VehicleImage path={p} alt="" className="size-full object-cover" />
                  </div>
                  <div className="flex-1 text-xs text-muted-foreground truncate">{i === 0 && <span className="text-silver">Capa • </span>}foto {i + 1}</div>
                  <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0} className="size-7 grid place-items-center rounded hover:bg-muted disabled:opacity-30"><GripVertical className="size-3.5 rotate-90" /></button>
                  <button type="button" onClick={() => removeImage(p)} className="size-7 grid place-items-center rounded hover:bg-destructive/15 hover:text-destructive"><X className="size-3.5" /></button>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 text-[10px] text-muted-foreground">A primeira imagem será usada como capa.</p>
        </Section>

        <Section title="Destaque">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={!!v.featured} onChange={(e) => set("featured", e.target.checked)} className="size-4 accent-silver" />
            <span className="inline-flex items-center gap-1.5 text-sm"><Star className={`size-3.5 ${v.featured ? "fill-silver text-silver" : "text-muted-foreground"}`} /> Mostrar na home como destaque</span>
          </label>
        </Section>

        <div className="space-y-2">
          <button type="submit" disabled={saving} className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-silver py-3 text-sm uppercase tracking-widest text-black hover:bg-silver-bright disabled:opacity-50">
            {saving && <Loader2 className="size-4 animate-spin" />} {v.id ? "Salvar alterações" : "Cadastrar veículo"}
          </button>
          <button type="button" onClick={() => navigate("/admin")} className="w-full rounded-full border border-border py-3 text-xs uppercase tracking-widest hover:border-silver/40">
            Cancelar
          </button>
        </div>
      </aside>
    </form>
  );
}

const input = "w-full rounded-md bg-input border border-border px-3 py-2 text-sm focus:outline-none focus:border-silver/60";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border/60 bg-card/40 p-5">
      <h3 className="text-[10px] uppercase tracking-[0.25em] text-silver mb-4">{title}</h3>
      {children}
    </section>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
