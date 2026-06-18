import L from 'leaflet';

/**
 * Themed Leaflet markers.
 *
 * Leaflet's default PNG marker icons break under Vite (the bundler rewrites the
 * asset URLs and the images render blank). Instead of patching the default icon
 * paths, we render the pin as an inline-SVG `divIcon`: no image assets, no Vite
 * URL bug, and it matches the warm safari palette. Markers are tinted by region.
 */

// Palette values mirrored from tailwind.config.js so the pins match the theme.
const PIN_COLORS: Record<string, string> = {
  Safari: '#a64d2c', // brand-600 — terracotta / safari clay
  Zanzíbar: '#4a5838', // moss-600 — deep acacia green
};
const PIN_FALLBACK = '#a64d2c'; // brand-600

/** Map-pin SVG (filled teardrop + inner dot), sized 28×40, anchored at the tip. */
function pinSvg(color: string): string {
  return `
    <svg width="28" height="40" viewBox="0 0 28 40" xmlns="http://www.w3.org/2000/svg"
         style="filter: drop-shadow(0 4px 4px rgba(28,25,23,0.35));">
      <path d="M14 0C6.8 0 1 5.8 1 13c0 9.2 11.3 24.6 12 25.5a1.3 1.3 0 0 0 2 0C15.7 37.6 27 22.2 27 13 27 5.8 21.2 0 14 0Z"
            fill="${color}" stroke="#ffffff" stroke-width="2" />
      <circle cx="14" cy="13" r="5" fill="#ffffff" />
    </svg>`;
}

/** Builds (and caches) a themed `divIcon` for a place's region. */
const cache = new Map<string, L.DivIcon>();
export function regionIcon(region: string): L.DivIcon {
  const color = PIN_COLORS[region] ?? PIN_FALLBACK;
  const cached = cache.get(color);
  if (cached) return cached;
  const icon = L.divIcon({
    className: 'viaje-pin', // styled (reset) in index.css
    html: pinSvg(color),
    iconSize: [28, 40],
    iconAnchor: [14, 40], // tip of the teardrop
    popupAnchor: [0, -36],
  });
  cache.set(color, icon);
  return icon;
}
