# Port Registry

Central list of the ports this template occupies, so multiple instances (or
other local services) don't collide. Each cloned project picks a **slot** and
fills every port in that slot with the same two-digit suffix.

The default slot for this template is **06**.

## Slot 06 (default)

| Service                     | Port | URL (local dev)                |
| --------------------------- | ---- | ------------------------------ |
| Hono API server             | 3006 | `http://localhost:3006`        |
| PocketBase                  | 9006 | `http://localhost:9006`        |
| Web app (Vite dev)          | 5106 | `http://localhost:5106`        |
| Landing (Astro dev)         | 5206 | `http://localhost:5206`        |

> **Note** — the production Docker stack (`docker-compose.yml`) deliberately
> uses the services' default internal ports (`server:3000`, `pocketbase:8090`)
> on the container network; Caddy fronts them on `80`/`443` via the subdomain
> routing in `Caddyfile`. The slot ports above are the **local dev** ports.

## Local dev commands

```bash
# Landing (Astro) — port 5206
pnpm --filter @vite-hono/landing dev

# Web app (Vite) — port 5106 (set PORT to override)
pnpm --filter @vite-hono/web dev

# Server (Hono) — port from apps/server/.env (PORT, default 3000)
pnpm --filter @vite-hono/server dev

# PocketBase — port 9006 in dev (PB_PORT)
docker compose -f docker-compose.dev.yml up -d
```

## Changing the slot

When forking, pick a free slot and update the four ports together. The dev
ports live in:

- `apps/landing/package.json` → `astro dev --port <landing>`
- `apps/web/vite.config.ts` → `server.port` (or the `PORT` env var)
- `apps/server/.env` → `PORT`
- `docker-compose.dev.yml` → `PB_PORT`
