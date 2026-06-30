import { supabase } from "@/integrations/supabase/client";

const BUCKET = "vehicle-images";
const cache = new Map<string, { url: string; expiresAt: number }>();
const EXPIRES_IN = 60 * 60 * 24 * 7; // 7 days

export async function getSignedUrls(paths: string[]): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  const now = Date.now();
  const toFetch: string[] = [];
  for (const p of paths) {
    if (!p) continue;
    const hit = cache.get(p);
    if (hit && hit.expiresAt > now) {
      result[p] = hit.url;
    } else {
      toFetch.push(p);
    }
  }
  if (toFetch.length) {
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrls(toFetch, EXPIRES_IN);
    if (!error && data) {
      data.forEach((d, i) => {
        const p = toFetch[i];
        if (d.signedUrl) {
          cache.set(p, { url: d.signedUrl, expiresAt: now + EXPIRES_IN * 1000 - 60_000 });
          result[p] = d.signedUrl;
        }
      });
    }
  }
  return result;
}

export async function getSignedUrl(path: string): Promise<string | null> {
  const r = await getSignedUrls([path]);
  return r[path] ?? null;
}

export async function uploadVehicleImage(file: File, vehicleId: string): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${vehicleId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type });
  if (error) throw error;
  return path;
}

export async function deleteVehicleImage(path: string) {
  await supabase.storage.from(BUCKET).remove([path]);
  cache.delete(path);
}
