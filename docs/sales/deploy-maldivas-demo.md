# Deploy the Maldivas demo — click-by-click

*Turns the three delivered files (`trip.ts`, `site.config.ts`, `images.ts`) into a **live, public, no-login** demo link + QR in ~15 minutes. This same flow makes any demo — just swap the three files.*

**You need:** the 3 files saved on your computer · a GitHub account · a Cloudflare account.
**One-time:** make `mobileapp` a template → `github.com/bzamoraur/mobileapp` → **Settings → General** → check ☑ **Template repository**.

---

## Step 1 — Create the repo from the template (~2 min)
1. `github.com/bzamoraur/mobileapp` → green **Use this template** → **Create a new repository**.
2. Owner **bzamoraur**, name **`viaje-demo-maldivas`**, **Private** is fine (Cloudflare still deploys). → **Create repository**.

## Step 2 — Put the 3 files in — pick ONE path

The files must land at **exactly** these paths (uploading a same-named file replaces it):
- `src/data/trip.ts` · `src/data/images.ts` · `src/site.config.ts`

**Path A — Upload in the browser (no tools needed).** ~3 min.
1. In the new repo, click into **`src`** → then **`data`** (the page URL should end `/tree/main/src/data`).
2. **Add file ▾** → **Upload files** → drag **`trip.ts`** *and* **`images.ts`** into the box → **Commit changes**.
3. Click **`src`** in the breadcrumb (URL ends `/tree/main/src`) → **Add file ▾** → **Upload files** → drag **`site.config.ts`** → **Commit changes**.

**Path B — Use a Claude Code session (easiest if you use Claude).** ~2 min.
- `claude.ai/code` → **New session** → select **`viaje-demo-maldivas`** → attach the 3 files → say: *"Replace `src/data/trip.ts`, `src/site.config.ts` and `src/data/images.ts` with these three files, run `npm run check`, then commit and push."*

## Step 3 — (Recommended) fetch real photos so it looks stunning (~3 min)
Without this it shows tasteful gradients; with it, real Maldives photos.
1. Repo → **Actions** tab. If prompted, click **"I understand my workflows, enable them"**.
2. Left list → **Fetch images** → **Run workflow ▾** → **Run workflow**.
3. Wait ~1–2 min — it commits the photos to the repo automatically (no API key needed).

## Step 4 — Deploy on Cloudflare Pages — leave it OPEN (~4 min)
1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → pick **`viaje-demo-maldivas`** → **Begin setup**.
2. Build settings: **Framework preset** = *None* · **Build command** = `npm run build` · **Build output directory** = `dist`.
3. **Environment variables** → add **`NODE_VERSION`** = `20`. **Do NOT add `VITE_ACCESS_CODE_HASH`** — leaving it unset keeps the demo **open** (no code wall), so advisors click straight in.
4. **Save and Deploy** → wait ~1–2 min → you get **`https://viaje-demo-maldivas.pages.dev`**.

## Step 5 — Test it like an advisor will (~1 min)
- Open the URL on your **phone** → browser menu → **Add to Home Screen** → open the icon.
- Turn on **Airplane mode** → reopen → everything still works. *(Your demo's killer moment.)*
- Tap the **Snorkel** and **Experiencias** tiles → the tick-off collections; open **Frases** → press ▶ audio.

## Step 6 — QR + save the link
- Any QR generator (search "QR code generator", paste the URL) → download the PNG. Keep it on your phone / print it.
- Paste the URL into `docs/sales/demo-script.md` (the `[deploy the demo-pack beach trip]` line) and into your one-page offer.

---

## Troubleshooting
- **Build failed on Cloudflare?** Usually a half-pasted file. Re-check the 3 files are complete (`trip.ts` is ~670 lines). Path B (which runs `npm run check`) catches this *before* deploy.
- **App asks for a code?** You added `VITE_ACCESS_CODE_HASH` — remove it (Cloudflare → project → **Settings → Variables and Secrets** → delete) → re-deploy.
- **Only gradients, no photos?** Run the **Fetch images** Action (Step 3); Cloudflare auto-redeploys on the new commit.
- **No "Use this template" button?** Flip `mobileapp` → **Settings → General** → ☑ **Template repository** (one-time).

> **Demo vs. real client:** a *demo* stays open (no `VITE_ACCESS_CODE_HASH`). For a *real client's* trip, **do** set `VITE_ACCESS_CODE_HASH` (a private code) so it isn't public — see `docs/RUNBOOK.md` + `docs/DEPLOYMENT.md`.
