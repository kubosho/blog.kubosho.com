module.exports = {
  preset: 'ts-jest',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.tsx$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig_test.json',
    },
  },
  testMatch: ['**/**/*.test.ts', '**/**/*.test.tsx'],
};
