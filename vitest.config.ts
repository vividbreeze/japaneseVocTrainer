import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**", "db/**", "data/**"],
      exclude: ["node_modules/**", ".next/**"],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@data": resolve(__dirname, "data"),
      "@db": resolve(__dirname, "db"),
    },
  },
});
