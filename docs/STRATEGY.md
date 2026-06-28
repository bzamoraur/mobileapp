# Viaje — Business Strategy

*A strategic assessment of Viaje as a product/service. Researched June 2026 (four-agent investigation: B2B competitors · B2C competitors · market & monetization · tech gap). This is a planning document, not a commitment.*

## Verdict

**Don't productize yet, and don't bet on consumers paying. The defensible business is B2B2C** — travel *professionals* (independent advisors, boutique agencies, tour operators) pay for a beautiful, offline, AI-generated trip app that they hand to their clients. The agency has budget and real willingness-to-pay; the family is the user; the share-link is zero-CAC distribution. That dodges the two things that kill this as a pure consumer play (low consumer WTP + brutal travel CAC).

**The first step is not to build anything — it's to sell ~3 trip apps to ~3 advisors with the factory we already have** (see `docs/GTM-H0.md`).

This is a credible **SMB / lifestyle business with an *optional* path to venture-scale** — not a slam-dunk.

## What the research established

1. **Consumers won't pay for planning — it's a free commodity.** Google, Wanderlog (free tier), Mindtrip, Layla, Wonderplan all generate AI itineraries for €0. Travel has the *highest* trial→paid conversion of any app category (~49%) but the *most compressed* ARPU (~$822 top-decile) and ~1–2 uses/yr → thin LTV, ~2% freemium conversion. Travel CAC rose +35% (2022→25) vs. +4.5% LTV; Q4 CAC ≈ 3× Q1. **Paid-acquisition consumer subscription = "neither venture nor lifestyle."**
2. **Professionals *do* pay, and the closest comps have a real product gap.** Advisors pay **$25–149/seat/mo** (Axus $25–30, Travefy $39–59, Tourwriter $99–149); volume operators **£210–1,650/mo** (Vamoos); enterprise **€3,500+/mo** (NEZASA). But the "traveller app" incumbents (Vamoos, Axus, mTrip) give a *shared* app with the agency's logo — true per-trip white-label is an upsell — and the itinerary builders (Travefy, Wetu, Tourwriter) emit **web/PDF that breaks offline.** **Nobody ships a genuinely offline, per-trip, installable, AI-one-shot-generated app.** And **Umapped shut down Oct 2025**, stranding paying advisors mid-migration.
3. **Money is made on the transaction and the memory, not the plan.** Activity affiliate pays **8–12%/booking** (Viator/GetYourGuide), hotels ~4–6% — often **€30–80/trip, more than a year's subscription**. Hopper's flexibility/insurance ancillaries drive ~40% of bookings. Polarsteps reached **18M users with no subscription**, monetizing via **print keepsakes (€36–150)** and ~zero paid acquisition.
4. **TAM is real but modest at home, big only if we go wide.** Tour-operator + agency software ≈ $1–3B globally; ~**9,000 Spanish agencies (shrinking −15% since 2020)**, ~70–80k in Europe. Spain alone ≈ a lifestyle/SMB ceiling; venture-scale needs **pan-European/global** white-label.

## Options, ranked

| Path | WTP | Build | Verdict |
|---|---|---|---|
| **B2B2C — sell to travel pros, family uses it** ⭐ | High (biz pays) | Medium | **Recommended.** Aligns payer with the offline consumer product; zero-CAC via share-link. |
| Productized service (done-for-you, no platform) | High | ~Zero | **Do first** — it's the validation step (H0) using today's factory. |
| Pure B2C subscription | Low | Medium | **Avoid.** Free incumbents, ~2% conversion, thin LTV. |
| B2C viral + affiliate/keepsake | Low–med | Med–High | **Later** — a distribution funnel + monetization layer *on top of* B2B2C. |
| Enterprise B2B SaaS (NEZASA-style) | Very high | Very High | **Not now** — heavy build, long sales, crowded. |

## Recommended plan (3 horizons)

- **H0 — Validate as a *service* (now → ~8 weeks, ~zero engineering).** Use the factory as-is. Land **3–5 design-partner advisors/agencies** (start with Umapped refugees + Spanish boutiques + our own Pangea advisor). Make their client trips by hand; charge **per-trip (€30–80)** or a small pilot retainer. Prove they'll pay; discover the must-have (likely *"drop the supplier PDF → out comes the app"* = `import-travel-plan`); collect testimonials. **Playbook: `docs/GTM-H0.md`.**
- **H1 — Build the B2B2C platform MVP (~2–4 months, if H0 says go).** Retire one-repo-per-trip (caps ~100 trips on Cloudflare). Build: generation-as-a-service (skills → API + queue + Claude API, zod schema as the auto-repair acceptance test), a `Trip` datastore, and the key primitive — **serialize a Trip → one offline-cacheable payload a single PWA shell renders.** Add a thin agent console (generate / import-PDF / edit / brand / ship), multi-tenant + per-tenant branding (theme system is ~80% there), Stripe, real auth.
- **H2 — Widen for scale (6–12 months).** Multi-language UI (the market ceiling — do early). A consumer self-serve funnel as **top-of-funnel + viral family-link loop**, monetized by **affiliate + optional print/keepsake**. Pursue **consortia/host-agency channel deals** for pan-EU. *This horizon answers "venture or lifestyle?"*

## Monetization

- **Primary (near-term):** agency subscription or per-trip, priced *below* incumbents (near-zero marginal cost lets us): e.g. **€20–40/trip** or **€29–79/advisor/mo unlimited**.
- **Secondary (scales with use):** affiliate **8–12%** on activities + insurance/eSIM ancillaries.
- **Tertiary:** print/PDF keepsake + consumer one-trip unlock.
- **CAC discipline:** assume paid UA never pays back on travel LTV — grow via **agencies (channel) + share-link (viral)**.

## Ecosystem evolution — what changes, what's reused

**Retire:** one-repo-per-trip + per-trip Cloudflare deploy + `sync-template` (brilliant bootstrap; non-starter past ~100 trips); the SHA-256 gate (→ real auth, survives as an optional share-PIN).

**Build (the platform *around* the product):** generation-as-a-service, `Trip` datastore (JSONB), the offline-payload + single-shell renderer, a non-technical **editor** over the schema (B2C's hardest/highest-value piece), multi-tenancy + white-label + custom domains (B2B), auth, billing, GDPR posture (personal booking data server-side → export/delete/retention non-negotiable).

**Reuse unchanged (the dividend — most of the *product* already exists):** the **`Trip` zod schema** (→ API contract + DB shape + editor form-model + generation acceptance test, one artifact/four jobs), the **whole rendering UI/mold** (renders any valid Trip regardless of data source), the **offline PWA shell**, the **theme system** (≈ white-label, pre-built), **feature-flags + generalized `collections`**, and the **two generation skills as prompt/recipe IP** (the moat — change the runtime, not the intelligence). Effort: shared core ~6–10 wks, B2C MVP +8–12, B2B +12–18.

## Red-team

- **Riskiest assumption:** travel pros will pay *recurring* and *switch* from Travefy/Vamoos/Axus for offline+AI+beauty, despite us lacking their **200+ supplier integrations** (their switching cost).
- **Cheapest test:** H0 — get 3 advisors to pay in 6–8 weeks with zero new code. If not, the platform won't sell.
- **Kill criteria:** <3 paying pilots; unwilling to pay >~€20/trip or >€29/mo; or they love the demo but churn after one trip.
- **Contrarian take ("a lovely hobby, not a venture"):** small/shrinking home TAM; Google/ChatGPT commoditize the *generation*; incumbents can copy "offline"; consumer side has no recurring revenue. **What would refute it:** a working zero-CAC viral loop (family recipients → trip creators) + affiliate attach + pan-EU white-label traction.
- **Mitigations:** compete on **distribution + offline UX + vertical depth + brand**, never raw generation; build the **import-PDF killer feature** + a few key supplier links; **stay lean / service-first**.

## Decision

Proceed to **H0 now** (service validation). Build H1 only if H0 clears the kill-criteria gates. Treat this as an SMB business until a viral loop + affiliate + pan-EU signal justify a venture posture.
