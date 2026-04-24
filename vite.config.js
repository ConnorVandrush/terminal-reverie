import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    publicDir: 'public',
    server: {
      port: 5173,
      proxy: {
        '/socket.io': {
          target: env.VITE_IO_SERVER_ADDRESS,
          ws: true,
          changeOrigin: true
        },
        '/api': {
          target: env.VITE_IO_SERVER_ADDRESS,
          changeOrigin: true
        }
      }
    },
    resolve: {
      alias: {
        '@': '/src',
        '@store': '/src/store',
        '@data': '/public/data',
      }
    }
  };
});