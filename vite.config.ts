/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath, URL } from 'node:url';
import { site } from './src/site.config';
import { presets } from './src/theme/presets';

const theme = presets[site.theme];

/** Minimal HTML-entity escape for values injected into index.html. */
const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Offline-first PWA. The app must keep working in Japan with no/poor connectivity,
// so all app-shell assets and bundled trip media are precached.
export default defineConfig({
  plugins: [
    react(),
    {
      // Inject the active trip's branding into index.html (title, theme-color,
      // description) from src/site.config.ts + the active theme.
      name: 'viaje-branding',
      transformIndexHtml(html: string) {
        return html
          .replaceAll('__APP_NAME__', esc(site.appName))
          .replaceAll('__APP_SHORT_NAME__', esc(site.shortName))
          .replaceAll('__APP_DESCRIPTION__', esc(site.description))
          .replaceAll('__THEME_COLOR__', theme.colors.brand['600']);
      },
    },
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'robots.txt'],
      manifest: {
        name: site.appName,
        short_name: site.shortName,
        description: site.description,
        lang: site.lang,
        dir: 'ltr',
        theme_color: theme.colors.brand['600'],
        background_color: theme.colors.sand['50'],
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,jpeg,webp,woff2,json}'],
        runtimeCaching: [
          {
            // Interactive-map tiles (OpenStreetMap). CacheFirst so every tile the
            // user pans over once stays available offline (load on wifi → works on
            // safari). Must precede the generic image rule below, since tiles are
            // also `destination: 'image'` and Workbox uses the first match.
            urlPattern: /^https:\/\/[abc]\.tile\.openstreetmap\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'osm-tiles',
              expiration: { maxEntries: 600, maxAgeSeconds: 60 * 60 * 24 * 60 },
              // Tiles are cross-origin: allow opaque (0) and 200 responses.
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Same-origin trip media that isn't precached.
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'trip-images',
              expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 90 },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
});
