import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "classic", // disables react compiler
    }),
  ],
  assetsInclude: ["**/*.MP4", "**/*.mp4"],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
