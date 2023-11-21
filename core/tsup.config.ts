import type { Options } from 'tsup';

export const tsup: Options = {
  splitting: true,
  clean: true,
  format: ['cjs','esm'],
  minify: true,
  bundle: true,
  skipNodeModulesBundle: true,
  entryPoints: ['src/index.ts'],
  target: 'es2020',
  outDir: 'dist',
  entry: ['src/index.ts'],
  dts: {
    footer: "declare module '@skull/core';"
  },
};
