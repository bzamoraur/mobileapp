/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath, URL } from 'node:url';

// Offline-first PWA. The app must keep working in Japan with no/poor connectivity,
// so all app-shell assets and bundled trip media are precached.
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'robots.txt'],
      manifest: {
        name: 'Tanzania & Zanzíbar',
        short_name: 'Viaje',
        description: 'Tu viaje a Tanzania y Zanzíbar, en el bolsillo. Funciona sin conexión.',
        lang: 'es',
        dir: 'ltr',
        theme_color: '#a64d2c',
        background_color: '#faf7f1',
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
