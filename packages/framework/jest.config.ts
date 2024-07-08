 
export default {
  displayName: '@nyx-discord/framework',
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/packages/framework',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*Error.ts', '!src/**/*Meta.ts'],
  testEnvironment: 'node',
};
