import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { api } from "@/lib/api";
import { getToken, clearToken } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<"loading" | "ok" | "no">("loading");
  const location = useLocation();

  useEffect(() => {
    if (!getToken()) { setState("no"); return; }
    api.me().then((r) => {
      if (r.user && r.user.role === "admin") setState("ok");
      else { clearToken(); setState("no"); }
    }).catch(() => { clearToken(); setState("no"); });
  }, []);

  if (state === "loading") {
    return <div className="min-h-screen grid place-items-center"><Loader2 className="size-6 animate-spin text-silver" /></div>;
  }
  if (state === "no") {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
}
