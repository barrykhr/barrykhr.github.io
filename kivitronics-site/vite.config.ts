import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// BASE controls where the site is served from.
//   /kivitronics/  -> GitHub Pages project sub-path (default in this repo)
//   /              -> root of a custom domain, e.g. kivitronicsconsulting.com
// Override at build time:  BASE=/ npm run build
const base = process.env.BASE ?? '/kivitronics/'

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: '../kivitronics',
    emptyOutDir: true,
    cssMinify: 'lightningcss',
  },
})
