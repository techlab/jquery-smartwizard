module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  moduleNameMapper: {
      '\\.(css|less|scss|sass)$': '<rootDir>/test/styleMock.js'
  },
  transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  testMatch: [
      '<rootDir>/test/**/*.test.js'
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  verbose: true,
  collectCoverageFrom: [
      'src/**/*.{js,ts}',
      '!src/**/*.d.ts'
  ]
};