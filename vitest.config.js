/**
 * Configuration de Vitest (tests unitaires).
 * L'alias « @ » pointe vers src/, comme dans le reste du projet.
 */
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.js"],
  },
});
