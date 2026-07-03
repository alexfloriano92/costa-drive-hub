import { Car } from "lucide-react";

// Imagens do backend PHP são URLs absolutas (/uploads/vehicles/xxx.jpg).
// Basta usar <img> direto.
export function VehicleImage({
  path, alt, className, loading = "lazy",
}: { path?: string | null; alt: string; className?: string; loading?: "lazy" | "eager" }) {
  if (!path) {
    return (
      <div className={`flex items-center justify-center bg-muted text-muted-foreground ${className ?? ""}`}>
        <Car className="size-12 opacity-30" />
      </div>
    );
  }
  return <img src={path} alt={alt} loading={loading} className={className} />;
}
