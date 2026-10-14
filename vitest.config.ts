import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Tests liegen neben dem Code: src/**/*.test.ts. Starten mit `npm test`.
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: { include: ["src/**/*.test.ts"] },
});
