import type { defineConfig } from 'tsup';

import defaultConfig from '../../tsup.config.js';

type ReturnType<T> = T extends (...args: any) => infer R ? R : any;

// Explicit variable for autocomplete support
const config: ReturnType<typeof defineConfig> = {
  ...defaultConfig,
};

// eslint-disable-next-line import/no-default-export
export default config;
