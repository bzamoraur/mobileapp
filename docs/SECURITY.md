# Security & privacy

The app holds **personal trip data**: booking locators, assistance phone
numbers, hotel addresses. Treat it as sensitive.

## Threat model

Realistic risks for a family link:

1. The URL getting indexed by search engines or shared too widely.
2. A casual stranger opening the link and seeing private details.

Out of scope: a determined attacker who has the URL. Because this is a static
client app, **anyone who can load the page can read the bundled data.**

## Controls in place

- **`noindex` everywhere** — `<meta robots>`, `robots.txt` (Disallow `/`), and an
  `X-Robots-Tag` header. Keeps the trip out of search results.
- **Family access code** (`src/features/access/AccessGate.tsx`) — gates the UI
  behind a code. Only the **SHA-256 hash** is built in (`VITE_ACCESS_CODE_HASH`);
  the code itself is never stored. Unlock persists for the tab session only.
- **Security headers** (`public/_headers`) — CSP, `X-Frame-Options: DENY`,
  `nosniff`, `Referrer-Policy: no-referrer`, restrictive `Permissions-Policy`.
- **External links** use `rel="noopener noreferrer"` and open in a new context.
- **No secrets in the repo** — `.env` is git-ignored; only `.env.example` ships.

## Important limitation

The access code is **deterrence, not authentication**. The JS bundle (and the
trip data inside it) is downloadable, and the hash enables an offline guessing
attack, so use a non-trivial code. For real confidentiality:

- Put **Cloudflare Access** in front of the Pages deployment (email OTP / SSO).
  This blocks the request before any asset is served. Recommended if the data is
  genuinely sensitive. See `docs/DEPLOYMENT.md`.

## Generating / rotating the access code

```bash
node scripts/hash-code.mjs "nueva-clave-familiar"
# paste the hash into the VITE_ACCESS_CODE_HASH environment variable
```

Set `VITE_ACCESS_CODE_HASH` as a build-time variable in Cloudflare Pages (and in
local `.env` for dev). Leaving it unset disables the gate (handy in dev).

## Dependencies

`npm audit` runs in CI (non-blocking). Review advisories before releases.
