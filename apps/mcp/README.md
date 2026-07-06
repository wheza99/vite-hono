# @vite-hono/mcp — Skybridge MCP app

MCP server + interactive React views yang berjalan di dalam AI hosts (ChatGPT apps / Claude connectors). Dibangun dengan [Skybridge](https://docs.skybridge.tech).

**Target user app ini adalah AI agent** — tools didefinisikan di `src/server.ts`, UI (views) di `src/views/`, di-bind lewat properti `view` pada `registerTool`.

## Requirements

- **Node ≥ 24.14** (app lain di monorepo ini cukup Node 22). Pakai fnm: `fnm use 24`.

## Dev

```bash
pnpm --filter @vite-hono/mcp dev   # atau: pnpm dev:mcp dari root
```

- MCP endpoint: `http://localhost:4000/mcp` (slot 000 = template; ganti `4<slot>` sesuai slot project)
- DevTools: `http://localhost:4000/`
- Playground (chat dengan LLM yang memanggil tools): `http://localhost:4000/try`

Test dari Claude Code: daftarkan di `.mcp.json` dengan `{"type": "http", "url": "http://localhost:4000/mcp"}` (sudah ada di root template).

## Deploy

Dua jalur:
1. **House-style VPS**: `apps/mcp/Dockerfile` (service `mcp` di `docker-compose.yml`); NPM proxy host `mcp.{domain}` → `00-vitehono-mcp:3000`
2. **Alpic Cloud**: `pnpm --filter @vite-hono/mcp deploy` (analytics + playground publik gratis)

Setelah live di public URL, register sebagai **Claude connector** / **ChatGPT app** (lihat docs Skybridge → Ship).

## Untuk agent

Selalu pakai skill `chatgpt-app-builder` (ada di `.claude/skills/`) saat merencanakan atau mengubah app ini. Contoh pola tool + view ada di `src/server.ts` (tool `start` dengan view, `get-fortune-cookie` tanpa view).
