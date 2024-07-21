export default {
  plugins: ['prettier-plugin-astro'],
  endOfLine: 'auto',
  printWidth: 120,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
};
