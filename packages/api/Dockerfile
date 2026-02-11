# -------- Base --------
FROM node:24-slim AS base
WORKDIR /app
RUN corepack enable
ENV CI=true

# -------- Build --------
FROM base AS build

COPY . .
RUN pnpm install --frozen-lockfile
# Build da API + script de migration
RUN pnpm --filter @base-monorepo/api build

# -------- Production --------
FROM node:24-slim AS production

WORKDIR /app
RUN corepack enable
ENV NODE_ENV=production
ENV CI=true

# Copia lockfile e workspace (necessário pro pnpm resolver corretamente)
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

# Copia só o package.json da API
COPY packages/api/package.json ./packages/api/package.json

# Instala só deps da API
RUN pnpm install --prod --filter @base-monorepo/api

# Copia o build da API
COPY --from=build /app/packages/api/dist ./packages/api/dist

# Copia o entrypoint
COPY packages/api/docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

# Instala netcat
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

WORKDIR /app/packages/api

EXPOSE 3000

# Agora o entrypoint roda migrations e a API
CMD ["../../docker-entrypoint.sh"]
