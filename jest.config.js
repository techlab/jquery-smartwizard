module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/test/setup.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/test/styleMock.js'
  },
  testMatch: [
    '<rootDir>/test/**/*.test.js'
  ],
  verbose: true
};
