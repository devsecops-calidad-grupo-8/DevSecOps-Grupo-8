module.exports = {
  testEnvironment: "jsdom",
  roots: ["<rootDir>/tests-unit"],
  collectCoverageFrom: ["app/**/*.js"],
  coverageDirectory: "coverage",
  coverageReporters: ["lcov", "text"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
