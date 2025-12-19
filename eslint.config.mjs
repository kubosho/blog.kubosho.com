import config from '@kubosho/configs/eslint';
import { defineConfig } from 'eslint/config';
import eslintPluginAstro from 'eslint-plugin-astro';
import storybook from 'eslint-plugin-storybook';

export default defineConfig([
  ...config,
  {
    files: ['.astro/**/*', 'dist/**/*'],
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },
  {
    files: ['**/*.astro'],
    extends: [eslintPluginAstro.configs.recommended],
    rules: {
      'import/no-unresolved': [
        'error',
        {
          ignore: ['astro:content'],
        },
      ],
    },
  },
  {
    files: ['**/*.stories.ts', '**/*.stories.tsx'],
    extends: [storybook.configs['flat/recommended']],
  },
  {
    files: ['**/*.cjs', '**/*.mjs', '**/*.ts'],
    rules: {
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            '**/*.test.ts',
            '**/__tests__/**/*.ts',
            '**/__mocks__/**/*.ts',
            '**/.storybook/**/*.ts',
            '**/*.config.*',
            'tools/**/*.ts',
          ],
        },
      ],
      'import/no-unresolved': [
        'error',
        {
          ignore: ['astro:content'],
        },
      ],
    },
  },
]);
