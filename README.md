# glabs.gui

Web-Oberfläche für [glabs](https://github.com/obcode/glabs) — der Config-Editor
hinter **glabs.cs.hm.edu**. Kurs- und Assignment-Konfigurationen geführt
anlegen, als YAML exportieren und (mit hinterlegtem GitLab-Token)
GitLab-Operationen direkt im Browser ausführen.

Das `glabs`-CLI bleibt bestehen und YAML-datei-basiert; YAML ist das
Austauschformat zwischen CLI und Web.

## Stack

SvelteKit 2 · Svelte 5 (Runes global) · TypeScript · Tailwind v4 · daisyUI 5 ·
pnpm · adapter-node. GraphQL-Operationen sind über
[GraphQL Codegen](https://the-guild.dev/graphql/codegen) getippt. Backend ist
`glabs-web` (GraphQL, im [glabs-Repo](https://github.com/obcode/glabs) unter
`cmd/glabs-web`).

## Entwicklung

```sh
pnpm install
pnpm dev            # Dev-Server (Vite), erzeugt vorab die GraphQL-Typen
pnpm check          # svelte-check (blockierend in CI)
pnpm lint           # prettier --check + eslint
pnpm test           # vitest
pnpm build          # Produktions-Build (adapter-node)
pnpm codegen        # GraphQL-Typen neu erzeugen (src/lib/gql/)
pnpm schema:pull    # schema.graphql frisch aus dem glabs-Backend-Repo ziehen
```

Die GraphQL-Typen werden aus der eingecheckten `schema.graphql` erzeugt;
`dev`/`check`/`build` rufen den Codegen selbst vorab auf.

`.env` aus `.env.example` ableiten. Zwei URLs auf denselben `glabs-web`-Server
(siehe [CLAUDE.md](CLAUDE.md), Abschnitt „SSR-Identity-Falle").

## Status

Gerüst. Als Nächstes: Auth-Gate + `me`-Query, danach der Config-Editor gegen die
bestehenden GraphQL-Mutations.
