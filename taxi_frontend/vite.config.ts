import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// Vite auto-exposes env variables prefixed with VITE_ to import.meta.env.
// No special define is required for VITE_API_BASE or VITE_WS_BASE.

// PUBLIC_INTERFACE
export default defineConfig({
  plugins: [svelte()],
  server: {
    port: 3000,
    strictPort: false,
  },
});
