/** Builds a Google Maps search URL from a free-text query. */
export function mapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/**
 * Builds a Google Maps **directions** URL to a free-text destination. Works
 * cross-platform: on iOS it offers to open in Maps/Google Maps, on Android it
 * deep-links to the Google Maps app.
 */
export function directionsUrl(query: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}
