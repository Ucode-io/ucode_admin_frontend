import { defineConfig } from 'vite'
import { resolve } from 'path'
// import progress from 'vite-plugin-progress'
import removeConsole from 'vite-plugin-remove-console';


import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), removeConsole()],
  publicDir: 'public',
  build: {
    outDir: 'build'
  },
  resolve: {
    alias: [{
      find: "@", replacement: resolve(__dirname, "src")
    }]
  },
})
