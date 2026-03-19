import { defineConfig } from 'vite'
export default defineConfig(
{
  publicDir: 'public',
  server: 
  {
    port: 5173, // Vite dev server port
    proxy: 
    {
      '/socket.io': 
      {
        target: "http://localhost:15987", // Socket.IO server address
        ws: true
      },
      '/api': "http://localhost:15987" // API server address
    }
  },
  resolve:
  {
    alias:
    {
      '@': '/src',
      '@store': '/src/store',
    }
  }
})