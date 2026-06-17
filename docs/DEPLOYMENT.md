# Deployment — Cloudflare Pages

The app is a static SPA. Build output is `dist/`.

## Build settings

| Setting | Value |
| --- | --- |
| Framework preset | None / Vite |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | 20+ (`.nvmrc` / `NODE_VERSION`) |

Environment variables (Pages → Settings → Environment variables):

- `VITE_ACCESS_CODE_HASH` — SHA-256 of the family code
  (`node scripts/hash-code.mjs "code"`). Required for the gate.

`public/_redirects` provides the SPA fallback (`/* → /index.html 200`) and
`public/_headers` applies the security headers — both are copied into `dist/`.

## Option A — connect the Git repo (recommended, in use)

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git** → pick `bzamoraur/mobileapp`.
2. Set the build command/output above and add `VITE_ACCESS_CODE_HASH`
   (Settings → Variables and Secrets → Production). It's only applied to **new**
   builds, so retry the deployment after adding it.
3. Every push to the production branch deploys; PRs get preview URLs.

This is the path the project uses: Cloudflare builds and publishes on push, so
the GitHub Actions workflow runs **only** the quality gate (no deploy job).

## Option B — direct upload via Wrangler (manual alternative)

```bash
npm run build
npx wrangler pages deploy dist --project-name=viaje
```

Needs `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` (token scoped to
*Cloudflare Pages: Edit*). Use this only if you move off Option A — running it
against an Option A (Git-connected) project would create a second, competing
publish path. To wire it into CI, re-add a deploy job that runs the command with
those secrets.

## Locking it down (optional, stronger than the code gate)

Cloudflare **Zero Trust → Access → Applications** → add a self-hosted app for the
Pages domain, policy = *Allow* the family's emails (one-time PIN). This blocks
unauthenticated requests at the edge. See `docs/SECURITY.md`.

## Installing on a phone (PWA)

Open the URL → browser menu → **Add to Home Screen**. The app then launches
fullscreen and works offline (app shell + bundled images are precached).

## Custom domain

Pages → Custom domains → add a subdomain (e.g. `viaje.tudominio.com`). Cloudflare
manages TLS automatically.
