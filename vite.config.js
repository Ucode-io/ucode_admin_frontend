import { defineConfig } from 'vite'
import { resolve } from 'path'
import progress from 'vite-plugin-progress'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), progress()],
  publicDir: 'public',
  build: {
    outDir: 'build',
    minify: 'esbuild'
  },
  // esbuild: {
  //   drop: ['console'],
  // },
  resolve: {
    alias: [{
      find: "@", replacement: resolve(__dirname, "src")
    }]
  },
})
