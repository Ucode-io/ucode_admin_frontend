import { defineConfig } from 'vite'
import { resolve } from 'path'
import progress from 'vite-plugin-progress'
import react from '@vitejs/plugin-react'
import { visualizer } from "rollup-plugin-visualizer";


export default defineConfig({
  plugins: [react(), progress(), visualizer()],
  publicDir: 'public',
  build: {
    outDir: 'build',
    minify: 'esbuild'
  },
  server: {
    port: 7777
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
