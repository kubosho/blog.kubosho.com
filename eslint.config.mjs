import config from '@kubosho/configs/eslint';
import eslintPluginAstro from 'eslint-plugin-astro';
import storybook from 'eslint-plugin-storybook';

export default [
  ...config,
  ...eslintPluginAstro.configs.recommended,
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
  {
    files: ['**/*.ts'],
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
  ...storybook.configs['flat/recommended'],
];
