# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Was das ist

`glabs.gui` ist die SvelteKit-Weboberfläche für [glabs](https://github.com/obcode/glabs),
gehostet als **glabs.cs.hm.edu**. Sie ist ein **Config-Editor**: Kurs-/Assignment-
Konfigurationen geführt anlegen, als YAML exportieren, und — mit hinterlegtem
GitLab-PAT — GitLab-Operationen im Browser ausführen. Das Backend ist `glabs-web`
(GraphQL/gqlgen + MongoDB), im glabs-Repo unter `cmd/glabs-web`.

Das CLI bleibt bestehen und YAML-datei-basiert. **YAML ist das Austauschformat**
zwischen CLI und Web; sie teilen keinen Live-State.

## Stack

- **SvelteKit 2**, **adapter-node** (SSR + Node-Server, kein statischer Export)
- **Svelte 5 mit Runes global** (`svelte.config.js` erzwingt `runes: true`)
- **Tailwind v4** (CSS-first, kein `tailwind.config.js`) + **daisyUI 5**
- **pnpm** (Version im `packageManager`-Feld gepinnt), **Vitest**, **ESLint 10 flat config**, **Prettier**

## Befehle

```sh
pnpm install
pnpm dev            # Vite Dev-Server
pnpm check          # svelte-kit sync && svelte-check — CI-blockierend
pnpm lint           # prettier --check . && eslint .
pnpm format         # prettier --write .
pnpm test           # vitest run (Unit-Tests in src/**/*.{test,spec}.{js,ts})
pnpm build          # Produktions-Build
```

Vor dem Commit laufen `lint-staged` (husky pre-commit) über geänderte Dateien.
Vor einem PR lokal `pnpm check && pnpm lint && pnpm test && pnpm build` grün haben.

## Svelte 5 — Runes (WICHTIG)

Das ganze Projekt läuft im **Runes-Modus**. Legacy-Syntax ist ein Compile-Fehler.
Nicht nach älteren Svelte-Beispielen (oder der plexams.gui-CLAUDE.md) richten.

- Props: `let { foo, bar = 'default' } = $props()` — **nicht** `export let`.
- Reaktiver State: `let x = $state(0)` — **nicht** ein einfaches `let`.
- Abgeleitet: `let d = $derived(x * 2)` / `$derived.by(() => …)` — **nicht** `$:`.
- Seiteneffekte: `$effect(() => …)` — **nicht** `$:` mit Nebenwirkung.
- Events: `onclick={fn}` — **nicht** `on:click`.
- Slots/Children: `{@render children?.()}` mit `children` aus `$props()` — **nicht** `<slot>`.
- Store-Zugriff mit `$store` funktioniert weiter (`$app/state`, eigene Stores).

Fremdbibliotheken, die noch Legacy-`.svelte` ausliefern, werden über
`dynamicCompileOptions` in `svelte.config.js` per `runes: false` in `node_modules`
kompiliert — nur dafür ist diese Ausnahme da.

## Styling

Tailwind v4 + daisyUI 5 werden **komplett in `src/app.css`** konfiguriert
(`@import 'tailwindcss'`, `@plugin "daisyui" { … }`). Es gibt **kein**
`tailwind.config.js` und **kein** `daisyui`-JS-Plugin-Require. Themes sind
bewusst **kuratiert** (nicht `themes: all`); die Liste in `app.css` und die im
Theme-Umschalter (`Nav.svelte`) müssen übereinstimmen. Theme wird via
`theme-change` als `data-theme` am `<html>` gesetzt.

## Daten & Auth (ab dem nächsten Schritt)

GraphQL gegen `glabs-web`, aufgerufen über `graphql-request`. Muster: SSR-`load`
holt Daten serverseitig; Mutationen laufen über einen `/api/<domain>`-Proxy im
gui-Server, danach `invalidateAll()`.

### SSR-Identity-Falle (einplanen, sobald SSR gegen das Backend spricht)

SvelteKit-SSR läuft im gui-Container **ohne OIDC-Cookie**. Ruft der SSR-`load`
die öffentliche URL, bounct der oauth2-proxy auf die Login-Seite und
`graphql-request` stirbt an `Invalid execution result`. Deshalb **zwei URLs**:

- `PUBLIC_GLABS_SERVER` — Browser, hat das Cookie.
- `GLABS_SERVER` (z. B. `http://glabs:8080/query`) — interner Hop, umgeht den Proxy.

Caddy muss `X-Remote-User` auch auf `location /` injizieren, damit die GUI ihn auf
dem internen Hop weiterreichen kann. Auth ist fail-closed über `X-Remote-User`
(bei glabs zugleich die E-Mail-Adresse); Owner kommt **immer** aus dem
authentifizierten Principal, nie aus einem GraphQL-Argument.

## Konventionen

- **Conventional Commits**: Release ist automatisiert (semantic-release auf `main`,
  `ci.yml`). Der Commit auf `main` entscheidet über den Bump. GitHub Releases sind
  das Changelog; die `version` in `package.json` bleibt ein Platzhalter.
- Ein Schritt = ein Branch = ein squash-gemergter PR.
- `package.json`-`version` nicht von Hand bumpen.

## Struktur

- `src/routes/` — Seiten (`+page.svelte`), Layouts, `load`-Funktionen, `/api`-Proxies
- `src/lib/` — wiederverwendbare Komponenten und Logik (`$lib/…`)
- `src/lib/server/` — **nur serverseitig** (Backend-Client, Auth-Kontext); nie in Client-Code importieren
- `static/` — unverändert ausgelieferte Assets
- `src/app.css` — Tailwind/daisyUI-Konfiguration
- `src/hooks.server.js` — Auth-Gate (ab nächstem Schritt)
