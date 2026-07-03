// Cliente HTTP centralizado — chama o backend PHP em /api/*
import { getToken, clearToken } from "./auth";

const BASE = "/api";

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const headers = new Headers(opts.headers);
  if (!headers.has("Content-Type") && opts.body && !(opts.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(BASE + path, { ...opts, headers });
  const ct = res.headers.get("content-type") ?? "";
  const data = ct.includes("application/json") ? await res.json() : await res.text();

  if (!res.ok) {
    if (res.status === 401) clearToken();
    const msg = (typeof data === "object" && data && "error" in data ? (data as any).error : String(data)) || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}

export type Vehicle = {
  id: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  color: string | null;
  fuel: string | null;
  transmission: string | null;
  category: string;
  status: string;
  featured: boolean;
  description: string | null;
  images: string[];
  created_at?: string;
  updated_at?: string;
};

export const api = {
  // Veículos (público)
  listVehicles: () => request<Vehicle[]>("/vehicles/list.php"),
  getVehicle:   (id: string) => request<Vehicle>(`/vehicles/get.php?id=${encodeURIComponent(id)}`),

  // Veículos (admin)
  saveVehicle:   (v: Partial<Vehicle>) => request<{ ok: true; id: string }>("/vehicles/save.php", { method: "POST", body: JSON.stringify(v) }),
  deleteVehicle: (id: string) => request<{ ok: true }>("/vehicles/delete.php", { method: "POST", body: JSON.stringify({ id }) }),
  toggleFeatured:(id: string, featured: boolean) => request<{ ok: true }>("/vehicles/toggle-featured.php", { method: "POST", body: JSON.stringify({ id, featured }) }),

  uploadImage: async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);
    const r = await request<{ path: string }>("/vehicles/upload-image.php", { method: "POST", body: fd });
    return r.path;
  },
  deleteImage: (path: string) => request<{ ok: true }>("/vehicles/delete-image.php", { method: "POST", body: JSON.stringify({ path }) }),

  // Auth
  login:        (email: string, password: string) => request<{ token: string; user: { id: string; email: string; role: string } }>("/auth/login.php", { method: "POST", body: JSON.stringify({ email, password }) }),
  me:           () => request<{ user: { id: string; email: string; role: string } | null }>("/auth/me.php"),
  adminExists:  () => request<{ exists: boolean }>("/auth/admin-exists.php"),
  bootstrap:    (email: string, password: string) => request<{ ok: true }>("/auth/bootstrap.php", { method: "POST", body: JSON.stringify({ email, password }) }),
  invite:       (email: string, password: string) => request<{ ok: true }>("/auth/invite.php", { method: "POST", body: JSON.stringify({ email, password }) }),
};
