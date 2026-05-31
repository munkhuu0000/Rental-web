import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
    token: process.env.CLOUDFLARE_D1_TOKEN ?? process.env.CLOUDFLARE_API_TOKEN ?? "",
  },
  verbose: true,
  schema: "./src/db/schema/index.ts",
  out: "./src/db/migrations",
  breakpoints: false,
  migrations: {
    prefix: "timestamp",
    table: "_drizzle_migrations__",
  },
});
