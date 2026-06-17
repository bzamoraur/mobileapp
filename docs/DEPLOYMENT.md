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

## Option A — connect the Git repo (recommended)

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git** → pick `bzamoraur/mobileapp`.
2. Set the build command/output above and add `VITE_ACCESS_CODE_HASH`.
3. Every push to the production branch deploys; PRs get preview URLs.

## Option B — direct upload via Wrangler (CI)

```bash
npm run build
npx wrangler pages deploy dist --project-name=viaje
```

CI can do this with `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` secrets
(token scoped to *Cloudflare Pages: Edit*). The provided GitHub Actions workflow
runs the quality gate and will deploy when those secrets are present.

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
