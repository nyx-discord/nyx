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
  dts: {
    // Build declarations against other packages' published types (dist), not their
    // source through the dev-only custom conditions in each tsconfig.
    compilerOptions: { customConditions: [] },
  },
  treeshake: false,
  clean: true,
});
