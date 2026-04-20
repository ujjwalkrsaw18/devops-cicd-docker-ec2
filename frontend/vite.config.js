import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Listen on all IP addresses (important for Docker)
    port: 3000,      // Fix the port to 3000
    proxy: {         // Local dev proxy to avoid CORS issues
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
