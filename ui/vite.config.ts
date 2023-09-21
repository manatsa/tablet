import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      include: ["**/*.tsx","**/*.jsx","**/*.json","**/*.js","**/*.ts"],
    }),
  ],
  server: {
    // port:8080,
    watch: {
      usePolling: true
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: true,
      }
    }
  }

})