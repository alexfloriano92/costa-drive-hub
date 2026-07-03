// Exporta veículos + imagens do Supabase e gera seed-vehicles.sql
// Uso: node export-from-supabase.mjs
//
// Requer: SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no ambiente,
// OU preencher as constantes abaixo. A service role key só é necessária
// se o bucket for privado (nosso caso).

import { createClient } from "@supabase/supabase-js";
import fs from "node:fs/promises";
import path from "node:path";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://csouahyzdhprrbnyfvfq.supabase.co";
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const ANON_KEY     = process.env.SUPABASE_PUBLISHABLE_KEY   || "sb_publishable_YTInC171VwKliX3lLkqjKg_RhLAaTzG";
const BUCKET       = "vehicle-images";
const UPLOAD_URL   = "/uploads/vehicles";

const OUT_DIR   = path.resolve("../uploads/vehicles");
const OUT_SQL   = path.resolve("../seed-vehicles.sql");

if (!SERVICE_KEY) {
  console.warn("⚠  SUPABASE_SERVICE_ROLE_KEY não definida — usando anon key. Se o bucket for privado, o download vai falhar.");
  console.warn("   Rode: SUPABASE_SERVICE_ROLE_KEY=xxx node export-from-supabase.mjs");
}

const sb = createClient(SUPABASE_URL, SERVICE_KEY || ANON_KEY);

function sqlEsc(v) {
  if (v === null || v === undefined) return "NULL";
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return v ? "1" : "0";
  return "'" + String(v).replace(/\\/g, "\\\\").replace(/'/g, "''") + "'";
}

async function downloadImage(remotePath) {
  const filename = remotePath.replace(/[^a-zA-Z0-9._-]/g, "_");
  const localPath = path.join(OUT_DIR, filename);
  const publicUrl = `${UPLOAD_URL}/${filename}`;

  const { data, error } = await sb.storage.from(BUCKET).download(remotePath);
  if (error) {
    console.error(`  ✗ ${remotePath}:`, error.message);
    return null;
  }
  const buf = Buffer.from(await data.arrayBuffer());
  await fs.writeFile(localPath, buf);
  console.log(`  ✓ ${remotePath} → ${filename} (${buf.length} bytes)`);
  return publicUrl;
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  console.log("→ Buscando veículos...");
  const { data: vehicles, error } = await sb.from("vehicles").select("*").order("created_at");
  if (error) throw error;
  console.log(`  ${vehicles.length} veículo(s) encontrados.\n`);

  const lines = [
    "-- Gerado por export-from-supabase.mjs",
    "SET NAMES utf8mb4;",
    "",
  ];

  for (const v of vehicles) {
    console.log(`\n[${v.brand} ${v.model}]`);
    const newImages = [];
    for (const p of v.images ?? []) {
      const u = await downloadImage(p);
      if (u) newImages.push(u);
    }
    const imagesJson = JSON.stringify(newImages);
    lines.push(
      `INSERT INTO vehicles (id, brand, model, year, mileage, price, color, fuel, transmission, category, status, featured, description, images, created_at, updated_at) VALUES (` +
      [
        sqlEsc(v.id),
        sqlEsc(v.brand),
        sqlEsc(v.model),
        sqlEsc(v.year),
        sqlEsc(v.mileage),
        sqlEsc(Number(v.price)),
        sqlEsc(v.color),
        sqlEsc(v.fuel),
        sqlEsc(v.transmission),
        sqlEsc(v.category),
        sqlEsc(v.status),
        sqlEsc(!!v.featured),
        sqlEsc(v.description),
        sqlEsc(imagesJson),
        sqlEsc(new Date(v.created_at).toISOString().slice(0, 19).replace("T", " ")),
        sqlEsc(new Date(v.updated_at).toISOString().slice(0, 19).replace("T", " ")),
      ].join(", ") + ");"
    );
  }

  await fs.writeFile(OUT_SQL, lines.join("\n") + "\n");
  console.log(`\n✅ Concluído.\n   SQL: ${OUT_SQL}\n   Imagens: ${OUT_DIR}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
