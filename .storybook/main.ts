import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../client/**/*.stories.tsx'],
  addons: [],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    // Merge custom configuration into the default config
    return mergeConfig(config, {
      esbuild: {
        jsx: 'automatic',
        jsxImportSource: 'react',
      },
      css: {
        modules: {
          localsConvention: 'camelCase',
        },
      },
    });
  },
};

export default config;
