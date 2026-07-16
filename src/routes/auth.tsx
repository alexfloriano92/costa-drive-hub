import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { checkAdminExists, bootstrapFirstAdmin } from "@/lib/admin.functions";
import logo from "@/assets/costa-logo.jpg.asset.json";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Acesso administrativo — Costa Veículos" }] }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: "/admin/novo" });
  },
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const check = useServerFn(checkAdminExists);
  const bootstrap = useServerFn(bootstrapFirstAdmin);

  const adminQuery = useQuery({
    queryKey: ["admin-exists"],
    queryFn: () => check(),
  });
  const adminExists = adminQuery.data?.exists ?? true;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "bootstrap">("login");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (adminQuery.data && !adminQuery.data.exists) setMode("bootstrap");
  }, [adminQuery.data]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bem-vindo!");
        navigate({ to: "/admin/novo", replace: true });
      } else {
        await bootstrap({ data: { email, password } });
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Conta de administrador criada.");
        navigate({ to: "/admin/novo", replace: true });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao autenticar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center px-4 py-12 bg-hero">
      <div className="w-full max-w-md">
        <Link to="/" className="flex flex-col items-center gap-3 mb-8">
          <img src={logo.url} alt="Costa Veículos" className="size-20 rounded-full ring-1 ring-silver/30" />
          <div className="text-center">
            <div className="font-display text-2xl">COSTA</div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-silver">Veículos</div>
          </div>
        </Link>

        <div className="rounded-2xl border border-silver/20 bg-card p-8 shadow-premium">
          <h1 className="font-display text-2xl">
            {mode === "bootstrap" ? "Criar primeiro acesso" : "Acesso administrativo"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "bootstrap"
              ? "Cadastre o primeiro administrador da loja."
              : "Acesso restrito. Entre com seu e-mail e senha."}
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-silver">E-mail</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required
                className="mt-2 w-full rounded-md bg-input border border-border px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-silver">Senha</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required minLength={mode === "bootstrap" ? 8 : 6}
                className="mt-2 w-full rounded-md bg-input border border-border px-3 py-2.5 text-sm" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-silver py-3 text-sm uppercase tracking-widest text-black hover:bg-silver-bright disabled:opacity-50">
              {loading && <Loader2 className="size-4 animate-spin" />}
              {mode === "bootstrap" ? "Criar administrador" : "Entrar"}
            </button>
          </form>

          {!adminExists && mode === "login" && (
            <p className="mt-4 text-xs text-silver text-center">
              Nenhum administrador cadastrado.{" "}
              <button onClick={() => setMode("bootstrap")} className="underline">Criar primeiro acesso</button>
            </p>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-6 py-2.5 text-xs uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition">← Voltar ao site</Link>
        </p>
      </div>
    </div>
  );
}
