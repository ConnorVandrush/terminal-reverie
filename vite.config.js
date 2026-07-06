import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@components": "/src/react-components",
      "@store": "/src/redux-store",
      "@io": "/src/socket-io",
    },
  },
});
