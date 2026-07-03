# Costa Veículos — Deploy na Locaweb Hospedagem Go

Pacote pronto para subir por FTP em hospedagem compartilhada PHP + MySQL.

## Estrutura do pacote

```
locaweb-package/
├── frontend/          → código-fonte da SPA (build gera dist/)
├── api/               → backend PHP (endpoints REST)
├── uploads/vehicles/  → imagens dos veículos (criado pela migração)
├── schema.sql         → estrutura do banco MySQL
├── seed-admin.php     → gera o INSERT do primeiro admin (rodar local)
├── .htaccess          → SPA fallback + HTTPS + segurança
├── .env.example       → variáveis de ambiente (renomear p/ .env)
└── migrate/           → script Node para exportar dados do Supabase
```

---

## Requisitos

- Hospedagem Go da Locaweb (ou qualquer PHP 7.4+ com MySQL + mod_rewrite)
- PHP com extensões: `pdo_mysql`, `openssl`, `fileinfo`, `json` (todas nativas)
- Node.js 18+ **local** (só para build do frontend e migração de dados)

---

## Passo 1 — Criar banco MySQL

No painel da Locaweb:

1. **Bancos MySQL → Criar novo banco**. Anote nome, usuário, senha, host (geralmente `mysqlXXX.locaweb.com.br`).
2. Abra o **phpMyAdmin** desse banco.
3. Vá em **Importar** e envie o arquivo `schema.sql`. Isso cria as tabelas `users` e `vehicles`.

---

## Passo 2 — Criar o admin inicial

Rode localmente (precisa PHP CLI ou pode usar o phpMyAdmin):

```bash
php seed-admin.php seu@email.com sua-senha-forte
```

O script imprime um `INSERT INTO users ...` já com o hash bcrypt.
Cole esse SQL no **phpMyAdmin → SQL** e execute.

---

## Passo 3 — Migrar dados existentes do Supabase (opcional)

Rode localmente:

```bash
cd migrate
npm install
node export-from-supabase.mjs
```

Isso gera:
- `../uploads/vehicles/<uuid>-<nome>.jpg` — todas as imagens baixadas
- `../seed-vehicles.sql` — INSERTs de todos os veículos

Importe `seed-vehicles.sql` no phpMyAdmin depois do `schema.sql`.

---

## Passo 4 — Configurar variáveis de ambiente

1. Copie `.env.example` para `.env`.
2. Preencha com os dados do banco criado no passo 1:

```env
DB_HOST=mysqlXXX.locaweb.com.br
DB_NAME=seu_banco
DB_USER=seu_usuario
DB_PASS=sua_senha
JWT_SECRET=uma_string_aleatoria_bem_longa_de_no_minimo_32_caracteres
UPLOAD_DIR=/home/USUARIO/public_html/uploads/vehicles
UPLOAD_URL=/uploads/vehicles
```

> `UPLOAD_DIR` é o caminho absoluto no servidor. Descubra rodando um `phpinfo()` ou olhando o painel FTP.
> `JWT_SECRET`: gere com `openssl rand -hex 32` ou qualquer string aleatória com 32+ caracteres.

---

## Passo 5 — Build do frontend

Localmente:

```bash
cd frontend
npm install
npm run build
```

Isso gera `frontend/dist/` com `index.html` + `assets/`.

---

## Passo 6 — Subir por FTP

Envie para `public_html/` (raiz do domínio) na seguinte estrutura:

```
public_html/
├── index.html          ← copiar de frontend/dist/index.html
├── assets/             ← copiar de frontend/dist/assets/
├── costa-logo.jpg      ← copiar de frontend/public/
├── hero-car.jpg        ← copiar de frontend/public/
├── api/                ← copiar toda a pasta api/
├── uploads/vehicles/   ← copiar todas as imagens migradas
├── .htaccess           ← copiar da raiz do pacote
└── .env                ← copiar o .env editado no passo 4
```

Dica rápida:
```bash
# Local, prepara o pacote pronto para FTP
mkdir -p dist-final
cp -r frontend/dist/* dist-final/
cp -r frontend/public/* dist-final/
cp -r api dist-final/
cp -r uploads dist-final/
cp .htaccess .env dist-final/
```
E suba `dist-final/*` para `public_html/`.

---

## Passo 7 — Ajustes de permissão

Via FTP, defina permissões:

- `uploads/vehicles/` → **755** (ou **775** se o upload falhar)
- `.env` → **600** (o `.htaccess` já bloqueia acesso HTTP a ele, mas restrinja mesmo assim)

---

## Passo 8 — Testar

- `https://seu-dominio.com.br/` → home carrega
- `https://seu-dominio.com.br/api/vehicles/list.php` → JSON com veículos
- `https://seu-dominio.com.br/auth` → tela de login
- Login com o admin criado no passo 2 → vai para `/admin`

---

## Troubleshooting

- **500 Internal Server Error**: veja o log de erro do PHP no painel Locaweb. Costuma ser `.env` faltando ou extensão PDO desativada.
- **CORS/API 404**: confirme que `mod_rewrite` está ativo. O `.htaccess` na raiz redireciona rotas SPA para `index.html`.
- **Upload falhando**: verifique `upload_max_filesize` no `php.ini` do painel (Locaweb Go permite alterar). Padrão do pacote assume 8 MB.
- **Rotas do React voltam 404 no refresh**: `.htaccess` da raiz deve estar presente. Se seu domínio está em subpasta, ajuste `RewriteBase`.
- **`Not authorized`**: token JWT expirou (7 dias). Faça login de novo.

---

## Segurança (o que está feito)

- Senhas com `password_hash(BCRYPT)`.
- JWT HS256 assinado com `JWT_SECRET` do `.env`.
- Todas as queries via PDO com prepared statements.
- Upload valida MIME real (`finfo`), extensão whitelist (jpg/png/webp), tamanho ≤ 8 MB.
- `.env` bloqueado por `.htaccess`.
- HTTPS forçado.
- `admin only` verificado em cada endpoint sensível (não confie só no frontend).

## O que **não** vem incluído (limitações da hospedagem compartilhada)

- SEO por rota (SPA usa `index.html` único).
- Reset de senha por e-mail (você pode implementar via `mail()` do PHP se precisar).
- Rate limiting (Cloudflare na frente resolve isso de graça).
