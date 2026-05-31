type DatabaseBinding = Parameters<typeof import("drizzle-orm/d1").drizzle>[0];

declare module "cloudflare:workers" {
  export const env: {
    DB?: DatabaseBinding;
  };
}
