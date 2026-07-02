# Build the static web bundle; served by Caddy via shared volume
FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/shared/package.json packages/shared/
COPY apps/web/package.json apps/web/
RUN pnpm install --frozen-lockfile --filter @vite-hono/web --filter @vite-hono/shared
COPY packages/shared packages/shared
COPY apps/web apps/web
COPY tsconfig.base.json ./
RUN pnpm --filter @vite-hono/web build

FROM alpine:3.21
COPY --from=build /app/apps/web/dist /srv/web
CMD ["sh", "-c", "cp -r /srv/web/* /out/ && echo 'web assets copied' && sleep infinity"]
