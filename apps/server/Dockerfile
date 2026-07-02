# Server runs TypeScript directly via tsx (workspace shared package ships TS source)
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml tsconfig.base.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/server/package.json apps/server/
RUN pnpm install --frozen-lockfile --filter @vite-hono/server --filter @vite-hono/shared
COPY packages/shared packages/shared
COPY apps/server apps/server
ENV PORT=3000
EXPOSE 3000
WORKDIR /app/apps/server
CMD ["./node_modules/.bin/tsx", "src/index.ts"]
