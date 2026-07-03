import { Link } from "react-router-dom";
import { VehicleImage } from "./VehicleImage";
import { formatBRL, formatKm } from "@/lib/site";
import { Gauge, Calendar, Fuel } from "lucide-react";
import type { Vehicle } from "@/lib/api";

export function VehicleCard({ v }: { v: Vehicle }) {
  const sold = v.status === "vendido";
  const reserved = v.status === "reservado";
  return (
    <Link to={`/veiculo/${v.id}`} className="group relative flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition-all hover:border-silver/40 hover:shadow-premium">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <VehicleImage path={v.images?.[0]} alt={`${v.brand} ${v.model}`} className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
        {sold && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <span className="rotate-[-8deg] border-2 border-destructive px-6 py-2 text-2xl font-display tracking-widest text-destructive">VENDIDO</span>
          </div>
        )}
        {reserved && !sold && (
          <span className="absolute top-3 left-3 rounded-full bg-warning/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-black">Reservado</span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg text-foreground">
          {v.brand} <span className="text-silver">{v.model}</span>
        </h3>
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Calendar className="size-3" /> {v.year}</span>
          <span className="inline-flex items-center gap-1"><Gauge className="size-3" /> {formatKm(v.mileage)}</span>
          {v.fuel && <span className="inline-flex items-center gap-1"><Fuel className="size-3" /> {v.fuel}</span>}
        </div>
        <div className="mt-5 border-t border-border/60 pt-4 flex items-end justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-silver">Por</div>
            <div className="text-2xl font-display">{formatBRL(v.price)}</div>
          </div>
          <span className="text-xs text-silver group-hover:text-silver-bright transition">Ver detalhes →</span>
        </div>
      </div>
    </Link>
  );
}
