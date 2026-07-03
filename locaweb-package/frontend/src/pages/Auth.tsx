import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { setToken, getToken } from "@/lib/auth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();
  const adminQ = useQuery({ queryKey: ["admin-exists"], queryFn: api.adminExists });
  const adminExists = adminQ.data?.exists ?? true;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "bootstrap">("login");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getToken()) navigate("/admin", { replace: true });
  }, [navigate]);

  useEffect(() => {
    if (adminQ.data && !adminQ.data.exists) setMode("bootstrap");
  }, [adminQ.data]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "bootstrap") {
        await api.bootstrap(email, password);
      }
      const { token } = await api.login(email, password);
      setToken(token);
      toast.success("Bem-vindo!");
      navigate("/admin", { replace: true });
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
          <img src="/costa-logo.jpg" alt="Costa Veículos" className="size-20 rounded-full ring-1 ring-silver/30" />
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
            {mode === "bootstrap" ? "Cadastre o primeiro administrador da loja." : "Acesso restrito. Entre com seu e-mail e senha."}
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-silver">E-mail</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="mt-2 w-full rounded-md bg-input border border-border px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-silver">Senha</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required minLength={mode === "bootstrap" ? 8 : 6} className="mt-2 w-full rounded-md bg-input border border-border px-3 py-2.5 text-sm" />
            </div>
            <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-silver py-3 text-sm uppercase tracking-widest text-black hover:bg-silver-bright disabled:opacity-50">
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
          <Link to="/" className="hover:text-silver">← Voltar ao site</Link>
        </p>
      </div>
    </div>
  );
}
