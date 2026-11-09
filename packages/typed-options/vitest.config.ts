import { resolve } from 'path';
import configShared from '@repo/vitest-config/vitest.shared.js';

export default {
  ...configShared,
  resolve: {
    alias: {
      '#mocks': resolve(__dirname, '__tests__/mocks'),
    },
  },
};
