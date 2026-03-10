import { defineConfig } from 'vite'
export default defineConfig({
  root: 'public',
  server: {
    port: 5173,
    proxy: {
      '/socket.io': {
        target: 'http://localhost:15987',
        ws: true
      },
      '/api': 'http://localhost:15987'
    }
  }
})