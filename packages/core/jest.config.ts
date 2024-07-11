export default {
  displayName: '@nyx-discord/core',
  preset: '../../jest.preset.js',
  testPathIgnorePatterns: ['/helpers/'],
  coverageDirectory: '../../coverage/packages/core',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*Error.ts', '!src/**/*Meta.ts'],
  testEnvironment: 'node',
};
