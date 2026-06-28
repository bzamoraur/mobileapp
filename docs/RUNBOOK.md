# Making a trip-app for a friend — runbook

What to do **every time** someone asks you for a trip-app. Most of the work is a
conversation with Claude Code in a session on the trip's repo; only a few steps
are dashboard clicks. Legend: **🧑 you (clicks)** · **💬 tell Claude (in-session)**.

---

## Once, ever (setup)
- **🧑** `github.com/bzamoraur/mobileapp` → **Settings → General** → check
  ☑ **Template repository**.
- **🧑** Make sure Claude's GitHub app can see your repos
  (GitHub → Settings → Applications → Claude → *All repositories*, or add each).

---

## Step 0 — Which kind of request is it?

| | **Type A — they have a booked plan** | **Type B — just destination + days** |
|---|---|---|
| Input | Flights, hotels, vouchers (PDF / email / photos) | A place, a length, some preferences |
| Skill | `import-travel-plan` | `generate-from-destination` |
| Result | Real bookings (flight numbers, hotel names, locators) | A researched, plausible plan; bookings left blank |

They **compose**: do Type B now, then Type A on top when the booking is made.

---

## Step 1 — Create the trip's repo · 🧑
1. `github.com/bzamoraur/mobileapp` → green **Use this template** → **Create a new repository**.
2. Name it `viaje-<friend-or-place>` (e.g. `viaje-lisboa`), set **Private**, **Create repository**.

## Step 2 — Open a Claude Code session on it · 🧑
1. `claude.ai/code` → **New session** → select repo **`bzamoraur/viaje-<…>`**.
2. **💬** *"Run `npm run new-trip -- --yes` to blank the template, then we'll fill it."*
   (This wipes the leftover Tanzania content/photos — important for privacy.)

---

## Step 3 — Fill the content

### Type A — they have a full itinerary
**Collect from your friend:** the booking docs (flights with numbers/times, hotels with names/dates, insurance, transfers), the dates, and the travellers.
- **💬** Paste/attach the docs: *"Import this booked plan with `import-travel-plan`."*
- Claude maps it to the schema (real flights/hotels/locators), picks a theme, researches places + phrasebook + practical info, and proposes a tailored collection (Step 4).

### Type B — they only know destination + days
**Collect from your friend:** destination(s) and rough regions · number of days (or exact dates) · who's going (family / couple / friends + ages) · interests (culture / food / beach / hiking / nightlife) · pace (packed vs relaxed) · budget tier.
- **💬** *"Generate a `<N>`-day `<destination>` trip for `<who>`, interests `<…>`, `<pace>` pace. **Propose 2–3 itinerary variations first.**"*
- Claude researches and proposes variations (e.g. *"packed culture"* vs *"relaxed + food"* vs *"with a 2-day coast extension"*). You pick one (or mix); Claude writes the full content layer with lodging as **suggestions** (no invented bookings).

---

## Step 4 — Tailor the tick-off section · 💬 (decide together)
Every trip gets its own "collect them all" checklist — the general form of
Tanzania's **Fauna** tracker. Pick what fits (Claude can propose):

| Trip flavour | Collection | icon · verb |
|---|---|---|
| safari / nature | keep **wildlife** (Big Five) | — · visto |
| city / cultural | **"Monumentos imprescindibles"** | landmark · visto |
| any | **"Fotos que hacer"** (photo spots) | camera · hecho |
| foodie | **"Platos que probar"** | food · probado |
| beach / islands | **"Playas y calas"** · **"Snorkel"** | waves · visto |

- **💬** *"Add a 'Monumentos' and a 'Fotos que hacer' collection; mark the top 5 monuments as highlights."* Claude writes `trip.collections` (each becomes a Home tile + a tickable page; progress saves on the phone).

## Step 5 — Photos · 💬 (optional)
- **💬** *"Run `npm run fetch:images`."* — or trigger the **Fetch images** GitHub Action (repo → Actions → Run workflow). No API key needed.
- Skipping it is fine: missing photos fall back to themed gradients.

## Step 6 — Verify + push · 💬
- **💬** *"Run `npm run check` and `npm run build`, then push and open a PR."*
  (`check` = types · lint · tests · `validate:trip` · `qa:content` content checks.)
- **🧑** Review the PR (and the Cloudflare **preview URL** it posts) on your phone, then merge.

---

## Step 7 — Access code · 🧑
- **💬** *"Generate an access-code hash for the word `<familyword>`."* (Claude runs `node scripts/hash-code.mjs`.)
- Copy the printed hash for Step 8. (Never commit it.)

## Step 8 — Deploy on Cloudflare Pages · 🧑
1. Cloudflare → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → pick `viaje-<…>`.
2. Build command `npm run build`, output dir `dist`, Node `20+` → **Save and Deploy**.
3. **Settings → Variables and Secrets → Production** → add `VITE_ACCESS_CODE_HASH` = the hash → **re-deploy** (env vars only apply to new builds).
4. Share the `https://viaje-<…>.pages.dev` URL. On a phone: open it → **Add to Home Screen** → installs, works offline.
5. *(Optional)* stronger privacy: **Zero Trust → Access → Applications** → allow the family's emails. *(Optional)* a custom domain.

---

## Later
- **Mold improved?** In the trip repo: **💬** *"Sync the mold from the template"* (`npm run sync-template`; first time it bootstraps the script).
- **Type B booking firmed up?** **💬** *"Import this booking on top with `import-travel-plan`."*

## Who does what
- **🧑 You (dashboard):** make the repo, review/merge the PR, connect Cloudflare, set the access code, share the link.
- **💬 Claude (in-session):** blank-reset, generate/import, collections, images, `check`/`build`, push/PR, image fetch, mold sync.
