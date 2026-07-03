import { useNavigate } from "react-router-dom";
import { VehicleForm } from "@/components/VehicleForm";

export default function AdminNew() {
  const navigate = useNavigate();
  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Novo veículo</h1>
      <VehicleForm onDone={() => navigate("/admin")} />
    </div>
  );
}
