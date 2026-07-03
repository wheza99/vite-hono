# Port Registry

Dev and service ports for the vite-hono template monorepo.

> vite-hono (template) is slot **00**. Cross-project source of truth:
> `../PORT_REGISTRY.md`. When cloning this template, claim a free slot there
> and update every port below together (see "Changing the slot").

## Dev servers (`pnpm --filter <pkg> dev`)

| Slot | Port | App / Service        | Package              |
|:----:|:-----|:---------------------|:---------------------|
| 00   | 3000 | Hono API server      | `@vite-hono/server`  |
| 00   | 9000 | PocketBase (docker)  | `docker-compose.dev.yml` |
| 00   | 5100 | Web app (Vite)       | `@vite-hono/web`     |
| 00   | 5200 | Landing (Astro)      | `@vite-hono/landing` |
| 00   | 5300 | MCP app (Skybridge)  | `@vite-hono/mcp`     |

## Host routing (production)

```
domain.com        → 00-vitehono-landing:80
app.domain.com    → 00-vitehono-web:80
                     └── nginx dalam container web proxy:
                          /api/* → 00-vitehono-server:3000
                          /pb/*  → 00-vitehono-server:3000 → 00-vitehono-pb:8090
mcp.domain.com    → 00-vitehono-mcp:3000   (MCP endpoint di /mcp)
```

NPM (Nginx Proxy Manager) routes via Docker DNS on the shared
`nginx-proxy-manager_default` network — **no host port binding** in
`docker-compose.yml`. Internal ports are standardized: server `3000`,
PocketBase `8090`, static web/landing (nginx) `80`, MCP app `3000`.

## Local dev commands

```bash
# Landing (Astro) — port 5200
pnpm --filter @vite-hono/landing dev

# Web app (Vite) — port 5100 (set PORT to override)
pnpm --filter @vite-hono/web dev

# Server (Hono) — port from apps/server/.env (PORT, default 3000)
pnpm --filter @vite-hono/server dev

# MCP app (Skybridge) — port 5300, butuh Node ≥24 (fnm use 24)
pnpm --filter @vite-hono/mcp dev

# PocketBase — port 9000 in dev (PB_PORT)
docker compose -f docker-compose.dev.yml up -d
```

## Changing the slot

When forking, claim a free slot in `../PORT_REGISTRY.md` and update the ports
together. They live in:

- `apps/landing/package.json` → `astro dev --port 52<slot>`
- `apps/web/vite.config.ts` → `server.port` (or the `PORT` env var)
- `apps/server/.env` → `PORT`
- `apps/mcp/package.json` → `skybridge dev -p 53<slot>`
- `docker-compose.dev.yml` → `PB_PORT` + container name
- `docker-compose.yml` → all `container_name: <slot>-<project>-*` + network name
- `apps/web/nginx.conf` → proxy_pass target `<slot>-<project>-server`
- `.mcp.json` → MCP dev URL port
- `.claude/launch.json` → all ports
