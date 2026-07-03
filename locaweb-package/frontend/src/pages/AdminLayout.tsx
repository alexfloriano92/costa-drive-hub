import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, Car, Plus, UserPlus, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { clearToken } from "@/lib/auth";

export default function AdminLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [showInvite, setShowInvite] = useState(false);

  async function handleSignOut() {
    qc.clear();
    clearToken();
    navigate("/auth", { replace: true });
  }

  const nav = [
    { to: "/admin", label: "Veículos", icon: Car, exact: true },
    { to: "/admin/novo", label: "Adicionar", icon: Plus, exact: false },
  ];

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card/40">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-3 flex items-center justify-between gap-4">
          <Link to="/admin" className="flex items-center gap-3">
            <img src="/costa-logo.jpg" alt="" className="size-9 rounded-full ring-1 ring-silver/30" />
            <div className="leading-tight">
              <div className="font-display text-sm">COSTA</div>
              <div className="text-[9px] uppercase tracking-[0.3em] text-silver">Painel</div>
            </div>
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            {nav.map((n) => {
              const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
              return (
                <Link key={n.to} to={n.to} className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs uppercase tracking-widest transition ${active ? "bg-silver text-black" : "text-muted-foreground hover:text-foreground"}`}>
                  <n.icon className="size-3.5" /> {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowInvite(true)} className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs uppercase tracking-widest hover:border-silver/40">
              <UserPlus className="size-3.5" /> <span className="hidden md:inline">Novo admin</span>
            </button>
            <Link to="/" className="hidden md:inline text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">Site</Link>
            <button onClick={handleSignOut} className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs uppercase tracking-widest hover:border-destructive hover:text-destructive">
              <LogOut className="size-3.5" /> Sair
            </button>
          </div>
        </div>
        <div className="sm:hidden border-t border-border flex">
          {nav.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to} className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs uppercase tracking-widest ${active ? "bg-silver text-black" : "text-muted-foreground"}`}>
                <n.icon className="size-3.5" /> {n.label}
              </Link>
            );
          })}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 md:px-8 py-8">
        <Outlet />
      </main>

      {showInvite && <InviteDialog onClose={() => setShowInvite(false)} />}
    </div>
  );
}

function InviteDialog({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.invite(email, password);
      toast.success("Administrador criado.");
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar admin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-xl border border-silver/20 bg-card p-6 shadow-premium" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-display text-xl">Adicionar administrador</h2>
        <p className="mt-1 text-sm text-muted-foreground">Crie um novo acesso ao painel.</p>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-silver">E-mail</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-md bg-input border border-border px-3 py-2.5 text-sm" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-silver">Senha (mín. 8)</label>
            <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-md bg-input border border-border px-3 py-2.5 text-sm" />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-md border border-border py-2 text-xs uppercase tracking-widest">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-silver py-2 text-xs uppercase tracking-widest text-black disabled:opacity-50">
              {loading && <Loader2 className="size-3.5 animate-spin" />} Criar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
