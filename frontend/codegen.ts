import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
    schema: 'http://localhost:8000/api/graphql',
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

