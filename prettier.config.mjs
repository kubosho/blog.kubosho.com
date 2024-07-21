import config from '@kubosho/configs/prettier/index.js';

export default {
  ...config,
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
};
