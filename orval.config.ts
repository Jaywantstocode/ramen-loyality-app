import { defineConfig } from 'orval';

export default defineConfig({
  openapi: {
    input: {
      target: './docs/openapi.yaml', // OpenAPI definition file
    },
    output: {
      target: './lib/api/generated',
      schemas: './lib/api/generated/types',
      client: 'swr',
      prettier: true,
      clean: true,
      mode: 'tags-split',
      headers: true,
      override: {
        mutator: {
          path: './lib/api/mutator/custom-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },
}); 