import config from '@kubosho/configs/eslint/index.mjs';

export default [
  ...config,
  {
    files: ['**/*.ts', '**/*.tsx'],
  },
  {
    ignores: ['**/.astro/types.d.ts'],
  },
];
