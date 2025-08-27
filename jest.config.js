module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'services/**/*.js',
    'models/**/*.js',
    'routes/**/*.js',
    '!tests/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  testEnvironmentOptions: {
    url: 'http://localhost'
  },
  setupFilesAfterEnv: [],
  moduleFileExtensions: ['js', 'json'],
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {},
  projects: [
    {
      displayName: 'backend',
      testMatch: ['**/tests/!(widget).test.js'],
      testEnvironment: 'node'
    },
    {
      displayName: 'frontend',
      testMatch: ['**/tests/widget.test.js'],
      testEnvironment: 'jsdom'
    }
  ]
};
