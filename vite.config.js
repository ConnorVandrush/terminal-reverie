import { defineConfig } from 'vite'
export default defineConfig({
  root: 'public',
  server: {
    port: 5173,
    proxy: {
      '/socket.io': {
        target: 'http://46.110.113.183:15987',
        ws: true
      },
      '/api': 'http://46.110.113.183:15987'
    }
  }
})