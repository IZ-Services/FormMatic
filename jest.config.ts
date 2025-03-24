module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transform: {    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@firebase|firebase)/)'  ],
  moduleNameMapper: {    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],  roots: ['<rootDir>/src'],  testEnvironmentOptions: {
    url: 'http://localhost'
  },  testTimeout: 10000
};