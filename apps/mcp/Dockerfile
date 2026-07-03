# Skybridge MCP app — needs Node 24+ (unlike the other apps).
# Built with vite (skybridge build), served as a plain Node server.
FROM node:24-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml tsconfig.base.json ./
COPY apps/mcp/package.json apps/mcp/
RUN pnpm install --frozen-lockfile --filter @vite-hono/mcp
COPY apps/mcp apps/mcp
RUN pnpm --filter @vite-hono/mcp build

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/mcp/node_modules ./apps/mcp/node_modules
COPY --from=build /app/apps/mcp/dist ./apps/mcp/dist
COPY --from=build /app/apps/mcp/package.json ./apps/mcp/package.json
WORKDIR /app/apps/mcp
ENV PORT=3000
EXPOSE 3000
CMD ["node", "dist/__entry.js"]
