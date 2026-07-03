import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { VehicleForm } from "@/components/VehicleForm";

export default function AdminEdit() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({ queryKey: ["vehicle", id], queryFn: () => api.getVehicle(id), enabled: !!id });
  if (isLoading) return <div className="h-96 rounded-xl bg-card animate-pulse" />;
  if (!data) return null;
  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Editar veículo</h1>
      <VehicleForm initial={data} onDone={() => navigate("/admin")} />
    </div>
  );
}
