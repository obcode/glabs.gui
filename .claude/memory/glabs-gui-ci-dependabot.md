---
name: glabs-gui-ci-dependabot
description: "glabs.gui CI is green on our code; dependabot red PRs explained (vite8/ts7 blocked, kit release-age gate)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 39af97e4-3abe-479d-b3fe-de753e2e6788
---

In `glabs.gui`, **our own CI is always green** (every merged PR, v1.0.0+). Red checks on the repo have so far only been **dependabot** PRs. Keep CI in view at every step: a red check here is news, not noise.

Known-blocked majors (closed 2026-07-18; dependabot reopens if a compatible version ships):
- **Vite 8** — switches to the rolldown bundler, which breaks `@tailwindcss/postcss` (`ENOENT … tailwindcss` in build). Wait for SvelteKit/Tailwind support.
- **TypeScript 7** — the Go-based tsc crashes `svelte-check@4.7.x` in `pnpm run check`. Wait for svelte-check support.

**Release-age gate:** pnpm enforces `minimumReleaseAge ≈ 24h` (source not in repo/`.npmrc`/workflows — appears to be a pnpm 11.9 default). A dependabot bump to a package published <24h ago fails install with `ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION` (e.g. `@sveltejs/kit@2.70.0`). This is **transient** — it self-heals once the package ages; not a code problem. Also means adding a brand-new dep can fail CI for a day.

Do **not** merge dependabot major bumps of runtime libs (theme-change, dotenv) without checking — there are no runtime/e2e tests for theme switching or dotenv loading. CI-action bumps (docker/*, pnpm/action-setup) are low-risk. See [[glabs-gui-repo]].
