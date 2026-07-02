FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/landing/package.json ./apps/landing/
COPY packages/shared/package.json ./packages/shared/
COPY apps/web/package.json ./apps/web/
RUN pnpm install --frozen-lockfile
COPY packages/shared ./packages/shared
COPY apps/landing ./apps/landing
RUN pnpm --filter @vite-hono/landing build

FROM node:22-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/apps/landing/dist ./dist
EXPOSE 5206
CMD ["serve", "dist", "-l", "5206"]
