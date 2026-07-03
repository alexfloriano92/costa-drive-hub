import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-display text-7xl text-gradient-silver">404</h1>
        <p className="mt-3 text-sm text-muted-foreground">Página não encontrada.</p>
        <Link to="/" className="mt-6 inline-block rounded-full border border-silver/40 px-6 py-2 text-sm uppercase tracking-widest hover:bg-silver hover:text-black transition">
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
