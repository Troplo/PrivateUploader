import type { CodegenConfig } from "@graphql-codegen/cli";
import { pascalCase } from "change-case-all";

let isExperiments = false;

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:34583/graphql",
  documents: ["src/**/*.graphql.ts"],
  config: {
    // Super hacky way to retain the experiments as is
    namingConvention: (str: string) => {
      if (str === "ACCOUNT_DEV_ELIGIBLE") {
        isExperiments = true;
      }
      if (isExperiments) {
        if (str === "ZZ_TEST") isExperiments = false;
        return str;
      }
      if (!str) return str;
      return pascalCase(str);
    }
  },
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
