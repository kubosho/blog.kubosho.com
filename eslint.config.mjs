import config from '@kubosho/configs/eslint/index.mjs';

export default [
  ...config,
  {
    ignores: ['.astro/'],
  },
];
