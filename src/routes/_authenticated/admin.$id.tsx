import { createFileRoute, useNavigate, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { VehicleForm } from "@/components/admin/VehicleForm";

export const Route = createFileRoute("/_authenticated/admin/$id")({
  component: EditVehicle,
});

function EditVehicle() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "vehicle", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("vehicles").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      return data;
    },
  });

  if (isLoading) return <div className="h-96 rounded-xl bg-card animate-pulse" />;
  if (!data) return null;

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Editar veículo</h1>
      <VehicleForm initial={data} onDone={() => navigate({ to: "/admin" })} />
    </div>
  );
}
