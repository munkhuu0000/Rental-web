import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    "src/schema/base.schema.ts",
    "src/schema/user.schema.ts",
    "src/schema/company.schema.ts",
    "src/schema/materials.schema.ts",
    "src/schema/rental.schema.ts",
  ],
  generates: {
    "src/generated/index.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        makeResolverTypeCallable: true,
        maybeValue: "T | null",
      },
    },
  },
};

export default config;
