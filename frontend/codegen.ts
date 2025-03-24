import { environment } from './src/environments/environment';
import type { CodegenConfig } from '@graphql-codegen/cli'
import * as dotenv from "dotenv";

dotenv.config();

let schema = `http://localhost:8000${environment.graphqlUrl}`;

// For GitHub workflows.
if ("CODEGEN_SCHEMA" in process.env && process.env['CODEGEN_SCHEMA']) {
    schema = process.env['CODEGEN_SCHEMA'];
}

const config: CodegenConfig = {
    schema,
    generates: {
        './generated/graphql.ts': {
            plugins: [
                'typescript',
                'typescript-operations',
                'typescript-apollo-angular'
            ],
            config: {
                addExplicitOverride: true
            }
        },
        './generated/schema.graphql': {
        plugins: ['schema-ast']
        }
    },
    ignoreNoDocuments: true,
    documents: [
      "src/**/*.ts",
      "src/**/*.graphql",
    ],
}

export default config

