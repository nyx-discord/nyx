import type { defineConfig } from 'tsup';
import defaultConfig from '../../tsup.config.js';

type ReturnType<T> = T extends (...args: any) => infer R ? R : any;

const config: ReturnType<typeof defineConfig> = {
  ...defaultConfig,
};

export default config;
