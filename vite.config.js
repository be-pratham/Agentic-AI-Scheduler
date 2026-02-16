import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/webhook-test': {
        target: 'http://localhost:5678', // Points to local n8n
        changeOrigin: true,
        secure: false,
      }
    }
  }
})