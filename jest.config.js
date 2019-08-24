module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'tsx'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.tsx$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig_test.json',
    },
  },
  testMatch: ['**/**/*.test.ts', '**/**/*.test.tsx'],
};
