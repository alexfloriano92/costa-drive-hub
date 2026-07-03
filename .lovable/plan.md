## Objetivo

Transformar o projeto para rodar na **Hospedagem Go da Locaweb** (PHP + MySQL compartilhado), mantendo o mesmo frontend visual e as mesmas telas, mas trocando todo o backend Supabase por PHP puro. Entregável: uma pasta `locaweb-package/` pronta para subir por FTP.

## Escopo

### Frontend (mantém React, vira SPA estática)
- Converter TanStack Start (SSR) → **Vite + React Router** (SPA client-side).
- Manter todos os componentes visuais existentes: `Header`, `Footer`, `VehicleCard`, `WhatsAppFloat`, `VehicleForm`, telas `index`, `estoque`, `veiculo/:id`, `contato`, `auth`, `admin/*`.
- Substituir `SignedImage` (URL assinada Supabase) por `<img>` direto (imagens públicas no filesystem).
- Substituir todas as chamadas `supabase.from(...)` e server functions por `fetch('/api/...')`.
- Meta tags de SEO ficam fixas no `index.html` (perde og:image dinâmico por veículo).
- Login: form email/senha chamando `/api/auth/login.php`, token JWT guardado em `localStorage`.

### Backend PHP (`locaweb-package/api/`)
Endpoints REST, cada um um arquivo `.php`:
- `auth/login.php` — POST, valida `password_hash`, devolve JWT (HS256 assinado com secret do `.env`).
- `auth/me.php` — GET, valida Bearer token.
- `vehicles/list.php` — GET público, filtros por query (categoria, marca, destaque).
- `vehicles/get.php?id=` — GET público.
- `vehicles/create.php` — POST, admin only.
- `vehicles/update.php` — POST, admin only.
- `vehicles/delete.php` — POST, admin only.
- `vehicles/upload-image.php` — POST multipart, admin only, salva em `/uploads/vehicles/<uuid>.jpg`, valida MIME e tamanho.
- `lib/db.php` — PDO MySQL singleton.
- `lib/auth.php` — encode/decode JWT, `require_admin()`.
- `lib/cors.php` — headers CORS (útil se domínio diferente).
- `.htaccess` — força HTTPS, roteamento SPA (fallback `index.html`), bloqueia `.env`.

### Banco MySQL (`locaweb-package/schema.sql`)
- `users(id, email UNIQUE, password_hash, role ENUM('admin','user'), created_at)`
- `vehicles(id CHAR(36) PK, brand, model, year, mileage, price DECIMAL, color, fuel, transmission, category, status, featured, description, images JSON, created_at, updated_at)`
- Sem RLS — permissão validada em cada endpoint PHP via `require_admin()`.
- Script de seed com o admin inicial (senha a definir na primeira execução).

### Migração de dados (`locaweb-package/migrate/`)
Script Node local `export-from-supabase.mjs` que:
1. Lê todos os veículos do Supabase atual.
2. Baixa cada imagem do bucket `vehicle-images` para `locaweb-package/uploads/vehicles/`.
3. Gera `seed-vehicles.sql` com os `INSERT` prontos (paths ajustados para `/uploads/vehicles/<file>`).
4. Você roda uma vez local, sobe a pasta `uploads/` e importa o `.sql` no phpMyAdmin da Locaweb.

## Estrutura final do pacote

```text
locaweb-package/
├── index.html              (build da SPA)
├── assets/                 (JS/CSS bundlados pelo Vite)
├── uploads/vehicles/       (imagens migradas)
├── api/
│   ├── .htaccess
│   ├── lib/{db,auth,cors}.php
│   ├── auth/{login,me}.php
│   └── vehicles/{list,get,create,update,delete,upload-image}.php
├── .htaccess               (SPA fallback + HTTPS)
├── .env.example            (DB_HOST, DB_NAME, DB_USER, DB_PASS, JWT_SECRET)
├── schema.sql
├── seed-admin.sql
└── README-DEPLOY.md        (passo a passo FTP + phpMyAdmin)
```

## Passo a passo de execução

1. **Reescrever frontend como SPA Vite pura**: novo `vite.config.ts` sem TanStack Start, remover `src/routes/`, `src/server.ts`, `src/start.ts`, integrações Supabase. Criar `src/App.tsx` com React Router equivalente e um `src/lib/api.ts` centralizado com wrappers `fetch`.
2. **Escrever backend PHP** completo em `locaweb-package/api/`.
3. **Escrever `schema.sql`** e `seed-admin.sql` (você escolhe o email/senha inicial — te pergunto depois).
4. **Escrever script de migração** que exporta Supabase → SQL + baixa imagens.
5. **Escrever `README-DEPLOY.md`** com o roteiro: criar DB no painel Locaweb → importar `schema.sql` no phpMyAdmin → editar `.env` → rodar script de migração local → subir tudo por FTP na `public_html`.
6. Build: `bun run build` gera `dist/`, script copia para `locaweb-package/` junto do backend.

## Detalhes técnicos importantes

- **JWT**: implementação HS256 em ~40 linhas de PHP puro (sem Composer, já que shared hosting complica dependências). Se preferir usar Composer + firebase/php-jwt, te aviso.
- **Uploads**: `move_uploaded_file()` + validação `finfo` de MIME real, extensão whitelist (jpg/png/webp), tamanho máx 8 MB (limite típico da Hospedagem Go).
- **CORS**: liberado só para o próprio domínio via `.htaccess`.
- **Segurança**: `password_hash(PASSWORD_BCRYPT)`, prepared statements PDO em 100% das queries, `.env` bloqueado por `.htaccess`, HTTPS forçado.
- **Sem Composer**: usa só extensões nativas do PHP (PDO, json, openssl, fileinfo) — todas presentes na Hospedagem Go.
- **PHP version**: código compatível com PHP 7.4+ (Locaweb Go permite escolher 7.4/8.0/8.1 no painel).

## O que você perde saindo do Lovable Cloud

- SSR e meta tags dinâmicas por rota (SEO por veículo).
- Painel visual do banco (usa phpMyAdmin da Locaweb).
- Preview funcional no editor Lovable (só o frontend renderiza aqui; o backend PHP só existe depois de subir na Locaweb).
- Escalabilidade — shared hosting trava se o site viralizar.

## Última confirmação antes de codar

Vou precisar de duas coisas suas depois que o código estiver pronto:
1. **Email + senha inicial do admin** (para gerar o `seed-admin.sql`).
2. **Um `JWT_SECRET` aleatório** (posso gerar um pra você).

Confirmo e começo a implementação?