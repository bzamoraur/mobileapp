# Trip imagery

Drop photos here as **`<slug>.webp`** (or `.jpg`). They are referenced from
`src/data/trip.ts` and bundled + precached for offline use. If a file is absent,
the UI shows a themed gradient automatically — so missing images never break the
layout, and real photos appear the moment you add them.

Recommended: landscape, ~1600 px wide, optimised (< ~350 KB). To convert:

```bash
node -e "require('sharp')('in.jpg').resize(1600).webp({quality:80}).toFile('public/img/serengeti-central.webp')"
```

## Expected slugs (subject)

| Slug | Subject |
| --- | --- |
| `hero` | App hero — dramatic Serengeti / acacia sunset |
| `arusha` | Arusha city (Clock Tower / streets) |
| `mount-meru` | Mount Meru |
| `tarangire` | Tarangire NP — elephants / baobabs |
| `lake-manyara` | Lake Manyara — flamingos / forest |
| `ngorongoro` | Ngorongoro Crater landscape |
| `olduvai` | Olduvai Gorge / museum |
| `serengeti-central` | Serengeti (Seronera) — savanna, lions |
| `serengeti-norte` | Mara River crossing / Great Migration |
| `balloon-safari` | Hot-air balloon over the Serengeti |
| `karatu` | Karatu / Ngorongoro highlands, coffee |
| `kendwa` | Kendwa beach, turquoise water |
| `mnemba` | Mnemba atoll snorkelling |
| `jozani` | Jozani forest / red colobus |
| `prison-island` | Prison Island giant tortoises |
| `stone-town` | Stone Town streets / carved doors |
| `forodhani` | Forodhani night food market |
| `spice-farm` | Zanzibar spice farm |
| **Hotels** | |
| `rivertrees` | Rivertrees Country Inn |
| `burungue` | Lake Burunge Tented Lodge |
| `kitela` | Kitela Lodge |
| `lahia` | Lahia Tented Camp |
| `mara-under-canvas` | Mara Under Canvas |
| `gold-zanzibar` | Gold Zanzibar Beach House & Spa |
| `zanzibar-serena` | Zanzibar Serena Hotel |

> Note: this environment's network blocks public photo hosts (Wikimedia,
> Unsplash, …) and the image-generation workspace was out of credits, so images
> could not be fetched automatically. Add your own photos here, or see the chat
> for options.
