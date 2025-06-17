import config from '@kubosho/configs/markuplint';

export default {
  ...config,
  parser: {
    '\\.astro$': '@markuplint/astro-parser',
  },
};
