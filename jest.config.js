export default {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
    moduleNameMapper: {
        '\\.(css|scss)$': '<rootDir>/test/styleMock.js'
    },
    testMatch: [
        '<rootDir>/test/**/*.test.js'
    ],
    testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
        '/examples/'
    ],
    collectCoverageFrom: [
        'src/**/*.{js,ts}',
        '!src/**/*.d.ts',
        '!src/**/*.test.{js,ts}',
        '!src/index.ts'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    transform: {
        '^.+\\.ts$': ['@swc/jest', {
            jsc: {
                parser: {
                    syntax: 'typescript',
                },
            },
        }],
    },
};
