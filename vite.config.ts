import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react(), VitePWA({
    registerType: 'prompt', includeAssets: ['icon.svg', 'icon-192.png', 'icon-512.png'],
    manifest: { name: 'LernKick – Dein nächster Schritt', short_name: 'LernKick', description: 'Lerne in kurzen Runden. In deinem Tempo. Auch offline.', lang: 'de', theme_color: '#494b57', background_color: '#494b57', display: 'standalone', start_url: './', scope: './', icons: [{ src: 'icon-192.png', sizes: '192x192', type: 'image/png' }, { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' }, { src: 'icon-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }] },
    workbox: { globPatterns: ['**/*.{js,css,html,png,webp,svg,woff2,json}'], navigateFallback: 'index.html', cleanupOutdatedCaches: true }
  })]
});
