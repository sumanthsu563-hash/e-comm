export default {
  testEnvironment: 'node',
  roots: ['<rootDir>/src/tests', '<rootDir>/tests'],
  transform: {},
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTestDB.js'],
  testTimeout: 30000,
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
};
