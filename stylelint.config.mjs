import config from '@kubosho/configs/stylelint';

export default {
  ...config,
  ignoreFiles: ['dist/**/*.css', 'node_modules/**/*.css'],

  rules: {
    'declaration-property-value-no-unknown': [
      true,
      {
        typesSyntax: { 'rgb()': '| <any-value>' },
      },
    ],
  },
};
