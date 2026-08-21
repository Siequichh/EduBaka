import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Only prefix for production builds (GitHub Pages project-page path - must match
  // the repo name if it ever changes, see docs/DEPLOY.md) - the dev server should
  // still serve from "/" so `npm run dev` isn't affected.
  base: command === 'build' ? '/EduBaka/' : '/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'EduBaka',
        short_name: 'EduBaka',
        description: 'Compañero de estudio para universitarios',
        theme_color: '#FF5A36',
        background_color: '#FAF3E7',
        display: 'standalone',
        start_url: '.',
        icons: [
          { src: 'pwa-icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: 'pwa-icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png}'],
      },
    }),
  ],
}))
