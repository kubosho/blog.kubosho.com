import config from '@kubosho/configs/stylelint';

export default {
  ...config,
  ignoreFiles: ['node_modules/**/*.css', 'playwright-report/**/*.css'],
};
