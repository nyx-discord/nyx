// @eslint-ignore

import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  platform: 'node',
  target: 'es2022',
  splitting: false,
  sourcemap: true,
  keepNames: true,
  cjsInterop: true,
  dts: true,
  treeshake: false,
  clean: true,
});
