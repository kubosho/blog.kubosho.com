import config from '@kubosho/configs/eslint';
import eslintPluginAstro from 'eslint-plugin-astro';

export default [
  ...config,
  ...eslintPluginAstro.configs.recommended,
  {
    ignores: ['.astro/*', 'dist/*'],
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
];
