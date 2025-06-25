import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
  },
  test: {
    environment: 'jsdom',
    exclude: [
      '**/.{idea,git,cache,output,temp}/**',
      '**/cypress/**',
      '**/dist/**',
      '**/e2e/**',
      '**/node_modules/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
    ],
  },
});
