# Memory — glabs.gui

Repo-eigenes Wissen. Übergreifendes, Betriebliches und alles mit Hostnamen, Zugangsdaten oder
Pfaden steht im **privaten** `glabs.dev` (dieses Repo hier ist öffentlich).

- [TypeScript + GraphQL Codegen](glabs-gui-typescript-codegen.md) — typisierte Operationen aus `$lib/gql`, vendored Schema, TS bleibt 5.x
- [svelte-check und $env/dynamic/private](glabs-gui-env-check-gotcha.md) — eine lokale .env verengt die Typen: lokal grün, in CI rot
- [CI und dependabot](glabs-gui-ci-dependabot.md) — eigene CI ist grün; rote Checks sind dependabot (vite8/ts7 blockiert, 24h-Gate)
