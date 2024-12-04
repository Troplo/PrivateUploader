import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:34583/graphql",
  documents: ["src/**/*.graphql.ts"],
  generates: {
    "./graphql.schema.json": {
      plugins: ["introspection"]
    },
    "./src/gql/": {
      preset: "client",
      config: {
        useTypeImports: true
      }
    }
  }
};

export default config;
