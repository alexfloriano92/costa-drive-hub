# Frontend — Costa Veículos (SPA)

Vite + React 19 + React Router + TanStack Query + Tailwind v4.

## Desenvolvimento local

Terminal 1 — servidor PHP local (a partir da raiz do pacote):
```bash
cd .. && php -S localhost:8000
```

Terminal 2 — Vite:
```bash
npm install
npm run dev
```

Abra http://localhost:5173. As chamadas /api/* são proxied para localhost:8000.

## Build de produção

```bash
npm run build
```

Gera `dist/index.html` + `dist/assets/`. Copie o conteúdo de `dist/` + o conteúdo de `public/` para a raiz `public_html/` da Locaweb.

Veja `../README-DEPLOY.md` para o passo a passo completo.
