import { defineConfig } from 'tsup';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  entry: ['src/index.ts'],
  platform: 'node',
  target: 'es2022',
  splitting: false,
  sourcemap: true,
  keepNames: true,
  cjsInterop: true,
  format: ['cjs', 'esm'],
  dts: true,
  treeshake: false,
  clean: true,
});
