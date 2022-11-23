module.exports = {
  root: true,
  env: { browser: true, node: true, es6: true, jest: true },
  extends: [
    'eslint:recommended',
    'plugin:@next/next/recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'prettier',
  ],
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: ['./tsconfig.json'],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
      },
    },
    react: {
      version: 'detect',
    },
  },
  rules: {
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
      },
    ],
    'import/newline-after-import': 'error',
    'import/no-unresolved': [
      'error',
      {
        caseSensitive: true,
        commonjs: true,
      },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/__tests__/**',
          '**/__mocks__/**',
          '**/*.test.js',
          '**.config.js',
          '**.config.ts',
          '**/tools/**',
        ],
      },
    ],
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-use-before-define': ['error', { functions: false, classes: true, variables: true }],
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
        allowHigherOrderFunctions: true,
      },
    ],
  },
  overrides: [
    {
      files: ['*.js', '*.jsx'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
};
