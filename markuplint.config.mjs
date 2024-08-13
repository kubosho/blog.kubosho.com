import config from '@kubosho/configs/markuplint/index.mjs';

export default {
  ...config,
  parser: {
    '\\.astro$': '@markuplint/astro-parser',
  },
};
