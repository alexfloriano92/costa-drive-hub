import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// Proxy /api para o servidor PHP local durante dev.
// Rode um servidor PHP local em outra porta:
//   php -S localhost:8000 -t ../   (a partir de frontend/)
// e ajuste PROXY_TARGET abaixo.
const PROXY_TARGET = "http://localhost:8000";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  server: {
    port: 5173,
    proxy: {
      "/api":     { target: PROXY_TARGET, changeOrigin: true },
      "/uploads": { target: PROXY_TARGET, changeOrigin: true },
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
  },
});
