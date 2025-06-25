import config from '@kubosho/configs/eslint';
import eslintPluginAstro from 'eslint-plugin-astro';
import storybook from 'eslint-plugin-storybook';

export default [
  // Global ignores
  {
    ignores: ['dist/*', 'node_modules/', '**/.astro/**'],
  },
  ...config,
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            '**/*.test.ts',
            '**/*.test.tsx',
            '**/__tests__/**/*.ts',
            '**/__tests__/**/*.tsx',
            '**/__mocks__/**/*.ts',
            '**/.storybook/**/*.ts',
            '**/e2e/**/*.ts',
            '**/astro.config.ts',
            '**/vitest.config.ts',
            '**/playwright.config.ts',
            '**/scripts/*.ts',
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.astro'],
    rules: {
      'astro/no-set-text-directive': 'error',
      'astro/no-unused-css-selector': 'error',
      'import/no-unresolved': [
        'error',
        {
          ignore: ['astro:content'],
        },
      ],
    },
  },
  ...storybook.configs['flat/recommended'],
];
