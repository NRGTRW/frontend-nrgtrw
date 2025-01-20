import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    proxy: {
      // Proxy requests starting with "/api" to your backend server
      '/api': {
        target: 'http://localhost:8080', // Backend server's URL
        changeOrigin: true, // Handle CORS
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove '/api' prefix if needed
      },
    },
  },
  optimizeDeps: {
    include: ["jwt-decode"], // Include jwt-decode for optimization
  },
});
