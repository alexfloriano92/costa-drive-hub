import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { VehicleForm } from "@/components/admin/VehicleForm";

export const Route = createFileRoute("/_authenticated/admin/novo")({
  component: NewVehicle,
});

function NewVehicle() {
  const navigate = useNavigate();
  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Novo veículo</h1>
      <VehicleForm onDone={() => navigate({ to: "/admin" })} />
    </div>
  );
}
