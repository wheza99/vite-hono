# vite-hono

Production-grade startup template: **React (Vite) + Hono + PocketBase**, organized as a pnpm monorepo with shared Zod types, schema-as-code migrations, credits/subscription billing via **Whop**, and one-command Docker deploy.

Todos are the placeholder resource — clone this, replace todos with your real domain, and ship.

## Stack

| Layer    | Tech                                                     |
| -------- | -------------------------------------------------------- |
| Frontend | React 19, Vite, Tailwind 4, shadcn/ui, react-router      |
| Backend  | Hono (Node), modular routes, Zod env validation          |
| Database | PocketBase (auth, data, admin UI) — JS migrations        |
| Billing  | Whop (USD subscription, checkout embed + webhook)        |
| Marketing| Astro 6 static site (landing) — one-file rebrandable     |
| MCP app  | Skybridge — tools + views untuk AI hosts (ChatGPT/Claude), Node ≥24 |
| Deploy   | Docker Compose (NPM-routed): PB + server + web + landing + mcp |

## Structure

```
apps/
  web/        # @vite-hono/web — React SPA (shadcn ui + pattern atoms + swagger docs)
  server/     # @vite-hono/server — Hono API + PB proxy + billing + credits
  landing/    # @vite-hono/landing — Astro marketing site (rebrand via src/styles/theme.ts)
  mcp/        # @vite-hono/mcp — Skybridge MCP app: tools (src/server.ts) + views (src/views)
packages/
  shared/     # @vite-hono/shared — Zod schemas shared by web & server
infra/
  pocketbase/ # PB Dockerfile + pb_migrations (schema as code)
docker-compose.yml      # production (NPM-routed): pb + server + web + landing + mcp
docker-compose.dev.yml  # dev: PocketBase only (port 9000)
PORT_REGISTRY.md        # local dev port assignments (slot 00 = template)
```

### Subdomain architecture (production)

Routing produksi ditangani **Nginx Proxy Manager** bersama di VPS (network
eksternal `nginx-proxy-manager_default`) — tidak ada reverse proxy per project
dan tidak ada host port binding. NPM me-route domain → container by name:

```
yourdomain.com        → 00-vitehono-landing:80   (Astro static)
app.yourdomain.com    → 00-vitehono-web:80       (React SPA; nginx di dalamnya
                                                   proxy /api & /pb → server)
mcp.yourdomain.com    → 00-vitehono-mcp:3000     (Skybridge MCP app — register
                                                   sebagai Claude connector / ChatGPT app)
```

The landing site is rebranded by editing **one file**: `apps/landing/src/styles/theme.ts`
(name, accent color, domain, tagline). See `apps/landing/README.md`.

## Quick start (dev)

```bash
pnpm install

# 1. Start PocketBase (applies migrations automatically) — dev port 9000
docker compose -f docker-compose.dev.yml up -d
# port taken? PB_PORT=9094 docker compose -f docker-compose.dev.yml up -d

# 2. Create the PB superuser (used by the server for admin operations)
docker exec 00-vitehono-pb-dev /pb/pocketbase superuser upsert dev@vite-hono.local devpassword123 --dir=/pb/pb_data

# 3. Configure the server
cp apps/server/.env.example apps/server/.env   # matches the credentials above

# 4. Run web + server
pnpm dev

# 5. (Optional) Run the landing site
pnpm --filter @vite-hono/landing dev
```

- Web: http://localhost:2000
- Landing: http://localhost:1000
- MCP app (Skybridge, butuh Node ≥24): http://localhost:4000 — `pnpm dev:mcp`
- API: http://localhost:3000/api/hello
- PB Admin: http://localhost:9000/_/
- PB via proxy: http://localhost:3000/pb/api/health

> Local dev ports follow a per-project slot — see `PORT_REGISTRY.md` (template = slot 00; claim a free slot in `../PORT_REGISTRY.md` when cloning).

## Production (Docker)

```bash
cp .env.example .env   # set admin credentials, Whop keys
docker compose up -d   # builds pb + server + web + landing + mcp
```

Containers join the shared `nginx-proxy-manager_default` network; **NPM** (satu untuk seluruh VPS) yang memegang 80/443 + SSL dan me-route tiap domain ke container-nya (lihat `PORT_REGISTRY.md`). Nginx di dalam container **web** yang mem-proxy `/api/*` dan `/pb/*` ke server — jadi SPA fetch same-origin, tanpa CORS.

## Architecture notes

- **PB proxy** — the browser talks to PocketBase only through `/pb/*` on the server (via the web container's nginx in production); the PB URL is never exposed.
- **Auth** — PocketBase auth (email/password + Google OAuth via `authWithOAuth2`). The server verifies bearer tokens against PB with a 5-minute cache (`apps/server/src/lib/pocketbase.ts`).
- **API keys** — `sk-…` keys hashed with SHA-256, verified via `X-Api-Key` for `/api/public/*` routes.
- **Credits** — free plan: 3/month, pro: 100/month, lazily reset (`apps/server/src/lib/credits.ts`). Every change writes a `transactions` record.
- **Billing** — `POST /api/billing/checkout` creates a Whop checkout session rendered by `WhopCheckoutEmbed`; `POST /api/webhooks/whop` (signature-verified) flips the user's plan. Unset Whop env vars → billing endpoints return 503, everything else works.
- **Schema** — collections and security rules live in `infra/pocketbase/pb_migrations/` and apply automatically at PB boot. Client access is locked down per-user; billing fields and transactions are server-only writes.
- **Shared types** — request/response schemas in `packages/shared` (Zod), imported by both apps; the server validates request bodies with them.

## Scripts

```bash
pnpm dev          # web + server in watch mode
pnpm build        # build all packages
pnpm typecheck    # tsc across the workspace
```

## Replacing the placeholder resource

1. Add your collection in a new `infra/pocketbase/pb_migrations/*.js` file (follow the todos pattern).
2. Add Zod schemas in `packages/shared/src/schema/`.
3. Add a route file in `apps/server/src/routes/` and mount it in `index.ts`.
4. Copy `Dashboard.tsx` (list page) / `DashboardDetail.tsx` (detail page) as your UI starting points.
