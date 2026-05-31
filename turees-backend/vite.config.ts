import { defineConfig } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  server: {
    cors: true,
    allowedHosts: ["localhost", "127.0.0.1"],
  },
  optimizeDeps: {
    exclude: ["drizzle-orm", "graphql", "graphql-tag"],
  },
  plugins: [
    vinext(),
    cloudflare({
      viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
    }),
  ],
});
