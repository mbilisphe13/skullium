import type { Options } from 'tsup';

const env = process.env.NODE_ENV;

export const tsup: Options = {
  splitting: true,
  clean: true,
  format: ['cjs','esm'],
  minify: true,
  bundle: true,
  external: ['vite', 'express'],
  skipNodeModulesBundle: true,
  entryPoints: ['src/index.ts'],
  target: 'es2020',
  outDir: 'dist',
  entry: ['index.ts'],
  dts: {
    footer: "declare module '@skull/inertia';"
  },
};
