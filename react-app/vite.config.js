import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: path.resolve(__dirname, 'postcss.config.js'),
  },
  server: {
    port: 3001,
    open: true,
  },
  optimizeDeps: {
    exclude: ['@tailwindcss/postcss']
  }
});
