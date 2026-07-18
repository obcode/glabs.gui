# pnpm via Corepack (Version aus dem "packageManager"-Feld der package.json).
FROM node:24-alpine AS base
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable
WORKDIR /app

# --- Build: alle Deps installieren und die App bauen ---
FROM base AS builder
# GUI-Version aus dem semantic-release-Tag (docker.yml reicht sie als build-arg
# durch). .git ist per .dockerignore ausgeschlossen, daher greift hier nicht der
# `git describe`-Fallback aus vite.config.js — ohne diesen ARG bliebe nur der
# package.json-Platzhalter.
ARG APP_VERSION
ENV APP_VERSION=$APP_VERSION
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# --- Prod-Deps: schlankes node_modules nur mit Runtime-Abhängigkeiten ---
# Eigener Stage statt `prune`, damit das Ergebnis reproduzierbar aus dem
# Lockfile kommt (esbuild/@tailwindcss/oxide sind devDeps und fehlen hier).
# --ignore-scripts: das `prepare`-Skript (husky) ist devDep-only und hier nicht
# vorhanden; die Runtime-Deps brauchen keine Build-Skripte.
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

# --- Runtime ---
FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
# adapter-node lauscht per Default auf 0.0.0.0:3000; explizit gesetzt, damit der
# gui:3000-Upstream im Deploy garantiert passt.
ENV PORT=3000
ENV HOST=0.0.0.0
COPY --from=builder --chown=node:node /app/build build/
COPY --from=prod-deps --chown=node:node /app/node_modules node_modules/
COPY --chown=node:node package.json .
# Non-root: node:24-alpine bringt den unprivilegierten Nutzer „node" mit.
USER node
EXPOSE 3000

CMD ["node", "-r", "dotenv/config", "./build"]
