---
name: glabs-gui-env-check-gotcha
description: "In glabs.gui, a local .env narrows $env/dynamic/private types so svelte-check passes locally but fails in CI"
metadata: 
  node_type: memory
  type: project
  originSessionId: 39af97e4-3abe-479d-b3fe-de753e2e6788
---

In `glabs.gui`, `svelte-check` can pass locally but **fail in CI** for `$env/dynamic/private` usage.

`env.GLABS_SERVER` (and any `$env/dynamic/private` key) is typed `string | undefined`. When a local `.env` defines the key, SvelteKit's generated `.svelte-kit` types narrow it to `string`, so `pnpm check` passes locally. CI has **no `.env`**, so the type stays `string | undefined` and `svelte-check` errors (e.g. passing it to `new GraphQLClient(url)` which wants `string`).

**Before pushing a PR that touches `$env/dynamic/private`, run check without the env:** `mv .env .env.bak && pnpm run check; mv .env.bak .env`. Fix by guarding: `const url = env.X; if (!url) throw new Error(...)` — narrows to `string` and fails fast. Callers already catch (layout → `me=null`; auth gate → no `.response` → not locked out). See [[glabs-gui-repo]].
