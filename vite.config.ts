import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
export default defineConfig({
  base: "/Mechatronics-Continuum/",
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      manifest: {
        name: "Mechatronics-Continuum",
        short_name: "MC Workbench",
        description: "Saj's private engineering learning workbench",
        theme_color: "#174d68",
        background_color: "#f7f5ef",
        display: "standalone",
        start_url: "/Mechatronics-Continuum/#/",
        icons: [
          {
            src: "app-icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any",
          },
        ],
      },
    }),
  ],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test-setup.ts",
    exclude: ["e2e/**", "node_modules/**"],
  },
});
