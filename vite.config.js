import { defineConfig, loadEnv } from "vite"; 
import react from "@vitejs/plugin-react";
import path from "path";
import process from "node:process"; // ✅ Import process explicitly

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd()); // ✅ Use process correctly

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(process.cwd(), "src"), // ✅ Fix for __dirname
      },
    },
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:8080/api",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    optimizeDeps: {
      include: ["jwt-decode"],
    },
  };
});
